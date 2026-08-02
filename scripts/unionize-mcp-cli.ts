import { startUnionizeMcpServer } from "./unionize-mcp";

function printHelp() {
  console.log(`
unionize-mcp

Usage:
  unionize-mcp serve

This runs the unionize.software MCP server over stdio.
`.trim());
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

  throw new Error(`Unknown unionize-mcp command: ${command}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "unionize-mcp failed");
  process.exit(1);
});
