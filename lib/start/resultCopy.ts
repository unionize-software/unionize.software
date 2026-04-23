import {
  classifyStartAnswers,
  getPrimaryClassification,
  type StartClassification,
} from "@/lib/start/classify";
import type { StartAnswers } from "@/lib/start/questions";

type ResourceLink = {
  title: string;
  href: string;
};

export type StartResult = {
  classifications: StartClassification[];
  likelyPath: string;
  whyThisPath: string;
  whatNotToDo: string[];
  next72Hours: string[];
  relevantResources: ResourceLink[];
  showOrganizerIntakeCta: boolean;
};

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
  coop: {
    title: "Worker Co-op Basics",
    href: "/resources/worker-coop-basics",
  },
};

function buildWhyThisPath(answers: StartAnswers, primary: StartClassification) {
  switch (primary) {
    case "RETALIATION_RISK_CONTACT_ORGANIZER":
      return "Based on what you shared, retaliation may be an immediate concern. That means the priority is keeping things calmer and safer: document what is happening, stay off company systems, and get support quickly if you need it.";
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
      return "You seem to be in an early stage. That is fine. The main job right now is to compare facts, identify trusted people, and avoid moving faster than the trust you have built.";
    case "LIKELY_US_PRIVATE_SECTOR_EMPLOYEE":
      return "Your answers fit the usual U.S. private-sector employee lane. That gives you a clearer starting point for the basics and for issue-specific guidance.";
  }
}

function dedupeResources(resources: ResourceLink[]) {
  return resources.filter(
    (resource, index, list) => list.findIndex((candidate) => candidate.href === resource.href) === index,
  );
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

export function buildStartResult(answers: StartAnswers): StartResult {
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
        "Contact an organizer through encrypted intake if you need support quickly.",
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
