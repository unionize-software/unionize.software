export const guidePageTypes = ["playbook", "checklist", "reference", "evidence"] as const;

export type GuidePageType = (typeof guidePageTypes)[number];

export const guideCollectionIds = [
  "issue-guides",
  "work-modes",
  "worker-status",
  "campaign-stages",
  "checklists-tools",
  "reference",
  "evidence-leverage",
] as const;

export type GuideCollectionId = (typeof guideCollectionIds)[number];

export const guideSourceStatuses = ["practice-based", "mixed", "source-backed"] as const;

export type GuideSourceStatus = (typeof guideSourceStatuses)[number];

export const guidePageTypeLabels: Record<GuidePageType, string> = {
  playbook: "Playbook",
  checklist: "Checklist",
  reference: "Reference",
  evidence: "Evidence page",
};

export const guideSourceStatusLabels: Record<GuideSourceStatus, string> = {
  "practice-based": "Practice-based",
  mixed: "Mixed sourcing",
  "source-backed": "Source-backed",
};

export const guideCollectionDefinitions: Record<
  GuideCollectionId,
  {
    title: string;
    description: string;
  }
> = {
  "issue-guides": {
    title: "Issue Guides",
    description: "Start with the problem workers are actually facing right now.",
  },
  "work-modes": {
    title: "Work Modes",
    description: "In-person, hybrid, and distributed workplaces need different organizing mechanics.",
  },
  "worker-status": {
    title: "Worker Status & Exclusions",
    description: "Use these pages when titles, classification, or legal lane are not straightforward.",
  },
  "campaign-stages": {
    title: "Campaign Stages",
    description: "Move from orientation to structure instead of jumping straight to a public move.",
  },
  "checklists-tools": {
    title: "Checklists & Tools",
    description: "Short practical pages for the first moves workers usually need to make.",
  },
  reference: {
    title: "Reference",
    description: "Use these pages to ground the basics before you make bigger strategic assumptions.",
  },
  "evidence-leverage": {
    title: "Evidence & Leverage",
    description:
      "Use these pages when you need facts, history, and a calmer answer to the claim that software workers cannot organize.",
  },
};
