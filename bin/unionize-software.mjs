#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliEntry = fileURLToPath(new URL("../scripts/unionize-cli.ts", import.meta.url));

const child = spawn(
  process.execPath,
  [cliEntry, ...process.argv.slice(2)],
  {
    stdio: "inherit",
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
