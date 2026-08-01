import { z } from "zod";

export const startAnswersSchema = z.object({
  inUnitedStates: z.enum(["yes", "no"]),
  privateSectorEmployer: z.enum(["yes", "no", "unsure"]),
  workerStatus: z.enum(["employee", "contractor", "unsure"]),
  supervisoryAuthority: z.enum(["yes", "no", "unsure"]),
  workplaceType: z.string(),
  workArrangement: z.string(),
  roleFamily: z.string(),
  topIssue: z.string(),
  trustedCoworkers: z.string(),
  retaliationRisk: z.enum(["yes", "no"]),
  organizerContact: z.string().optional(),
});

export function getPathfinderReference() {
  return {
    title: "Start Here",
    version: "local-0.1.0",
    questions: Object.keys(startAnswersSchema.shape),
  };
}

export function buildStartPath(answers: unknown) {
  const parsed = startAnswersSchema.parse(answers);
  // Minimal implementation: return normalized answers + a couple of classifications.
  const classifications: string[] = [];
  if (parsed.retaliationRisk === "yes" || parsed.topIssue.toLowerCase().includes("retaliation")) {
    classifications.push("RETALIATION_RISK_CONTACT_ORGANIZER");
  }
  if (parsed.topIssue.toLowerCase().includes("ai")) {
    classifications.push("AI_SURVEILLANCE_ISSUE_CAMPAIGN");
  }
  if (classifications.length === 0) classifications.push("EARLY_ORGANIZING");

  return {
    classifications,
    likelyPath: classifications[0],
    whyThisPath: "Computed locally from Start Here answers.",
    whatNotToDo: [
      "Avoid organizing on company devices, accounts, or chat.",
      "Do not sabotage systems or falsify work.",
    ],
    next72Hours: [
      "Move sensitive conversations to personal channels.",
      "Write down key facts and who is affected.",
    ],
    relevantResources: [],
    showOrganizerIntakeCta: parsed.retaliationRisk === "yes",
  };
}
