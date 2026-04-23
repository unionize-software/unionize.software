import type { GuideListDocument, GuideSearchIndexDocument } from "@/lib/content/getGuides";

export type ResourceTagDefinition = {
  id: string;
  label: string;
  slugs: string[];
};

type SearchableGuide = GuideListDocument | GuideSearchIndexDocument;

export const resourceTagDefinitions: ResourceTagDefinition[] = [
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
    slugs: [
      "contractor-vendor-misclassification",
      "supervisor-status-and-exclusion",
      "public-sector-workers-start-here",
      "outside-the-united-states-start-here",
    ],
  },
  {
    id: "coverage-off-ramps",
    label: "Coverage and off-ramps",
    slugs: [
      "public-sector-workers-start-here",
      "outside-the-united-states-start-here",
      "contractor-vendor-misclassification",
      "supervisor-status-and-exclusion",
    ],
  },
  {
    id: "recognition",
    label: "Recognition and bargaining",
    slugs: ["recognition-majority-support-and-going-public", "first-contract-basics"],
  },
  {
    id: "evidence",
    label: "Evidence and leverage",
    slugs: [
      "software-worker-scale-and-leverage",
      "why-software-workers-have-been-slow-to-unionize",
      "what-collective-bargaining-can-change-for-software-workers",
    ],
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

const resourceTagsById = new Map(resourceTagDefinitions.map((tag) => [tag.id, tag]));

export function getResourceTags() {
  return resourceTagDefinitions;
}

export function getGuideResourceTags(slug: string) {
  return resourceTagDefinitions.filter((tag) => tag.slugs.includes(slug));
}

export function guideMatchesResourceTag(guide: SearchableGuide, tagId: string) {
  const tag = resourceTagsById.get(tagId);

  if (!tag) {
    return false;
  }

  return tag.slugs.includes(guide.slug);
}
