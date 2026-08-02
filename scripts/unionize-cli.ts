import { readFile } from "node:fs/promises";

import {
  buildPathfinderResultForAgents,
  getGuideCatalog,
  getGuideForAgents,
  getPathfinderReference,
  getResourceTags,
  githubRepositoryUrl,
  searchGuidesForAgents,
  websiteBaseUrl,
} from "../lib/agent/unionize.ts";
import { startUnionizeMcpServer } from "./unionize-mcp.ts";

const cliVersion = "0.1.0";

function printHelp() {
  console.log(`
unionize-software ${cliVersion}

Public organizing wiki CLI and MCP bridge for unionize.software

Usage:
  unionize-software guides list [--json]
  unionize-software guides read <slug> [--json]
  unionize-software guides search <query> [--tag <tagId>] [--limit <n>] [--json]
  unionize-software tags list [--json]
  unionize-software start schema [--json]
  unionize-software start recommend --answers <json> [--json]
  unionize-software start recommend --answers-file <path> [--json]
  unionize-software intake sync [--limit <n>]
  unionize-software intake import-selfhost --data-dir <path> [--limit <n>]
  unionize-software intake list [--status <s>] [--urgency <u>] [--region <r>] [--work-type <t>] [--since <iso>] [--limit <n>]
  unionize-software intake show <id> [--json]
  unionize-software intake decrypt <id> --private-key <path>
  unionize-software intake dashboard [--port <n>] [--private-key <path>]
  unionize-software mcp serve

Project links:
  Site:   ${websiteBaseUrl}
  Repo:   ${githubRepositoryUrl}
`.trim());
}

function takeFlag(args: string[], flag: string) {
  const index = args.indexOf(flag);

  if (index === -1) {
    return false;
  }

  args.splice(index, 1);
  return true;
}

function takeOption(args: string[], option: string) {
  const index = args.indexOf(option);

  if (index === -1) {
    return undefined;
  }

  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${option}`);
  }

  args.splice(index, 2);
  return value;
}

function printJson(value: unknown) {
  console.log(JSON.stringify(value, null, 2));
}

async function readAnswersInput(args: string[]) {
  const inline = takeOption(args, "--answers");
  const file = takeOption(args, "--answers-file");

  if (!inline && !file) {
    throw new Error("Provide either --answers <json> or --answers-file <path>.");
  }

  if (inline && file) {
    throw new Error("Use either --answers or --answers-file, not both.");
  }

  const raw = inline ?? (await readFile(file!, "utf8"));
  return JSON.parse(raw);
}

async function run() {
  const args = process.argv.slice(2);

  if (args.length === 0 || takeFlag(args, "--help") || takeFlag(args, "-h")) {
    printHelp();
    return;
  }

  if (takeFlag(args, "--version") || takeFlag(args, "-v")) {
    console.log(cliVersion);
    return;
  }

  const command = args.shift();

  switch (command) {
    case "guides": {
      const subcommand = args.shift();
      const json = takeFlag(args, "--json");

      if (subcommand === "list") {
        const catalog = await getGuideCatalog();

        if (json) {
          printJson(catalog.guides);
          return;
        }

        for (const guide of catalog.guides) {
          console.log(`- ${guide.slug}: ${guide.title}`);
        }
        return;
      }

      if (subcommand === "read") {
        const slug = args.shift();

        if (!slug) {
          throw new Error("Provide a guide slug.");
        }

        const guide = await getGuideForAgents(slug);

        if (!guide) {
          throw new Error(`Guide not found: ${slug}`);
        }

        if (json) {
          printJson(guide);
          return;
        }

        console.log(`${guide.title}\n`);
        console.log(guide.body);
        return;
      }

      if (subcommand === "search") {
        const tagId = takeOption(args, "--tag");
        const limitValue = takeOption(args, "--limit");
        const query = args.join(" ").trim();

        if (!query) {
          throw new Error("Provide a search query.");
        }

        const results = await searchGuidesForAgents({
          query,
          tagId,
          limit: limitValue ? Number(limitValue) : 5,
        });

        if (json) {
          printJson(results);
          return;
        }

        for (const result of results) {
          console.log(`- ${result.title} (${result.slug})`);
          console.log(`  ${result.previewText}`);
          console.log(`  ${result.url}`);
        }
        return;
      }

      throw new Error("Unknown guides subcommand.");
    }

    case "tags": {
      const subcommand = args.shift();
      const json = takeFlag(args, "--json");

      if (subcommand !== "list") {
        throw new Error("Unknown tags subcommand.");
      }

      const tags = getResourceTags();

      if (json) {
        printJson(tags);
        return;
      }

      for (const tag of tags) {
        console.log(`- ${tag.id}: ${tag.label}`);
      }
      return;
    }

    case "start": {
      const subcommand = args.shift();
      const json = takeFlag(args, "--json");

      if (subcommand === "schema") {
        const schema = getPathfinderReference();

        if (json) {
          printJson(schema);
          return;
        }

        console.log(schema.title);
        console.log("");
        for (const question of schema.questions) {
          console.log(`- ${question.id}: ${question.prompt}`);
        }
        return;
      }

      if (subcommand === "recommend") {
        const answers = await readAnswersInput(args);
        const result = buildPathfinderResultForAgents(answers);

        if (json) {
          printJson(result);
          return;
        }

        printJson(result);
        return;
      }

      throw new Error("Unknown start subcommand.");
    }

    case "intake": {
      const subcommand = args.shift();
      const json = takeFlag(args, "--json");
      const limitValue = takeOption(args, "--limit");
      const portValue = takeOption(args, "--port");

      const { fetchAwsIntakes } = await import("../lib/intake/admin/awsSync.js");
      const { openLocalIntakeDb, upsertIntake, listIntakes, getIntakeById } = await import(
        "../lib/intake/admin/localDb.js"
      );

      if (subcommand === "sync") {
        const db = await openLocalIntakeDb();
        const items = await fetchAwsIntakes({ limit: limitValue ? Number(limitValue) : 200 });
        function isIntakeStatus(value: string): value is "new" | "triaged" | "closed" | "expired" {
          return value === "new" || value === "triaged" || value === "closed" || value === "expired";
        }

        db.transaction(() => {
          for (const item of items) {
            upsertIntake(db, {
              id: item.id,
              s3_key: item.s3_key,
              ciphertext: item.ciphertext,
              public_key_id: item.public_key_id,
              urgency: item.urgency,
              coarse_region: item.coarse_region,
              work_type: item.work_type,
              received_at: item.received_at,
              expires_at: item.expires_at,
              status: isIntakeStatus(item.status) ? item.status : "new",
              source: "aws",
            });
          }
        })();

        console.log(`Synced ${items.length} intakes into local store.`);
        return;
      }

      if (subcommand === "import-selfhost") {
        const dataDir = takeOption(args, "--data-dir");
        if (!dataDir) throw new Error("Provide --data-dir (e.g. ./data/selfhost).");

        const { importSelfhostIntakes } = await import("../lib/intake/admin/importSelfhost.js");
        const result = await importSelfhostIntakes({
          dataDir,
          limit: limitValue ? Number(limitValue) : 200,
        });

        console.log(`Imported ${result.imported} selfhost intakes from ${result.selfhostDbPath}.`);
        return;
      }

      if (subcommand === "list") {
        const status = takeOption(args, "--status");
        const urgency = takeOption(args, "--urgency");
        const region = takeOption(args, "--region");
        const workType = takeOption(args, "--work-type");
        const since = takeOption(args, "--since");

        const db = await openLocalIntakeDb();
        const rows = listIntakes(db, {
          status,
          urgency,
          region,
          workType,
          since,
          limit: limitValue ? Number(limitValue) : 50,
        });

        if (json) {
          printJson(rows);
          return;
        }

        for (const row of rows) {
          const tags = [
            row.urgency,
            row.coarse_region ?? "-",
            row.work_type ?? "-",
            row.status,
          ].join(" | ");
          console.log(`${row.id}  ${row.received_at}  ${tags}`);
        }
        return;
      }

      if (subcommand === "show") {
        const id = args.shift();
        if (!id) throw new Error("Provide an intake id.");

        const db = await openLocalIntakeDb();
        const row = getIntakeById(db, id);
        if (!row) throw new Error(`Intake not found locally: ${id}`);

        if (json) {
          printJson(row);
          return;
        }

        console.log(`${row.id}`);
        console.log(`status: ${row.status}`);
        console.log(`urgency: ${row.urgency}`);
        console.log(`coarse_region: ${row.coarse_region ?? "-"}`);
        console.log(`work_type: ${row.work_type ?? "-"}`);
        console.log(`public_key_id: ${row.public_key_id}`);
        console.log(`received_at: ${row.received_at}`);
        console.log(`expires_at: ${row.expires_at}`);
        console.log(`s3_key: ${row.s3_key}`);
        console.log(`ciphertext_chars: ${row.ciphertext.length}`);
        return;
      }

      if (subcommand === "decrypt") {
        const id = args.shift();
        if (!id) throw new Error("Provide an intake id.");

        const privateKeyPath = takeOption(args, "--private-key");
        if (!privateKeyPath) throw new Error("Provide --private-key /path/to/private-key");

        const db = await openLocalIntakeDb();
        const row = getIntakeById(db, id);
        if (!row) throw new Error(`Intake not found locally: ${id}`);

        const { decryptCiphertext } = await import("../lib/intake/admin/decryptLocal.js");
        const plaintext = await decryptCiphertext({
          ciphertextBase64: row.ciphertext,
          privateKeyPath,
        });
        console.log(plaintext);
        return;
      }

      if (subcommand === "dashboard") {
        const port = portValue ? Number(portValue) : 4317;
        const privateKeyPath = takeOption(args, "--private-key");
        const { startLocalIntakeDashboard } = await import("../lib/intake/admin/dashboardServer.js");
        await startLocalIntakeDashboard({
          port,
          hostname: "127.0.0.1",
          privateKeyPath: privateKeyPath || undefined,
        });
        return;
      }

      throw new Error("Unknown intake subcommand.");
    }

    case "mcp": {
      const subcommand = args.shift();

      if (subcommand !== "serve") {
        throw new Error("Unknown mcp subcommand.");
      }

      await startUnionizeMcpServer();
      return;
    }

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "unionize CLI failed");
  process.exit(1);
});
