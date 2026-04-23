import type { IntakeApiSubmission } from "@/lib/intake/schema";

type IntakeResponse = {
  id: string;
  expires_at: string;
};

export async function submitEncryptedIntake(payload: IntakeApiSubmission) {
  const response = await fetch("/api/intake", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as
    | {
        error?: string;
        id?: string;
        expires_at?: string;
      }
    | null;

  if (!response.ok || !data?.id || !data.expires_at) {
    throw new Error(data?.error ?? "The encrypted intake could not be stored.");
  }

  return data as IntakeResponse;
}
