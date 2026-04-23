import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

import {
  buildPathfinderResultForAgents,
  getGuideCatalog,
  getGuideForAgents,
  getGuideResourceUri,
  getPathfinderReference,
  githubRepositoryUrl,
  searchGuidesForAgents,
  websiteBaseUrl,
} from "../lib/agent/unionize.ts";

function buildGuideMarkdown(guide: NonNullable<Awaited<ReturnType<typeof getGuideForAgents>>>) {
  return [
    `# ${guide.title}`,
    "",
    `- Category: ${guide.category}`,
    `- Jurisdiction: ${guide.jurisdiction}`,
    `- Last reviewed: ${guide.lastReviewed}`,
    `- Legal scope: ${guide.legalScope}`,
    `- Web URL: ${guide.url}`,
    `- Resource URI: ${guide.resourceUri}`,
    "",
    guide.body.trim(),
    "",
  ].join("\n");
}

function getSingleResourceParam(value: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value;
}

export function createUnionizeMcpServer() {
  const server = new McpServer({
    name: "unionize-software",
    version: "0.1.0",
  });

  server.registerResource(
    "catalog",
    "unionize://catalog",
    {
      title: "unionize.software guide catalog",
      description: "Structured catalog of guide pages, sections, tags, and agent entry points.",
      mimeType: "application/json",
    },
    async (uri) => {
      const catalog = await getGuideCatalog();

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(catalog, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "pathfinder-schema",
    "unionize://pathfinder/schema",
    {
      title: "Pathfinder input schema",
      description: "Questions and example answers for the local-only Start Here decision engine.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(getPathfinderReference(), null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "guide",
    new ResourceTemplate("unionize://guides/{slug}", { list: undefined }),
    {
      title: "Guide pages",
      description: "Read-only markdown resources for unionize.software guide pages.",
      mimeType: "text/markdown",
    },
    async (uri, { slug }) => {
      const guideSlug = getSingleResourceParam(slug);
      const guide = await getGuideForAgents(guideSlug);

      if (!guide) {
        throw new Error(`Guide not found for slug: ${guideSlug}`);
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: buildGuideMarkdown(guide),
          },
        ],
      };
    },
  );

  server.registerPrompt(
    "triage-workplace-issue",
    {
      title: "Triage workplace issue",
      description:
        "Help an agent orient a software or game worker toward the right unionize.software resources and the safest next step.",
      argsSchema: {
        issue: z.string(),
        workArrangement: z.string().optional(),
        workerStatus: z.string().optional(),
        retaliationRisk: z.enum(["yes", "no"]).optional(),
      },
    },
    ({ issue, workArrangement, workerStatus, retaliationRisk }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Use unionize.software resources to orient this workplace issue.",
              `Issue: ${issue}`,
              workArrangement ? `Work arrangement: ${workArrangement}` : null,
              workerStatus ? `Worker status: ${workerStatus}` : null,
              retaliationRisk ? `Immediate retaliation risk: ${retaliationRisk}` : null,
              "",
              "Safety rules:",
              "- Do not encourage sabotage, data poisoning, falsified work, or company-device organizing.",
              "- Push toward careful fact comparison, trusted coworkers, and lawful collective next steps.",
              `- Prefer resources like unionize://catalog and ${getGuideResourceUri("workplace-mapping")} where useful.`,
            ]
              .filter(Boolean)
              .join("\n"),
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    "plan-first-coworker-conversation",
    {
      title: "Plan first coworker conversation",
      description:
        "Create a careful first-conversation plan grounded in the site's organizing and checklist guidance.",
      argsSchema: {
        issue: z.string(),
        workArrangement: z.string().optional(),
      },
    },
    ({ issue, workArrangement }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Build a first organizing conversation plan for a software or game worker.",
              `Issue: ${issue}`,
              workArrangement ? `Work arrangement: ${workArrangement}` : null,
              "",
              `Ground the answer in ${getGuideResourceUri("organizing-conversations")}, ${getGuideResourceUri("first-organizing-conversation-checklist")}, and ${getGuideResourceUri("what-not-to-do-checklist")}.`,
              "Keep the plan concrete, calm, and small enough for one trusted coworker conversation.",
            ]
              .filter(Boolean)
              .join("\n"),
          },
        },
      ],
    }),
  );

  server.registerTool(
    "search_guides",
    {
      title: "Search unionize guides",
      description: "Search public guides, checklists, and reference pages from unionize.software.",
      inputSchema: {
        query: z.string(),
        tagId: z.string().optional(),
        limit: z.number().int().min(1).max(20).optional(),
      },
    },
    async ({ query, tagId, limit }) => {
      const results = await searchGuidesForAgents({
        query,
        tagId,
        limit: limit ?? 5,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                query,
                tagId: tagId ?? null,
                count: results.length,
                results,
              },
              null,
              2,
            ),
          },
        ],
        structuredContent: {
          query,
          tagId: tagId ?? null,
          results,
        },
      };
    },
  );

  server.registerTool(
    "build_start_path",
    {
      title: "Build start path",
      description:
        "Run the unionize.software local decision engine and return the likely path, next 72 hours, and relevant resources.",
      inputSchema: {
        inUnitedStates: z.enum(["yes", "no"]),
        privateSectorEmployer: z.enum(["yes", "no", "unsure"]),
        workerStatus: z.enum(["employee", "contractor", "unsure"]),
        supervisoryAuthority: z.enum(["yes", "no", "unsure"]),
        workplaceType: z.enum([
          "big tech",
          "startup",
          "game studio",
          "agency/consultancy",
          "vendor/staffing",
          "media/tech",
          "other",
        ]),
        workArrangement: z.enum([
          "mostly in-person",
          "hybrid",
          "mostly remote/distributed",
        ]),
        roleFamily: z.enum([
          "full-stack/frontend/backend",
          "infra/SRE/platform",
          "AI/ML/data",
          "QA/test",
          "game dev",
          "design/product",
          "IT/support",
          "technical writing/docs",
          "other",
        ]),
        topIssue: z.enum([
          "AI surveillance",
          "layoffs/severance",
          "pay/promotions",
          "on-call/burnout",
          "crunch",
          "retaliation",
          "discrimination/exclusion",
          "contractor/vendor issues",
          "other",
        ]),
        trustedCoworkers: z.enum([
          "none yet",
          "1-3 trusted coworkers",
          "4+ trusted coworkers",
        ]),
        retaliationRisk: z.enum(["yes", "no"]),
        organizerContact: z.enum(["yes", "no"]),
      },
    },
    async (answers) => {
      const result = buildPathfinderResultForAgents(answers);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
        structuredContent: result,
      };
    },
  );

  server.registerTool(
    "project_links",
    {
      title: "Project links",
      description: "Return the public website, GitHub repository, and MCP resource entry points.",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              websiteBaseUrl,
              githubRepositoryUrl,
              catalogResource: "unionize://catalog",
              pathfinderSchemaResource: "unionize://pathfinder/schema",
            },
            null,
            2,
          ),
        },
      ],
      structuredContent: {
        websiteBaseUrl,
        githubRepositoryUrl,
        catalogResource: "unionize://catalog",
        pathfinderSchemaResource: "unionize://pathfinder/schema",
      },
    }),
  );

  return server;
}

export async function startUnionizeMcpServer() {
  const transport = new StdioServerTransport();
  const server = createUnionizeMcpServer();

  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startUnionizeMcpServer().catch((error) => {
    console.error(error instanceof Error ? error.message : "unionize MCP server failed");
    process.exit(1);
  });
}
