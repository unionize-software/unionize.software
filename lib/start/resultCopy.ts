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

export type ResourceRecommendation = ResourceLink & {
  reason: string;
};

export type ClassificationSummary = {
  id: StartClassification;
  label: string;
  description: string;
};

export type ResultAction = {
  label: string;
  href: string;
  description: string;
};

export type StartResult = {
  classifications: StartClassification[];
  classificationSummaries: ClassificationSummary[];
  likelyPath: string;
  whyThisPath: string;
  whatNotToDo: string[];
  next72Hours: string[];
  primaryRecommendation: ResourceRecommendation;
  relevantResources: ResourceRecommendation[];
  urgentActions: ResultAction[];
  whatThisDoesNotMean: string;
  resultSafetyNote: string;
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
  retaliationChecklist: {
    title: "Retaliation Response Checklist",
    href: "/resources/retaliation-response-checklist",
  },
  deviceSafety: {
    title: "Company Device and Account Safety Checklist",
    href: "/resources/company-device-and-account-safety-checklist",
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
  publicSector: {
    title: "Public-Sector Workers: Start Here",
    href: "/resources/public-sector-workers-start-here",
  },
  nonUs: {
    title: "Outside the United States: Start Here",
    href: "/resources/outside-the-united-states-start-here",
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
  recognition: {
    title: "Recognition, Majority Support, and Going Public",
    href: "/resources/recognition-majority-support-and-going-public",
  },
  coop: {
    title: "Worker Co-op Basics",
    href: "/resources/worker-coop-basics",
  },
};

const classificationSummariesById: Record<StartClassification, Omit<ClassificationSummary, "id">> = {
  LIKELY_US_PRIVATE_SECTOR_EMPLOYEE: {
    label: "U.S. private-sector lane",
    description: "Your answers fit the site's main private-sector employee starting point.",
  },
  POSSIBLE_CONTRACTOR_OR_EXCLUSION: {
    label: "Coverage question",
    description: "Worker status, jurisdiction, or public/private employer status may change the route.",
  },
  POSSIBLE_SUPERVISOR_EXCLUSION: {
    label: "Supervisor-status question",
    description: "Titles and actual authority can matter, so this is worth checking before acting visibly.",
  },
  AI_SURVEILLANCE_ISSUE_CAMPAIGN: {
    label: "AI or monitoring issue",
    description: "The issue you named is likely shared by more than one worker.",
  },
  EARLY_ORGANIZING: {
    label: "Early organizing",
    description: "The useful next move is still careful comparison with trusted coworkers.",
  },
  RETALIATION_RISK_CONTACT_ORGANIZER: {
    label: "Retaliation risk",
    description: "The priority is preserving facts, lowering exposure, and getting support if needed.",
  },
  GAME_WORKER_PATH: {
    label: "Game-worker lane",
    description: "Crunch, launch pressure, QA/vendor status, and layoffs may shape the campaign mechanics.",
  },
  FIRST_CONTRACT_OR_RECOGNITION_READY: {
    label: "More structured stage",
    description: "Having several trusted coworkers means structure matters more than speed.",
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

function getClassificationSummaries(classifications: StartClassification[]) {
  return classifications.map((classification) => ({
    id: classification,
    ...classificationSummariesById[classification],
  }));
}

function getResourceReason(resource: ResourceLink, answers: StartAnswers) {
  switch (resource.href) {
    case resourceLibrary.retaliationChecklist.href:
      return "Use this first if retaliation may already be happening. It keeps the next steps small, factual, and safer.";
    case resourceLibrary.retaliation.href:
      return "Use this to separate ordinary workplace friction from warning signs that deserve a calmer response.";
    case resourceLibrary.deviceSafety.href:
      return "This supports the safety note: move organizing conversations away from company devices, accounts, and chat.";
    case resourceLibrary.pca.href:
      return "This explains the basic idea behind workers acting together about pay, hours, surveillance, workload, and other conditions.";
    case resourceLibrary.ai.href:
      return "This is the broader guide for the AI, monitoring, or worker-data issue you named.";
    case resourceLibrary.keystrokes.href:
      return "Open this if the concrete problem is keystrokes, screenshots, app activity, or computer-use tracking.";
    case resourceLibrary.mapping.href:
      return "Use this to turn a vague sense of support into a careful map of teams, shifts, reporting lines, and trust.";
    case resourceLibrary.conversations.href:
      return "Use this before a first organizing conversation so the next talk is grounded, private, and useful.";
    case resourceLibrary.remote.href:
      return "Your work mode changes the mechanics. This helps remote, hybrid, and distributed teams avoid weak shortcuts.";
    case resourceLibrary.contractor.href:
      return "Start here if contractor, vendor, or classification questions may affect the organizing lane.";
    case resourceLibrary.supervisor.href:
      return "Start here if your title or actual authority might put you in a different role from non-supervisory coworkers.";
    case resourceLibrary.publicSector.href:
      return "Start here if the employer may be public-sector, where the NLRA lane may not be the governing framework.";
    case resourceLibrary.nonUs.href:
      return "Start here if your workplace is outside the United States and local labor institutions need to come first.";
    case resourceLibrary.game.href:
      return "This is the closest issue guide for crunch, launch pressure, QA/vendor precarity, and game-studio layoffs.";
    case resourceLibrary.layoffs.href:
      return "Open this if layoffs, severance, notice, or restructuring are part of the immediate pressure.";
    case resourceLibrary.pay.href:
      return "Open this if pay bands, leveling, promotions, or unequal compensation are the issue workers are comparing.";
    case resourceLibrary.onCall.href:
      return "Open this if on-call load, after-hours work, burnout, or support rotations are the shared pain point.";
    case resourceLibrary.discrimination.href:
      return "Open this when unequal treatment or exclusion is part of the problem and people need support without flattening the facts.";
    case resourceLibrary.contract.href:
      return "This helps once workers are moving toward a more durable structure and need to think beyond the first issue.";
    case resourceLibrary.recognition.href:
      return "Use this before any public move so support, timing, and risk are not guessed at under pressure.";
    default:
      return answers.retaliationRisk === "yes"
        ? "This page connects to the risk signals you named."
        : "This page connects to the pathfinder answers you gave.";
  }
}

function buildRecommendations(resources: ResourceLink[], answers: StartAnswers) {
  return dedupeResources(resources).map((resource) => ({
    ...resource,
    reason: getResourceReason(resource, answers),
  }));
}

function putResourceFirst(resources: ResourceLink[], primaryResource: ResourceLink) {
  return dedupeResources([
    primaryResource,
    ...resources.filter((resource) => resource.href !== primaryResource.href),
  ]);
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

function getExclusionLaneDetails(answers: StartAnswers) {
  if (answers.inUnitedStates !== "yes") {
    return {
      likelyPath: "Outside-the-United-States off-ramp",
      whyThisPath:
        "Your answers suggest that the site's main U.S. private-sector labor-law lane does not govern your workplace directly. The useful next step is to ground the issue in your own country's labor institutions instead of importing NLRA assumptions.",
      nextStep:
        "Identify the labor ministry, labour inspectorate, labor board, or union structure that governs your own country before treating the U.S. rights pages as operative law.",
      primaryResource: resourceLibrary.nonUs,
      resources: [resourceLibrary.nonUs, resourceLibrary.conversations, resourceLibrary.retaliation],
    };
  }

  if (answers.privateSectorEmployer !== "yes") {
    return {
      likelyPath: "Public-sector off-ramp",
      whyThisPath:
        "Your answers suggest that you are dealing with a public employer, which means the standard NLRA lane is not the governing framework. The first job is to identify whether the workplace is federal, state, or local and which public-sector rules apply.",
      nextStep:
        "Figure out whether the employer is federal, state, or local, then find the governing public-sector labor board, statute, or bargaining framework for that lane.",
      primaryResource: resourceLibrary.publicSector,
      resources: [resourceLibrary.publicSector, resourceLibrary.retaliation, resourceLibrary.conversations],
    };
  }

  return {
    likelyPath: "Possible contractor or misclassification lane",
    whyThisPath:
      "Your answers raise questions about worker classification or legal coverage. The safest next step is to get clearer on that before assuming the usual private-sector employee rules apply in a straightforward way.",
    nextStep:
      "Gather the facts about payroll, day-to-day supervision, vendor chain, and control before assuming the standard employee lane.",
    primaryResource: resourceLibrary.contractor,
    resources: [resourceLibrary.contractor, resourceLibrary.conversations, resourceLibrary.retaliation],
  };
}

function buildWhatThisDoesNotMean(answers: StartAnswers, primary: StartClassification) {
  if (answers.inUnitedStates !== "yes") {
    return "This does not decide which local law applies. It is a reminder to ground the next step in the labor board, ministry, union structure, or worker organization that actually covers your country.";
  }

  if (answers.privateSectorEmployer !== "yes") {
    return "This does not decide your rights as a public-sector worker. It means the private-sector NLRA pages should be treated as background, not the governing rulebook.";
  }

  switch (primary) {
    case "RETALIATION_RISK_CONTACT_ORGANIZER":
      return "This does not prove retaliation happened. It means the risk signal is serious enough to lower exposure, preserve facts, and get help before escalating.";
    case "POSSIBLE_CONTRACTOR_OR_EXCLUSION":
      return "This does not decide whether you are legally an employee, contractor, or covered worker. It tells you what facts to clarify before assuming the standard lane.";
    case "POSSIBLE_SUPERVISOR_EXCLUSION":
      return "This does not mean your title controls the answer. Actual authority, how it is used, and the workplace structure matter.";
    case "AI_SURVEILLANCE_ISSUE_CAMPAIGN":
      return "This does not decide whether a monitoring or AI tool is unlawful. It means the rollout may be a shared workplace issue worth comparing carefully.";
    case "GAME_WORKER_PATH":
      return "This does not mean game workers need a separate theory of rights. It means the practical organizing mechanics may be shaped by crunch, vendors, QA, releases, and layoffs.";
    case "FIRST_CONTRACT_OR_RECOGNITION_READY":
      return "This does not mean you are ready to go public. It means support may be broad enough that structure, mapping, and timing deserve more care.";
    case "EARLY_ORGANIZING":
      return "This does not mean you are behind. Early organizing is where workers compare facts, build trust, and avoid moving faster than the group can carry.";
    case "LIKELY_US_PRIVATE_SECTOR_EMPLOYEE":
      return "This does not guarantee that every action is protected. It means the main U.S. private-sector employee resources are a reasonable starting point.";
  }
}

function buildUrgentActions(answers: StartAnswers): ResultAction[] {
  const actions: ResultAction[] = [];

  if (answers.retaliationRisk === "yes" || answers.topIssue === "retaliation") {
    actions.push(
      {
        label: "Open retaliation response checklist",
        href: resourceLibrary.retaliationChecklist.href,
        description: "Start here if you need a calm sequence for preserving facts and avoiding unnecessary exposure.",
      },
      {
        label: "Open device and account safety checklist",
        href: resourceLibrary.deviceSafety.href,
        description: "Use this before moving sensitive conversations or records around.",
      },
    );
  }

  if (answers.organizerContact === "yes" || answers.retaliationRisk === "yes") {
    actions.push({
      label: "Contact an organizer",
      href: "/talk-to-organizer",
      description: "Use the encrypted intake if you need support from a person and can safely use a personal device.",
    });
  }

  return actions;
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
      primaryResource: ResourceLink;
      resources: ResourceLink[];
    }
  > = {
    LIKELY_US_PRIVATE_SECTOR_EMPLOYEE: {
      likelyPath: "Likely U.S. private-sector employee lane",
      next72Hours: [
        ...commonNext72Hours,
        "Read the rights and organizing basics guides before taking bigger steps.",
      ],
      primaryResource: resourceLibrary.pca,
      resources: [resourceLibrary.pca, resourceLibrary.mapping, resourceLibrary.conversations],
    },
    POSSIBLE_CONTRACTOR_OR_EXCLUSION: {
      likelyPath: "Possible contractor or exclusion lane",
      next72Hours: [
        ...commonNext72Hours,
        "Clarify your formal status, reporting line, and any facts that affect coverage before deciding what kind of campaign structure is safest.",
      ],
      primaryResource: resourceLibrary.contractor,
      resources: [resourceLibrary.contractor, resourceLibrary.pca, resourceLibrary.conversations],
    },
    POSSIBLE_SUPERVISOR_EXCLUSION: {
      likelyPath: "Possible supervisor exclusion lane",
      next72Hours: [
        ...commonNext72Hours,
        "Separate what authority you actually exercise from what your title suggests, then get guidance before taking on a visible organizing role.",
      ],
      primaryResource: resourceLibrary.supervisor,
      resources: [resourceLibrary.supervisor, resourceLibrary.retaliation, resourceLibrary.conversations],
    },
    AI_SURVEILLANCE_ISSUE_CAMPAIGN: {
      likelyPath: "AI surveillance issue campaign",
      next72Hours: [
        ...commonNext72Hours,
        "Compare how the monitoring rollout is affecting coworkers and begin framing shared concerns about data use, discipline, and transparency.",
      ],
      primaryResource: resourceLibrary.ai,
      resources: [resourceLibrary.ai, resourceLibrary.keystrokes, resourceLibrary.retaliation],
    },
    EARLY_ORGANIZING: {
      likelyPath: "Early organizing lane",
      next72Hours: [
        ...commonNext72Hours,
        "Find one to three trusted coworkers off company systems and compare whether the issue is shared widely enough to organize around.",
      ],
      primaryResource: resourceLibrary.mapping,
      resources: [resourceLibrary.mapping, resourceLibrary.conversations, resourceLibrary.remote],
    },
    RETALIATION_RISK_CONTACT_ORGANIZER: {
      likelyPath: "Retaliation-risk lane",
      next72Hours: [
        "Shift to personal devices and personal accounts as soon as you can.",
        "Preserve concrete facts and dates without turning the situation into a public argument on company systems.",
        "Contact an organizer through encrypted intake if you need support quickly.",
      ],
      primaryResource: resourceLibrary.retaliationChecklist,
      resources: [
        resourceLibrary.retaliationChecklist,
        resourceLibrary.retaliation,
        resourceLibrary.deviceSafety,
        resourceLibrary.pca,
      ],
    },
    GAME_WORKER_PATH: {
      likelyPath: "Game worker lane",
      next72Hours: [
        ...commonNext72Hours,
        "Compare crunch expectations, staffing patterns, release pressure, and QA or vendor conditions with trusted coworkers.",
      ],
      primaryResource: resourceLibrary.game,
      resources: [resourceLibrary.game, resourceLibrary.layoffs, resourceLibrary.conversations],
    },
    FIRST_CONTRACT_OR_RECOGNITION_READY: {
      likelyPath: "Recognition or structured escalation lane",
      next72Hours: [
        ...commonNext72Hours,
        "Take a careful look at how broad and durable coworker support really is before any public move.",
      ],
      primaryResource: resourceLibrary.recognition,
      resources: [resourceLibrary.recognition, resourceLibrary.mapping, resourceLibrary.remote, resourceLibrary.contract],
    },
  };

  const baseResult = resultByPrimary[primary];
  const exclusionLaneDetails =
    primary === "POSSIBLE_CONTRACTOR_OR_EXCLUSION" ? getExclusionLaneDetails(answers) : null;

  const primaryResource = exclusionLaneDetails?.primaryResource ?? baseResult.primaryResource;
  const resources = putResourceFirst(exclusionLaneDetails?.resources ?? baseResult.resources, primaryResource);
  const next72Hours = [
    ...(primary === "POSSIBLE_CONTRACTOR_OR_EXCLUSION"
      ? [...commonNext72Hours, exclusionLaneDetails!.nextStep]
      : baseResult.next72Hours),
    getWorkArrangementNextStep(answers),
  ];

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
    resources.push(resourceLibrary.retaliation, resourceLibrary.retaliationChecklist);
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

  if (answers.organizerContact === "yes" || answers.retaliationRisk === "yes") {
    resources.push(resourceLibrary.deviceSafety);
  }

  const relevantResources = buildRecommendations(putResourceFirst(resources, primaryResource), answers);
  const primaryRecommendation = relevantResources.find((resource) => resource.href === primaryResource.href)!;

  return {
    classifications,
    classificationSummaries: getClassificationSummaries(classifications),
    likelyPath: exclusionLaneDetails?.likelyPath ?? baseResult.likelyPath,
    whyThisPath: exclusionLaneDetails?.whyThisPath ?? buildWhyThisPath(answers, primary),
    whatNotToDo: commonWhatNotToDo,
    next72Hours,
    primaryRecommendation,
    relevantResources,
    urgentActions: buildUrgentActions(answers),
    whatThisDoesNotMean: buildWhatThisDoesNotMean(answers, primary),
    resultSafetyNote:
      "This result is not saved to an account or sent to the server. If you refresh this page, it disappears by design.",
    showOrganizerIntakeCta:
      answers.organizerContact === "yes" ||
      answers.retaliationRisk === "yes" ||
      answers.trustedCoworkers === "4+ trusted coworkers",
  };
}
