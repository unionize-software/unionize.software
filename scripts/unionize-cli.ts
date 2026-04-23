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
