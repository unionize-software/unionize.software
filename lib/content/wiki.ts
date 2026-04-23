import type { GuideListDocument } from "@/lib/content/getGuides";

type WikiSectionDefinition = {
  id: string;
  title: string;
  description: string;
  slugs: string[];
};

export type WikiSection = WikiSectionDefinition & {
  guides: GuideListDocument[];
};

const wikiSectionDefinitions: WikiSectionDefinition[] = [
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

export function buildWikiSections(guides: GuideListDocument[]): WikiSection[] {
  const guidesBySlug = new Map(guides.map((guide) => [guide.slug, guide]));

  return wikiSectionDefinitions
    .map((section) => ({
      ...section,
      guides: section.slugs
        .map((slug) => guidesBySlug.get(slug))
        .filter((guide): guide is GuideListDocument => Boolean(guide)),
    }))
    .filter((section) => section.guides.length > 0);
}

export function getWikiSectionsForGuide(guides: GuideListDocument[], slug: string) {
  return buildWikiSections(guides).filter((section) =>
    section.guides.some((guide) => guide.slug === slug),
  );
}

export function getRelatedGuidesForGuide(
  guides: GuideListDocument[],
  slug: string,
  limit = 4,
) {
  const guidesBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const relatedSlugs = getWikiSectionsForGuide(guides, slug)
    .flatMap((section) => section.guides.map((guide) => guide.slug))
    .filter((relatedSlug, index, allSlugs) => relatedSlug !== slug && allSlugs.indexOf(relatedSlug) === index)
    .slice(0, limit);

  return relatedSlugs
    .map((relatedSlug) => guidesBySlug.get(relatedSlug))
    .filter((guide): guide is GuideListDocument => Boolean(guide));
}
