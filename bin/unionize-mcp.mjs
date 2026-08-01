#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const cliEntry = fileURLToPath(new URL("../scripts/unionize-mcp-cli.ts", import.meta.url));
const require = createRequire(import.meta.url);
const tsxEntry = require.resolve("tsx/cli");

const child = spawn(process.execPath, [tsxEntry, cliEntry, ...process.argv.slice(2)], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
