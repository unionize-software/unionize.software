import { rm } from "node:fs/promises";
import path from "node:path";

async function main() {
  const buildDirectory = path.join(process.cwd(), ".next");

  await rm(buildDirectory, {
    force: true,
    recursive: true,
    maxRetries: 2,
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Failed to clean Next build directory.");
  process.exit(1);
});
