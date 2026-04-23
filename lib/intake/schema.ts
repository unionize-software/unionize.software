import { z } from "zod";

import { MAX_INTAKE_CIPHERTEXT_CHARS } from "@/lib/intake/config";

export const intakeFormSchema = z.object({
  nameOrAlias: z.string().trim().min(1, "A name or alias is required.").max(120),
  personalEmail: z.string().trim().email("Use a valid personal email.").max(254),
  personalPhone: z.string().trim().max(50).optional(),
  stateOrRegion: z.string().trim().min(2, "Add a coarse state or region.").max(80),
  roleFamily: z.string().min(1),
  employer: z.string().trim().min(1, "Employer is required.").max(160),
  topIssue: z.string().min(1),
  coworkersInvolved: z.string().min(1),
  urgentRetaliationConcern: z.enum(["yes", "no"]),
  bestContactTime: z.string().trim().min(1, "Best contact time is required.").max(120),
  context: z
    .string()
    .trim()
    .min(20, "Add enough context for an organizer to understand the issue.")
    .max(3000, "Keep the initial context under 3000 characters."),
});

export const intakeApiSchema = z
  .object({
    ciphertext: z.string().min(1).max(MAX_INTAKE_CIPHERTEXT_CHARS),
    public_key_id: z.string().min(1),
    urgency: z.enum(["low", "medium", "high", "retaliation-risk"]),
    coarse_region: z.string().max(80).optional(),
    work_type: z.string().max(120).optional(),
  })
  .strict();

export const forbiddenPlaintextKeys = [
  "name",
  "nameoralias",
  "email",
  "personalemail",
  "phone",
  "personalphone",
  "employer",
  "context",
  "message",
];

export type IntakeFormValues = z.infer<typeof intakeFormSchema>;
export type IntakeApiSubmission = z.infer<typeof intakeApiSchema>;

export function deriveUrgency(values: IntakeFormValues) {
  if (values.urgentRetaliationConcern === "yes" || values.topIssue === "retaliation") {
    return "retaliation-risk" as const;
  }

  if (values.coworkersInvolved === "4+ trusted coworkers") {
    return "high" as const;
  }

  if (values.coworkersInvolved === "1-3 trusted coworkers") {
    return "medium" as const;
  }

  return "low" as const;
}

export function deriveCoarseRegion(value: string) {
  return value.trim().slice(0, 80) || undefined;
}
