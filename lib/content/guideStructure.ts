export type GuideHeading = {
  id: string;
  title: string;
  depth: 2 | 3 | 4;
};

function stripInlineFormatting(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]+/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function slugifyHeading(value: string) {
  return stripInlineFormatting(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractGuideHeadings(body: string) {
  const headings: GuideHeading[] = [];
  const matches = body.matchAll(/^(#{2,4})\s+(.+?)\s*$/gm);

  for (const match of matches) {
    const depth = match[1].length as 2 | 3 | 4;
    const title = stripInlineFormatting(match[2]);
    const id = slugifyHeading(title);

    if (!title || !id) {
      continue;
    }

    headings.push({
      id,
      title,
      depth,
    });
  }

  return headings;
}

export function guideHasSourcesSection(body: string) {
  return extractGuideHeadings(body).some((heading) => heading.depth === 2 && heading.id === "sources");
}
