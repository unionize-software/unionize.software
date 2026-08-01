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
if (!parsed?.guides || !Array.isArray(parsed.guides) || parsed.guides.length < 5) {
  throw new Error("catalog did not contain expected guides list");
}

await client.close();
console.log("unionize-mcp integration test ok");
