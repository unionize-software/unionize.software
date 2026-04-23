import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { guideFrontmatterSchema } from "../content/frontmatterSchema.ts";
import { startQuestions, type StartAnswers } from "../start/questions.ts";

export const websiteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unionize.software";
export const githubRepositoryUrl =
  "https://github.com/unionize-software/unionize-software-webapp";

const guidesDirectory = path.join(process.cwd(), "content", "guides");

type GuideDocument = {
  title: string;
  slug: string;
  category: string;
  jurisdiction: string;
  legal_scope: string;
  last_reviewed: string;
  review_status: string;
  risk_level: string;
  excerpt: string;
  searchText: string;
  body: string;
};

type ResourceLink = {
  title: string;
  href: string;
};

type StartClassification =
  | "LIKELY_US_PRIVATE_SECTOR_EMPLOYEE"
  | "POSSIBLE_CONTRACTOR_OR_EXCLUSION"
  | "POSSIBLE_SUPERVISOR_EXCLUSION"
  | "AI_SURVEILLANCE_ISSUE_CAMPAIGN"
  | "EARLY_ORGANIZING"
  | "RETALIATION_RISK_CONTACT_ORGANIZER"
  | "GAME_WORKER_PATH"
  | "FIRST_CONTRACT_OR_RECOGNITION_READY";

type StartResult = {
  classifications: StartClassification[];
  likelyPath: string;
  whyThisPath: string;
  whatNotToDo: string[];
  next72Hours: string[];
  relevantResources: ResourceLink[];
  showOrganizerIntakeCta: boolean;
};

export type ResourceTagDefinition = {
  id: string;
  label: string;
  slugs: string[];
};

const resourceTagDefinitions: ResourceTagDefinition[] = [
  {
    id: "ai-surveillance",
    label: "AI surveillance",
    slugs: ["ai-surveillance-worker-data", "keystroke-tracking-ai-training"],
  },
  {
    id: "layoffs",
    label: "Layoffs",
    slugs: ["layoffs-severance"],
  },
  {
    id: "pay-promotions",
    label: "Pay and promotions",
    slugs: ["pay-transparency-leveling-and-promotions"],
  },
  {
    id: "burnout",
    label: "Burnout and on-call",
    slugs: ["on-call-burnout-and-after-hours-work", "game-worker-crunch"],
  },
  {
    id: "retaliation",
    label: "Retaliation",
    slugs: [
      "retaliation-warning-signs",
      "protected-concerted-activity",
      "discrimination-exclusion-and-organizing-safely",
    ],
  },
  {
    id: "remote-hybrid",
    label: "Remote and hybrid",
    slugs: ["remote-hybrid-and-distributed-organizing", "workplace-mapping"],
  },
  {
    id: "contractors",
    label: "Contractors and exclusions",
    slugs: ["contractor-vendor-misclassification", "supervisor-status-and-exclusion"],
  },
  {
    id: "recognition",
    label: "Recognition and bargaining",
    slugs: ["recognition-majority-support-and-going-public", "first-contract-basics"],
  },
  {
    id: "checklists",
    label: "Checklists",
    slugs: [
      "what-to-preserve-checklist",
      "first-organizing-conversation-checklist",
      "what-not-to-do-checklist",
    ],
  },
  {
    id: "game-workers",
    label: "Game workers",
    slugs: ["game-worker-crunch", "layoffs-severance"],
  },
];

const wikiSectionDefinitions = [
  {
    id: "issue-guides",
    title: "Issue Guides",
    description: "Start with the problem workers are actually facing right now.",
    slugs: [
      "ai-surveillance-worker-data",
      "keystroke-tracking-ai-training",
      "layoffs-severance",
      "pay-transparency-leveling-and-promotions",
      "on-call-burnout-and-after-hours-work",
      "discrimination-exclusion-and-organizing-safely",
      "contractor-vendor-misclassification",
      "game-worker-crunch",
    ],
  },
  {
    id: "work-modes",
    title: "Work Modes",
    description: "In-person, hybrid, and distributed workplaces need different organizing mechanics.",
    slugs: [
      "remote-hybrid-and-distributed-organizing",
      "workplace-mapping",
      "organizing-conversations",
    ],
  },
  {
    id: "worker-status",
    title: "Worker Status & Exclusions",
    description: "Use these pages when titles, classification, or legal lane are not straightforward.",
    slugs: [
      "protected-concerted-activity",
      "contractor-vendor-misclassification",
      "supervisor-status-and-exclusion",
      "retaliation-warning-signs",
    ],
  },
  {
    id: "campaign-stages",
    title: "Campaign Stages",
    description: "Move from orientation to structure instead of jumping straight to a public move.",
    slugs: [
      "workplace-mapping",
      "first-organizing-conversation-checklist",
      "recognition-majority-support-and-going-public",
      "first-contract-basics",
      "worker-coop-basics",
    ],
  },
  {
    id: "checklists-tools",
    title: "Checklists & Tools",
    description: "Short practical pages for the first moves workers usually need to make.",
    slugs: [
      "what-to-preserve-checklist",
      "first-organizing-conversation-checklist",
      "what-not-to-do-checklist",
    ],
  },
  {
    id: "reference",
    title: "Reference",
    description: "Use these pages to ground the basics before you make bigger strategic assumptions.",
    slugs: [
      "organizing-glossary",
      "protected-concerted-activity",
      "retaliation-warning-signs",
      "supervisor-status-and-exclusion",
    ],
  },
];

const resourceLibrary: Record<string, ResourceLink> = {
  ai: {
    title: "AI Surveillance and Worker Data",
    href: "/resources/ai-surveillance-worker-data",
  },
  keystrokes: {
    title: "My Employer Is Tracking Computer Activity for AI Training",
    href: "/resources/keystroke-tracking-ai-training",
  },
  pca: {
    title: "Protected Concerted Activity",
    href: "/resources/protected-concerted-activity",
  },
  mapping: {
    title: "Workplace Mapping",
    href: "/resources/workplace-mapping",
  },
  conversations: {
    title: "Organizing Conversations",
    href: "/resources/organizing-conversations",
  },
  retaliation: {
    title: "Retaliation Warning Signs",
    href: "/resources/retaliation-warning-signs",
  },
  game: {
    title: "Game Worker Crunch",
    href: "/resources/game-worker-crunch",
  },
  pay: {
    title: "Pay Transparency, Leveling, and Promotions",
    href: "/resources/pay-transparency-leveling-and-promotions",
  },
  onCall: {
    title: "On-Call, Burnout, and After-Hours Work",
    href: "/resources/on-call-burnout-and-after-hours-work",
  },
  contractor: {
    title: "Contractor, Vendor, and Misclassification Questions",
    href: "/resources/contractor-vendor-misclassification",
  },
  discrimination: {
    title: "Discrimination, Exclusion, and Organizing Safely",
    href: "/resources/discrimination-exclusion-and-organizing-safely",
  },
  supervisor: {
    title: "Supervisor Status and Exclusion Questions",
    href: "/resources/supervisor-status-and-exclusion",
  },
  remote: {
    title: "Remote, Hybrid, and Distributed Organizing",
    href: "/resources/remote-hybrid-and-distributed-organizing",
  },
  layoffs: {
    title: "Layoffs and Severance",
    href: "/resources/layoffs-severance",
  },
  contract: {
    title: "First Contract Basics",
    href: "/resources/first-contract-basics",
  },
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

async function readGuideFiles() {
  const entries = await fs.readdir(guidesDirectory);
  return entries.filter((entry) => entry.endsWith(".mdx"));
}

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

async function getGuideDocuments() {
  const files = await readGuideFiles();
  const guides = await Promise.all(
    files.map(async (fileName) => {
      const source = await fs.readFile(path.join(guidesDirectory, fileName), "utf8");
      return parseGuideSource(source);
    }),
  );

  return guides.sort((left, right) => left.title.localeCompare(right.title));
}

async function getGuideDocumentBySlug(slug: string) {
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
}

function buildWikiSections(guides: GuideDocument[]) {
  const guidesBySlug = new Map(guides.map((guide) => [guide.slug, guide]));

  return wikiSectionDefinitions.map((section) => ({
    ...section,
    guides: section.slugs
      .map((slug) => guidesBySlug.get(slug))
      .filter((guide): guide is GuideDocument => Boolean(guide)),
  }));
}

function normalizeForSearch(value: string) {
  return value.toLowerCase();
}

function clampSnippetToWords(text: string, start: number, end: number) {
  const boundedStart = Math.max(0, start);
  const boundedEnd = Math.min(text.length, end);
  const wordStart = boundedStart === 0 ? 0 : text.lastIndexOf(" ", boundedStart) || 0;
  const nextSpace = text.indexOf(" ", boundedEnd);
  const wordEnd = nextSpace === -1 ? text.length : nextSpace;
  const prefix = wordStart > 0 ? "..." : "";
  const suffix = wordEnd < text.length ? "..." : "";

  return `${prefix}${text.slice(wordStart, wordEnd).trim()}${suffix}`;
}

function buildSnippet(text: string, terms: string[]) {
  const cleanText = text.trim();
  const normalized = cleanText.toLowerCase();

  let firstIndex = -1;
  let matchedLength = 0;

  for (const term of terms) {
    const index = normalized.indexOf(term);
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index;
      matchedLength = term.length;
    }
  }

  if (firstIndex === -1) {
    return cleanText.slice(0, 180);
  }

  return clampSnippetToWords(cleanText, firstIndex - 96, firstIndex + matchedLength + 96);
}

function getSearchTerms(query: string) {
  const rawTerms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9/-]/g, ""))
    .filter(Boolean);

  const uniqueTerms = rawTerms.filter((term, index) => rawTerms.indexOf(term) === index);

  if (uniqueTerms.length <= 1) {
    return uniqueTerms;
  }

  const multiCharTerms = uniqueTerms.filter((term) => term.length > 1);
  return multiCharTerms.length > 0 ? multiCharTerms : uniqueTerms;
}

function guideMatchesResourceTag(guide: GuideDocument, tagId: string) {
  const tag = resourceTagDefinitions.find((candidate) => candidate.id === tagId);
  return tag ? tag.slugs.includes(guide.slug) : false;
}

function dedupeResources(resources: ResourceLink[]) {
  return resources.filter(
    (resource, index, list) => list.findIndex((candidate) => candidate.href === resource.href) === index,
  );
}

function getGuideResourceUriFromHref(href: string) {
  return href.startsWith("/resources/") ? getGuideResourceUri(href.replace("/resources/", "")) : null;
}

function buildWhyThisPath(answers: StartAnswers, primary: StartClassification) {
  switch (primary) {
    case "RETALIATION_RISK_CONTACT_ORGANIZER":
      return "Retaliation may be an immediate concern. Keep things calmer and safer: document what is happening, stay off company systems, and get outside support quickly if you need it.";
    case "POSSIBLE_SUPERVISOR_EXCLUSION":
      return "Your answers suggest that you may have supervisory authority, or that it is not fully clear yet. That is worth sorting out before you assume the same lane or role as non-supervisory coworkers.";
    case "POSSIBLE_CONTRACTOR_OR_EXCLUSION":
      return "Your answers raise questions about classification or legal coverage. The safest next step is to get clearer on that before assuming the usual private-sector employee rules apply in a straightforward way.";
    case "AI_SURVEILLANCE_ISSUE_CAMPAIGN":
      return "You identified AI surveillance as the main issue. That often means the problem is bigger than one person and is worth approaching as a shared workplace issue, not just an individual complaint.";
    case "GAME_WORKER_PATH":
      return "Your workplace or role points toward the game-worker lane, where crunch, QA and vendor precarity, and post-launch layoffs often shape what organizing looks like.";
    case "FIRST_CONTRACT_OR_RECOGNITION_READY":
      return "You already have several trusted coworkers off company systems. That suggests you may be moving past basic orientation and closer to a more structured organizing conversation.";
    case "EARLY_ORGANIZING":
      return "You seem to be in an early stage. The main job right now is to compare facts, identify trusted people, and avoid moving faster than the trust you have built.";
    case "LIKELY_US_PRIVATE_SECTOR_EMPLOYEE":
      return "Your answers fit the usual U.S. private-sector employee lane. That gives you a clearer starting point for the basics and for issue-specific guidance.";
  }
}

function getWorkArrangementNextStep(answers: StartAnswers) {
  switch (answers.workArrangement) {
    case "mostly in-person":
      return "Map who actually overlaps in person by team, office area, or shift, and move sensitive follow-up offsite or onto personal devices.";
    case "hybrid":
      return "Track which office days create real overlap and make sure remote-heavy coworkers do not disappear from the organizing picture.";
    case "mostly remote/distributed":
      return "Build one-to-one trust across personal channels, then map by team, manager, vendor chain, and time zone before creating larger group spaces.";
  }
}

function classifyStartAnswers(answers: StartAnswers): StartClassification[] {
  const classifications: StartClassification[] = [];

  if (
    answers.inUnitedStates === "yes" &&
    answers.privateSectorEmployer === "yes" &&
    answers.workerStatus === "employee"
  ) {
    classifications.push("LIKELY_US_PRIVATE_SECTOR_EMPLOYEE");
  }

  if (
    answers.inUnitedStates !== "yes" ||
    answers.privateSectorEmployer !== "yes" ||
    answers.workerStatus !== "employee"
  ) {
    classifications.push("POSSIBLE_CONTRACTOR_OR_EXCLUSION");
  }

  if (answers.supervisoryAuthority === "yes" || answers.supervisoryAuthority === "unsure") {
    classifications.push("POSSIBLE_SUPERVISOR_EXCLUSION");
  }

  if (answers.topIssue === "AI surveillance") {
    classifications.push("AI_SURVEILLANCE_ISSUE_CAMPAIGN");
  }

  if (
    answers.workplaceType === "game studio" ||
    answers.roleFamily === "game dev" ||
    answers.topIssue === "crunch"
  ) {
    classifications.push("GAME_WORKER_PATH");
  }

  if (answers.retaliationRisk === "yes" || answers.topIssue === "retaliation") {
    classifications.push("RETALIATION_RISK_CONTACT_ORGANIZER");
  }

  if (answers.trustedCoworkers === "4+ trusted coworkers") {
    classifications.push("FIRST_CONTRACT_OR_RECOGNITION_READY");
  } else {
    classifications.push("EARLY_ORGANIZING");
  }

  return classifications;
}

function getPrimaryClassification(classifications: StartClassification[]) {
  const priority: StartClassification[] = [
    "RETALIATION_RISK_CONTACT_ORGANIZER",
    "POSSIBLE_SUPERVISOR_EXCLUSION",
    "POSSIBLE_CONTRACTOR_OR_EXCLUSION",
    "AI_SURVEILLANCE_ISSUE_CAMPAIGN",
    "GAME_WORKER_PATH",
    "FIRST_CONTRACT_OR_RECOGNITION_READY",
    "EARLY_ORGANIZING",
    "LIKELY_US_PRIVATE_SECTOR_EMPLOYEE",
  ];

  return priority.find((classification) => classifications.includes(classification))!;
}

function buildStartResult(answers: StartAnswers): StartResult {
  const classifications = classifyStartAnswers(answers);
  const primary = getPrimaryClassification(classifications);

  const commonWhatNotToDo = [
    "Try not to organize on company email, company chat, company tickets, or company devices if you can avoid it.",
    "Do not sabotage systems, falsify work, poison data, or do anything that gives management an easy excuse to punish people.",
    "Do not assume legal coverage without checking for contractor, supervisory, or jurisdiction issues first.",
  ];

  const commonNext72Hours = [
    "Move sensitive conversations to personal devices and personal contact channels.",
    "Write down the main facts, dates, policy changes, and who seems affected on personal systems.",
    "Pick one concrete next conversation with a trusted coworker instead of trying to solve everything at once.",
  ];

  const resultByPrimary: Record<
    StartClassification,
    {
      likelyPath: string;
      next72Hours: string[];
      resources: ResourceLink[];
    }
  > = {
    LIKELY_US_PRIVATE_SECTOR_EMPLOYEE: {
      likelyPath: "Likely U.S. private-sector employee lane",
      next72Hours: [
        ...commonNext72Hours,
        "Read the rights and organizing basics guides before taking bigger steps.",
      ],
      resources: [resourceLibrary.pca, resourceLibrary.mapping, resourceLibrary.conversations],
    },
    POSSIBLE_CONTRACTOR_OR_EXCLUSION: {
      likelyPath: "Possible contractor or exclusion lane",
      next72Hours: [
        ...commonNext72Hours,
        "Clarify your formal status, reporting line, and any facts that affect coverage before deciding what kind of campaign structure is safest.",
      ],
      resources: [resourceLibrary.contractor, resourceLibrary.pca, resourceLibrary.conversations],
    },
    POSSIBLE_SUPERVISOR_EXCLUSION: {
      likelyPath: "Possible supervisor exclusion lane",
      next72Hours: [
        ...commonNext72Hours,
        "Separate what authority you actually exercise from what your title suggests, then get guidance before taking on a visible organizing role.",
      ],
      resources: [resourceLibrary.supervisor, resourceLibrary.retaliation, resourceLibrary.conversations],
    },
    AI_SURVEILLANCE_ISSUE_CAMPAIGN: {
      likelyPath: "AI surveillance issue campaign",
      next72Hours: [
        ...commonNext72Hours,
        "Compare how the monitoring rollout is affecting coworkers and begin framing shared concerns about data use, discipline, and transparency.",
      ],
      resources: [resourceLibrary.ai, resourceLibrary.keystrokes, resourceLibrary.retaliation],
    },
    EARLY_ORGANIZING: {
      likelyPath: "Early organizing lane",
      next72Hours: [
        ...commonNext72Hours,
        "Find one to three trusted coworkers off company systems and compare whether the issue is shared widely enough to organize around.",
      ],
      resources: [resourceLibrary.mapping, resourceLibrary.conversations, resourceLibrary.remote],
    },
    RETALIATION_RISK_CONTACT_ORGANIZER: {
      likelyPath: "Retaliation-risk lane",
      next72Hours: [
        "Shift to personal devices and personal accounts as soon as you can.",
        "Preserve concrete facts and dates without turning the situation into a public argument on company systems.",
        "Get outside support quickly if workers need help navigating retaliation safely.",
      ],
      resources: [resourceLibrary.retaliation, resourceLibrary.pca, resourceLibrary.conversations],
    },
    GAME_WORKER_PATH: {
      likelyPath: "Game worker lane",
      next72Hours: [
        ...commonNext72Hours,
        "Compare crunch expectations, staffing patterns, release pressure, and QA or vendor conditions with trusted coworkers.",
      ],
      resources: [resourceLibrary.game, resourceLibrary.layoffs, resourceLibrary.conversations],
    },
    FIRST_CONTRACT_OR_RECOGNITION_READY: {
      likelyPath: "Recognition or structured escalation lane",
      next72Hours: [
        ...commonNext72Hours,
        "Take a careful look at how broad and durable coworker support really is before any public move.",
      ],
      resources: [resourceLibrary.mapping, resourceLibrary.remote, resourceLibrary.contract],
    },
  };

  const baseResult = resultByPrimary[primary];
  const resources = [...baseResult.resources];
  const next72Hours = [...baseResult.next72Hours, getWorkArrangementNextStep(answers)];

  if (answers.topIssue === "AI surveillance") {
    resources.push(resourceLibrary.ai, resourceLibrary.keystrokes);
  }

  if (answers.topIssue === "layoffs/severance") {
    resources.push(resourceLibrary.layoffs);
  }

  if (answers.topIssue === "pay/promotions") {
    resources.push(resourceLibrary.pay);
  }

  if (answers.topIssue === "on-call/burnout") {
    resources.push(resourceLibrary.onCall);
  }

  if (answers.topIssue === "crunch" || answers.workplaceType === "game studio") {
    resources.push(resourceLibrary.game);
  }

  if (answers.topIssue === "discrimination/exclusion") {
    resources.push(resourceLibrary.discrimination, resourceLibrary.retaliation);
  }

  if (answers.topIssue === "contractor/vendor issues" || answers.workplaceType === "vendor/staffing") {
    resources.push(resourceLibrary.contractor);
  }

  if (answers.retaliationRisk === "yes") {
    resources.push(resourceLibrary.retaliation);
  }

  if (answers.trustedCoworkers === "4+ trusted coworkers") {
    resources.push(resourceLibrary.contract);
  }

  if (
    answers.workArrangement === "hybrid" ||
    answers.workArrangement === "mostly remote/distributed"
  ) {
    resources.push(resourceLibrary.remote);
  }

  if (answers.supervisoryAuthority === "yes" || answers.supervisoryAuthority === "unsure") {
    resources.push(resourceLibrary.supervisor);
  }

  return {
    classifications,
    likelyPath: baseResult.likelyPath,
    whyThisPath: buildWhyThisPath(answers, primary),
    whatNotToDo: commonWhatNotToDo,
    next72Hours,
    relevantResources: dedupeResources(resources),
    showOrganizerIntakeCta:
      answers.organizerContact === "yes" ||
      answers.retaliationRisk === "yes" ||
      answers.trustedCoworkers === "4+ trusted coworkers",
  };
}

export function getResourceTags() {
  return resourceTagDefinitions;
}

export function getGuideResourceUri(slug: string) {
  return `unionize://guides/${slug}`;
}

export function getGuideWebUrl(slug: string) {
  return new URL(`/resources/${slug}`, websiteBaseUrl).toString();
}

function guideToCatalogEntry(guide: GuideDocument) {
  return {
    slug: guide.slug,
    title: guide.title,
    category: guide.category,
    jurisdiction: guide.jurisdiction,
    legalScope: guide.legal_scope,
    lastReviewed: guide.last_reviewed,
    reviewStatus: guide.review_status,
    riskLevel: guide.risk_level,
    excerpt: guide.excerpt,
    url: getGuideWebUrl(guide.slug),
    resourceUri: getGuideResourceUri(guide.slug),
  };
}

export async function getGuideCatalog() {
  const guides = await getGuideDocuments();

  return {
    generatedAt: new Date().toISOString(),
    websiteBaseUrl,
    githubRepositoryUrl,
    tags: getResourceTags(),
    sections: buildWikiSections(guides).map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      guides: section.guides.map((guide) => ({
        slug: guide.slug,
        title: guide.title,
        resourceUri: getGuideResourceUri(guide.slug),
        url: getGuideWebUrl(guide.slug),
      })),
    })),
    guides: guides.map((guide) => ({
      ...guideToCatalogEntry(guide),
    })),
  };
}

export async function getGuideForAgents(slug: string) {
  const guide = await getGuideDocumentBySlug(slug);

  if (!guide) {
    return null;
  }

  return {
    ...guideToCatalogEntry(guide),
    body: guide.body,
  };
}

export async function searchGuidesForAgents({
  query,
  tagId,
  limit = 5,
}: {
  query: string;
  tagId?: string;
  limit?: number;
}) {
  const searchTerms = getSearchTerms(query);
  const guides = await getGuideDocuments();
  const filteredGuides = tagId
    ? guides.filter((guide) => guideMatchesResourceTag(guide, tagId))
    : guides;

  if (searchTerms.length === 0) {
    return filteredGuides.slice(0, limit).map((guide) => ({
      slug: guide.slug,
      title: guide.title,
      category: guide.category,
      jurisdiction: guide.jurisdiction,
      previewLabel: null,
      previewText: guide.excerpt,
      url: getGuideWebUrl(guide.slug),
      resourceUri: getGuideResourceUri(guide.slug),
    }));
  }

  const results = filteredGuides.flatMap((guide) => {
    const fields = [
      { field: "title", value: guide.title },
      { field: "category", value: guide.category },
      { field: "jurisdiction", value: guide.jurisdiction },
      { field: "excerpt", value: guide.excerpt },
      { field: "body", value: guide.searchText },
      { field: "slug", value: guide.slug },
    ];
    const haystack = fields.map(({ value }) => normalizeForSearch(value)).join(" ");

    if (!searchTerms.every((term) => haystack.includes(term))) {
      return [];
    }

    const matchingField = fields.find(({ value }) =>
      searchTerms.some((term) => normalizeForSearch(value).includes(term)),
    );

    if (!matchingField) {
      return [];
    }

    const previewLabel =
      matchingField.field === "title"
        ? "Title match"
        : matchingField.field === "category"
          ? "Category match"
          : matchingField.field === "jurisdiction"
            ? "Jurisdiction match"
            : matchingField.field === "body"
              ? "Matching passage"
              : matchingField.field === "slug"
                ? "Slug match"
                : "Preview";

    return [
      {
        slug: guide.slug,
        title: guide.title,
        category: guide.category,
        jurisdiction: guide.jurisdiction,
        previewLabel,
        previewText: buildSnippet(matchingField.value, searchTerms),
        url: getGuideWebUrl(guide.slug),
        resourceUri: getGuideResourceUri(guide.slug),
      },
    ];
  });

  return results.slice(0, limit);
}

export function getPathfinderReference() {
  return {
    title: "unionize.software pathfinder schema",
    description:
      "Structured inputs for the local-only Start Here pathfinder that powers the public site.",
    questions: startQuestions,
    exampleAnswers: {
      inUnitedStates: "yes",
      privateSectorEmployer: "yes",
      workerStatus: "employee",
      supervisoryAuthority: "no",
      workplaceType: "startup",
      workArrangement: "hybrid",
      roleFamily: "full-stack/frontend/backend",
      topIssue: "AI surveillance",
      trustedCoworkers: "1-3 trusted coworkers",
      retaliationRisk: "no",
      organizerContact: "no",
    } satisfies StartAnswers,
  };
}

export function buildPathfinderResultForAgents(answers: StartAnswers) {
  const result = buildStartResult(answers);

  return {
    ...result,
    relevantResources: result.relevantResources.map((resource) => ({
      ...resource,
      absoluteUrl: new URL(resource.href, websiteBaseUrl).toString(),
      resourceUri: getGuideResourceUriFromHref(resource.href),
    })),
  };
}
