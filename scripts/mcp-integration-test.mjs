import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["./packages/unionize-mcp/bin/unionize-mcp.mjs", "serve"],
  cwd: process.cwd(),
  stderr: "pipe",
});

const client = new Client({ name: "unionize-mcp-test", version: "0.1.0" });
await client.connect(transport);

const catalog = await client.readResource({ uri: "unionize://catalog" });

if (!catalog?.contents?.[0]?.text) {
  throw new Error("catalog response missing text");
}

const parsed = JSON.parse(catalog.contents[0].text);
if (!parsed?.guides || !Array.isArray(parsed.guides) || parsed.guides.length !== 29) {
  throw new Error(`catalog contained ${parsed?.guides?.length ?? 0} guides instead of 29`);
}

const safetyGuide = parsed.guides.find((guide) => guide.slug === "safety-basics");
if (!safetyGuide?.reviewStatus || !safetyGuide?.riskLevel || !safetyGuide?.sourceStatus) {
  throw new Error("catalog omitted safety guide or review metadata");
}

const guideResource = await client.readResource({
  uri: "unionize://guides/protected-concerted-activity",
});
const guideText = guideResource?.contents?.[0]?.text ?? "";
for (const expected of ["Review status:", "Risk level:", "Use when:", "Structured sources"]) {
  if (!guideText.includes(expected)) {
    throw new Error(`guide resource omitted ${expected}`);
  }
}

const pathResult = await client.callTool({
  name: "build_start_path",
  arguments: {
    inUnitedStates: "yes",
    privateSectorEmployer: "yes",
    workerStatus: "employee",
    supervisoryAuthority: "no",
    workplaceType: "startup",
    workArrangement: "hybrid",
    roleFamily: "full-stack/frontend/backend",
    topIssue: "AI surveillance",
    trustedCoworkers: "1-3 trusted coworkers",
    retaliationRisk: "no",
    organizerContact: "no",
  },
});
if (!Array.isArray(pathResult?.structuredContent?.relevantResources) || pathResult.structuredContent.relevantResources.length === 0) {
  throw new Error("pathfinder returned no relevant resources");
}

const linksResult = await client.callTool({ name: "project_links", arguments: {} });
if (linksResult?.structuredContent?.githubRepositoryUrl !== "https://github.com/unionize-software/unionize.software") {
  throw new Error("project_links returned a non-canonical repository URL");
}

await client.close();
console.log("unionize-mcp integration test ok");
