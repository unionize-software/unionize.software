import { spawn } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const binPath = path.join(repoRoot, "packages", "unionize-mcp", "bin", "unionize-mcp.mjs");

const child = spawn(process.execPath, [binPath, "serve"], {
  stdio: ["pipe", "pipe", "pipe"],
});

let stderr = "";
child.stderr.on("data", (d) => {
  stderr += d.toString("utf8");
});

// If the process dies immediately, that's a failure.
const timer = setTimeout(() => {
  child.kill("SIGTERM");
}, 1500);

const exitCode = await new Promise((resolve) => {
  child.on("exit", (code) => resolve(code ?? 0));
});
clearTimeout(timer);

if (exitCode !== 0 && exitCode !== 143) {
  console.error(stderr || `unionize-mcp exited with ${exitCode}`);
  process.exit(1);
}

// On success we should not have a stack trace / immediate fatal error.
if (stderr.toLowerCase().includes("error") && stderr.toLowerCase().includes("trace")) {
  console.error(stderr);
  process.exit(1);
}

console.log("unionize-mcp smoke test ok");
