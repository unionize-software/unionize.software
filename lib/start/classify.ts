import type { StartAnswers } from "@/lib/start/questions";

export type StartClassification =
  | "LIKELY_US_PRIVATE_SECTOR_EMPLOYEE"
  | "POSSIBLE_CONTRACTOR_OR_EXCLUSION"
  | "POSSIBLE_SUPERVISOR_EXCLUSION"
  | "AI_SURVEILLANCE_ISSUE_CAMPAIGN"
  | "EARLY_ORGANIZING"
  | "RETALIATION_RISK_CONTACT_ORGANIZER"
  | "GAME_WORKER_PATH"
  | "FIRST_CONTRACT_OR_RECOGNITION_READY";

export function classifyStartAnswers(answers: StartAnswers): StartClassification[] {
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

export function getPrimaryClassification(classifications: StartClassification[]) {
  const priority: StartClassification[] = [
    "RETALIATION_RISK_CONTACT_ORGANIZER",
    "POSSIBLE_CONTRACTOR_OR_EXCLUSION",
    "POSSIBLE_SUPERVISOR_EXCLUSION",
    "AI_SURVEILLANCE_ISSUE_CAMPAIGN",
    "GAME_WORKER_PATH",
    "FIRST_CONTRACT_OR_RECOGNITION_READY",
    "EARLY_ORGANIZING",
    "LIKELY_US_PRIVATE_SECTOR_EMPLOYEE",
  ];

  return priority.find((classification) => classifications.includes(classification))!;
}
