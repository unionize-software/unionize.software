import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

import {
  guideFrontmatterSchema,
  staticPageFrontmatterSchema,
  type GuideFrontmatter,
  type StaticPageFrontmatter,
} from "@/lib/content/frontmatterSchema";

const guidesDirectory = path.join(process.cwd(), "content", "guides");
const staticPagesDirectory = path.join(process.cwd(), "content", "pages");

export type GuideListDocument = GuideFrontmatter & {
  excerpt: string;
};

export type GuideSearchIndexDocument = GuideListDocument & {
  searchText: string;
};

export type GuideDocument = GuideSearchIndexDocument & {
  body: string;
};

export type StaticPageDocument = StaticPageFrontmatter & {
  body: string;
};

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

async function readDirectoryFiles(directory: string) {
  const entries = await fs.readdir(directory);
  return entries.filter((entry) => entry.endsWith(".mdx"));
}

export const getGuideSlugs = cache(async () => {
  const files = await readDirectoryFiles(guidesDirectory);
  return files.map((fileName) => fileName.replace(/\.mdx$/, "")).sort((left, right) => left.localeCompare(right));
});

function parseGuideSource(source: string): GuideDocument {
  const { data, content } = matter(source);
  const frontmatter = guideFrontmatterSchema.parse(data);
  const searchText = toPlainText(content);

  return {
    ...frontmatter,
    body: content,
    excerpt: extractExcerpt(content),
    searchText,
  };
}

function toGuideListDocument(guide: GuideDocument): GuideListDocument {
  return {
    title: guide.title,
    slug: guide.slug,
    category: guide.category,
    jurisdiction: guide.jurisdiction,
    legal_scope: guide.legal_scope,
    last_reviewed: guide.last_reviewed,
    review_status: guide.review_status,
    risk_level: guide.risk_level,
    excerpt: guide.excerpt,
  };
}

function toGuideSearchIndexDocument(guide: GuideDocument): GuideSearchIndexDocument {
  return {
    ...toGuideListDocument(guide),
    searchText: guide.searchText,
  };
}

const getGuideListBySlug = cache(async (slug: string): Promise<GuideListDocument | null> => {
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return null;
  }

  return toGuideListDocument(guide);
});

const getGuideSearchIndexBySlug = cache(async (slug: string): Promise<GuideSearchIndexDocument | null> => {
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return null;
  }

  return toGuideSearchIndexDocument(guide);
});

export const getGuides = cache(async (): Promise<GuideListDocument[]> => {
  const slugs = await getGuideSlugs();
  const guides = await Promise.all(slugs.map((slug) => getGuideListBySlug(slug)));

  return guides
    .filter((guide): guide is GuideListDocument => guide !== null)
    .sort((left, right) => left.title.localeCompare(right.title));
});

export const getGuideSearchIndex = cache(async (): Promise<GuideSearchIndexDocument[]> => {
  const slugs = await getGuideSlugs();
  const guides = await Promise.all(slugs.map((slug) => getGuideSearchIndexBySlug(slug)));

  return guides
    .filter((guide): guide is GuideSearchIndexDocument => guide !== null)
    .sort((left, right) => left.title.localeCompare(right.title));
});

export const getGuideBySlug = cache(async (slug: string): Promise<GuideDocument | null> => {
  try {
    const source = await fs.readFile(path.join(guidesDirectory, `${slug}.mdx`), "utf8");
    const guide = parseGuideSource(source);

    return guide.slug === slug ? guide : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
});

export const getStaticPageBySlug = cache(async (slug: string): Promise<StaticPageDocument | null> => {
  const files = await readDirectoryFiles(staticPagesDirectory);

  for (const fileName of files) {
    const source = await fs.readFile(path.join(staticPagesDirectory, fileName), "utf8");
    const { data, content } = matter(source);
    const frontmatter = staticPageFrontmatterSchema.parse(data);

    if (frontmatter.slug === slug) {
      return {
        ...frontmatter,
        body: content,
      };
    }
  }

  return null;
});
