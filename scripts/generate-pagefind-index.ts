import { spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";

async function main() {
  const outputDirectory = path.join(process.cwd(), "out");
  const pagefindBinary = path.join(
    process.cwd(),
    "node_modules",
    ".bin",
    process.platform === "win32" ? "pagefind.exe" : "pagefind",
  );

  try {
    await access(outputDirectory);
  } catch {
    console.log("Pagefind placeholder: no ./out directory exists yet, skipping index generation.");
    return;
  }

  try {
    await access(pagefindBinary);
  } catch {
    console.log("Pagefind placeholder: pagefind is not installed, skipping index generation.");
    return;
  }

  const result = spawnSync(pagefindBinary, ["--site", outputDirectory, "--output-subdir", "pagefind"], {
    stdio: "inherit",
  });

  process.exit(result.status ?? 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Pagefind indexing failed.");
  process.exit(1);
});

