import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

import { buildCatalog, readGuideBySlug, searchGuides } from "./content";
import { buildStartPath, getPathfinderReference } from "./pathfinder";

function buildGuideMarkdown(guide: Awaited<ReturnType<typeof readGuideBySlug>>) {
  if (!guide) return "";
  return [
    `# ${guide.title}`,
    "",
    `- Category: ${guide.category}`,
    `- Jurisdiction: ${guide.jurisdiction}`,
    `- Legal scope: ${guide.legal_scope}`,
    `- Web URL: https://unionize.software/resources/${guide.slug}`,
    `- Resource URI: unionize://guides/${guide.slug}`,
    "",
    guide.body.trim(),
    "",
  ].join("\n");
}

function getSingleResourceParam(value: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value;
}

export function createServer() {
  const server = new McpServer({
    name: "unionize-mcp",
    version: "0.1.0",
  });

  server.registerResource(
    "catalog",
    "unionize://catalog",
    {
      title: "unionize.software guide catalog",
      description: "Structured catalog of guide pages.",
      mimeType: "application/json",
    },
    async (uri) => {
      const catalog = await buildCatalog();
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
      description: "Start Here input keys (local).",
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
      description: "Read-only markdown guide pages.",
      mimeType: "text/markdown",
    },
    async (uri, { slug }) => {
      const guideSlug = getSingleResourceParam(slug);
      const guide = await readGuideBySlug(guideSlug);
      if (!guide) throw new Error(`Guide not found for slug: ${guideSlug}`);
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

  server.registerTool(
    "search_guides",
    {
      title: "Search unionize guides",
      description: "Search public guides from unionize.software.",
      inputSchema: {
        query: z.string(),
        limit: z.number().int().min(1).max(20).optional(),
      },
    },
    async ({ query, limit }) => {
      const results = await searchGuides(query, limit ?? 5);
      return {
        content: [{ type: "text", text: JSON.stringify({ query, count: results.length, results }, null, 2) }],
        structuredContent: { query, results },
      };
    },
  );

  server.registerTool(
    "build_start_path",
    {
      title: "Build start path",
      description: "Run the local Start Here decision engine and return a suggested path.",
      inputSchema: {},
    },
    async (answers) => ({
      content: [{ type: "text", text: JSON.stringify(buildStartPath(answers), null, 2) }],
      structuredContent: buildStartPath(answers),
    }),
  );

  return server;
}

export async function startServer() {
  const transport = new StdioServerTransport();
  const server = createServer();
  await server.connect(transport);
}
