import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

type Severity = "error" | "warning";

type Finding = {
  file: string;
  severity: Severity;
  rule: string;
  message: string;
};

type ContentRecord = {
  file: string;
  kind: "guide" | "page";
  data: Record<string, unknown>;
  body: string;
  words: number;
};

const root = process.cwd();
const guidesDir = path.join(root, "content", "guides");
const pagesDir = path.join(root, "content", "pages");

const recommendedMinimums: Record<string, number> = {
  checklist: 300,
  playbook: 550,
  reference: 550,
  evidence: 800,
};

const templatedPatterns = [
  { name: "binary-reframe", expression: /\b(?:is|are|does|do) not\b[^.]{0,120}\.\s+(?:It|They|That) (?:is|are|means?)/gi },
  { name: "does-not-mean", expression: /\b(?:that|this|it) does not mean\b/gi },
  { name: "the-issue-is", expression: /\bthe (?:issue|point|goal|answer|problem) is\b/gi },
  { name: "two-things-true", expression: /\btwo things can be true\b/gi },
] as const;

const deprecatedSourceUrls = new Map([
  [
    "https://www.nlrb.gov/news-outreach/news-story/nlrb-general-counsel-issues-memo-on-unlawful-electronic-surveillance-and",
    "GC Memo 23-02 was rescinded by GC 25-05 on 2025-02-14; cite the rescission and current, narrower authority instead.",
  ],
]);

function countWords(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function paragraphs(value: string) {
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
    .filter((paragraph) => paragraph && !paragraph.startsWith("#") && !paragraph.startsWith("-") && !paragraph.startsWith("```"));
}

function firstProseParagraph(value: string) {
  return paragraphs(value)[0] ?? "";
}

function normalizedOpening(value: string) {
  return firstProseParagraph(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .slice(0, 5)
    .join(" ");
}

async function loadDirectory(directory: string, kind: ContentRecord["kind"]) {
  const names = (await fs.readdir(directory)).filter((name) => name.endsWith(".mdx")).sort();

  return Promise.all(
    names.map(async (name): Promise<ContentRecord> => {
      const absolute = path.join(directory, name);
      const raw = await fs.readFile(absolute, "utf8");
      const parsed = matter(raw);
      return {
        file: path.relative(root, absolute).replace(/\\/g, "/"),
        kind,
        data: parsed.data,
        body: parsed.content.trim(),
        words: countWords(parsed.content),
      };
    }),
  );
}

function inspectRecord(record: ContentRecord, knownSlugs: Set<string>) {
  const findings: Finding[] = [];
  const add = (severity: Severity, rule: string, message: string) => {
    findings.push({ file: record.file, severity, rule, message });
  };

  if (!firstProseParagraph(record.body)) {
    add("error", "missing-introduction", "No prose introduction appears before the first section.");
  }

  for (const paragraph of paragraphs(record.body)) {
    const words = countWords(paragraph);
    if (words > 125) {
      add("warning", "long-paragraph", `A paragraph is ${words} words; consider separating orientation from detail.`);
    }
  }

  let templatedHits = 0;
  for (const pattern of templatedPatterns) {
    const hits = record.body.match(pattern.expression)?.length ?? 0;
    templatedHits += hits;
    if (hits > 1) {
      add("warning", pattern.name, `${hits} instances of the same rhetorical construction appear on this page.`);
    }
  }
  if (templatedHits > 2) {
    add("warning", "templated-cadence", `${templatedHits} total template-like contrast constructions appear on this page.`);
  }

  if (record.kind === "guide") {
    const pageType = String(record.data.page_type ?? "");
    const minimum = recommendedMinimums[pageType];
    if (minimum && record.words < minimum) {
      add("warning", "thin-for-type", `${pageType} has ${record.words} words; the editorial target begins around ${minimum}.`);
    }

    const sourceStatus = String(record.data.source_status ?? "");
    const sources = Array.isArray(record.data.sources) ? record.data.sources : [];
    const bodyUrls = [...record.body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
    if ((sourceStatus === "mixed" || sourceStatus === "source-backed") && sources.length === 0) {
      add("error", "missing-structured-sources", `${sourceStatus} guide has no structured sources metadata.`);
    }
    if ((sourceStatus === "mixed" || sourceStatus === "source-backed") && bodyUrls.length === 0) {
      add("warning", "unplaced-sources", `${sourceStatus} guide has no in-context external citation in the body.`);
    }

    for (const source of sources) {
      if (!source || typeof source !== "object") continue;
      const url = String((source as Record<string, unknown>).url ?? "");
      const note = String((source as Record<string, unknown>).note ?? "");
      if (!note) {
        add("warning", "unexplained-source", `Structured source has no note explaining which claim it supports: ${url || "unknown URL"}`);
      }
    }

    const citedUrls = new Set([
      ...bodyUrls,
      ...sources
        .map((source) =>
          source && typeof source === "object"
            ? String((source as Record<string, unknown>).url ?? "")
            : "",
        )
        .filter(Boolean),
    ]);
    for (const url of citedUrls) {
      const reason = deprecatedSourceUrls.get(url);
      if (reason) {
        add("error", "deprecated-source", `${url}: ${reason}`);
      }
    }

    const related = Array.isArray(record.data.related_slugs) ? record.data.related_slugs : [];
    for (const slug of related) {
      if (typeof slug === "string" && !knownSlugs.has(slug)) {
        add("error", "broken-related-slug", `related_slugs references missing guide: ${slug}`);
      }
    }

    if (!record.data.when_to_use || !record.data.not_for) {
      add("error", "missing-boundary", "Guide must declare both when_to_use and not_for.");
    }

    const reviewed = new Date(String(record.data.last_reviewed ?? ""));
    if (Number.isNaN(reviewed.valueOf())) {
      add("error", "invalid-review-date", "last_reviewed is missing or invalid.");
    } else {
      const ageDays = Math.floor((Date.now() - reviewed.valueOf()) / 86_400_000);
      const risk = String(record.data.risk_level ?? "");
      const maxAge = risk === "high" ? 180 : risk === "medium" ? 270 : 365;
      if (ageDays > maxAge) {
        add("warning", "stale-review", `${risk || "unrated"}-risk guide was last reviewed ${ageDays} days ago.`);
      }
    }
  }

  return findings;
}

function renderReport(records: ContentRecord[], findings: Finding[]) {
  const guides = records.filter((record) => record.kind === "guide");
  const pages = records.filter((record) => record.kind === "page");
  const average = Math.round(guides.reduce((sum, record) => sum + record.words, 0) / Math.max(1, guides.length));
  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity === "warning");

  const openings = new Map<string, string[]>();
  for (const record of guides) {
    const opening = normalizedOpening(record.body);
    if (!opening) continue;
    openings.set(opening, [...(openings.get(opening) ?? []), record.file]);
  }
  const repeatedOpenings = [...openings.entries()].filter(([, files]) => files.length > 1);

  const lines = [
    "# Editorial Content Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `- Guides: ${guides.length}`,
    `- Institutional/tooling pages: ${pages.length}`,
    `- Average guide length: ${average} words`,
    `- Errors: ${errors.length}`,
    `- Warnings: ${warnings.length}`,
    "",
  ];

  if (findings.length === 0) {
    lines.push("No automated findings.", "");
  } else {
    lines.push("## Findings", "");
    for (const finding of findings) {
      lines.push(`- **${finding.severity.toUpperCase()} — ${finding.rule}** — \`${finding.file}\`: ${finding.message}`);
    }
    lines.push("");
  }

  if (repeatedOpenings.length > 0) {
    lines.push("## Repeated opening shapes", "");
    for (const [opening, files] of repeatedOpenings) {
      lines.push(`- \`${opening}\`: ${files.map((file) => `\`${file}\``).join(", ")}`);
    }
    lines.push("");
  }

  lines.push(
    "## Interpretation",
    "",
    "This report identifies review targets. It does not verify legal accuracy, source quality, strategic judgment, or worker safety.",
    "",
  );

  return lines.join("\n");
}

async function main() {
  const records = [
    ...(await loadDirectory(guidesDir, "guide")),
    ...(await loadDirectory(pagesDir, "page")),
  ];
  const knownSlugs = new Set(
    records
      .filter((record) => record.kind === "guide")
      .map((record) => String(record.data.slug ?? ""))
      .filter(Boolean),
  );
  const findings = records.flatMap((record) => inspectRecord(record, knownSlugs));
  const report = renderReport(records, findings);
  const outputFlag = process.argv.indexOf("--write");

  if (outputFlag >= 0) {
    const target = process.argv[outputFlag + 1];
    if (!target) throw new Error("--write requires a path");
    const absolute = path.resolve(root, target);
    await fs.mkdir(path.dirname(absolute), { recursive: true });
    await fs.writeFile(absolute, report + "\n", "utf8");
    console.log(`Wrote ${path.relative(root, absolute)}`);
  } else {
    console.log(report);
  }

  if (findings.some((finding) => finding.severity === "error")) {
    process.exitCode = 1;
  }
}

await main();
