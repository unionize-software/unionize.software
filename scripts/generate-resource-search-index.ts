import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getGuideSearchIndex } from "../lib/content/getGuides";
import type { GuideSearchIndexPayload } from "../lib/content/searchIndex";

async function main() {
  const outputDirectory = path.join(process.cwd(), "public", "search");
  const outputPath = path.join(outputDirectory, "resources-index.json");
  const guides = await getGuideSearchIndex();

  const payload: GuideSearchIndexPayload = {
    generatedAt: new Date().toISOString(),
    guides,
  };

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, JSON.stringify(payload), "utf8");

  console.log(`Generated static resource search index with ${guides.length} guides.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Resource search index generation failed.");
  process.exit(1);
});
