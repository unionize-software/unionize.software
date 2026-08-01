import { startUnionizeMcpServer } from "./server.ts";

function printHelp() {
  // Keep this minimal: most hosts just need `serve`.
  console.log(
    `
unionize-mcp

Usage:
  unionize-mcp serve

Runs the unionize.software MCP server over stdio.
`.trim(),
  );
}

async function run() {
  const args = process.argv.slice(2);
  const command = args.shift();

  if (!command || command === "serve") {
    await startUnionizeMcpServer();
    return;
  }

  if (command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "unionize-mcp failed");
  process.exit(1);
});
