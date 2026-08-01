import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import { z } from "zod";

const guideFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string().default("Guide"),
  page_type: z.string().default("guide"),
  jurisdiction: z.string().default("US"),
  legal_scope: z.string().default("educational"),
  last_reviewed: z.string().optional().default(""),
  review_status: z.string().optional().default(""),
  risk_level: z.string().optional().default(""),
  source_status: z.string().optional().default(""),
  when_to_use: z.union([z.array(z.string()), z.string()]).optional().default([]),
  not_for: z.union([z.array(z.string()), z.string()]).optional().default([]),
  collections: z.array(z.string()).optional().default([]),
  related_slugs: z.array(z.string()).optional().default([]),
});

export type GuideDoc = z.infer<typeof guideFrontmatterSchema> & {
  body: string;
  searchText: string;
  excerpt: string;
};

function normalizeStringList(value: string[] | string | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toPlainText(body: string) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-\[\]\(\)`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExcerpt(body: string) {
  return toPlainText(body).slice(0, 180);
}

function getContentRoot() {
  // packages/unionize-mcp/content/...
  const here = fileURLToPath(import.meta.url);
  return path.join(path.dirname(here), "..", "content");
}

const guidesDirectory = path.join(getContentRoot(), "guides");

async function readDirectoryFiles(directory: string) {
  const entries = await fs.readdir(directory);
  return entries.filter((entry) => entry.endsWith(".mdx"));
}

export async function listGuideSlugs() {
  const files = await readDirectoryFiles(guidesDirectory);
  return files.map((fileName) => fileName.replace(/\.mdx$/, "")).sort((a, b) => a.localeCompare(b));
}

export async function readGuideBySlug(slug: string): Promise<GuideDoc | null> {
  try {
    const source = await fs.readFile(path.join(guidesDirectory, `${slug}.mdx`), "utf8");
    const { data, content } = matter(source);
    const fmRaw = guideFrontmatterSchema.parse(data);
    const fm = {
      ...fmRaw,
      when_to_use: normalizeStringList(fmRaw.when_to_use as any),
      not_for: normalizeStringList(fmRaw.not_for as any),
    };
    if (fm.slug !== slug) return null;
    const searchText = toPlainText(content);
    return {
      ...fm,
      body: content,
      searchText,
      excerpt: extractExcerpt(content),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function buildCatalog() {
  const slugs = await listGuideSlugs();
  const guides = await Promise.all(slugs.map(readGuideBySlug));
  const docs = guides.filter(Boolean) as GuideDoc[];
  return {
    guides: docs
      .map((g) => ({
        title: g.title,
        slug: g.slug,
        category: g.category,
        jurisdiction: g.jurisdiction,
        legal_scope: g.legal_scope,
        last_reviewed: g.last_reviewed,
        excerpt: g.excerpt,
      }))
      .sort((l, r) => l.title.localeCompare(r.title)),
  };
}

export async function searchGuides(query: string, limit = 5) {
  const q = query.toLowerCase();
  const slugs = await listGuideSlugs();
  const guides = await Promise.all(slugs.map(readGuideBySlug));
  const docs = guides.filter(Boolean) as GuideDoc[];

  const scored = docs
    .map((g) => {
      const hay = `${g.title}\n${g.searchText}`.toLowerCase();
      const score = hay.includes(q) ? 1 : 0;
      return { g, score };
    })
    .filter((x) => x.score > 0)
    .slice(0, 200)
    .map(({ g }) => ({
      title: g.title,
      slug: g.slug,
      previewText: g.excerpt,
      url: `https://unionize.software/resources/${g.slug}`,
    }))
    .slice(0, limit);

  return scored;
}
