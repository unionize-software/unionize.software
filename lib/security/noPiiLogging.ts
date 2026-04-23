import { redactSensitiveFields } from "@/lib/security/redact";

export function logOperationalEvent(event: string, details?: Record<string, unknown>) {
  const safeDetails = details ? redactSensitiveFields(details) : undefined;
  console.info(`[unionize.software] ${event}`, safeDetails);
}

