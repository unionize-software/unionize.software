const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_INTAKE_RETENTION_DAYS = 30;
export const DEFAULT_INTAKE_PURGE_GRACE_DAYS = 7;
export const MAX_INTAKE_REQUEST_BYTES = 16 * 1024;
export const MAX_INTAKE_CIPHERTEXT_CHARS = 12_000;
export const INTAKE_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const MAX_INTAKE_SUBMISSIONS_PER_WINDOW = 5;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function getIntakeRetentionDays() {
  return parsePositiveInteger(process.env.INTAKE_RETENTION_DAYS, DEFAULT_INTAKE_RETENTION_DAYS);
}

export function getIntakePurgeGraceDays() {
  return parsePositiveInteger(process.env.INTAKE_PURGE_GRACE_DAYS, DEFAULT_INTAKE_PURGE_GRACE_DAYS);
}

export function getIntakeExpiryDate(from = new Date()) {
  return new Date(from.getTime() + getIntakeRetentionDays() * DAY_IN_MS);
}

export function getIntakePurgeCutoffDate(from = new Date()) {
  return new Date(from.getTime() - getIntakePurgeGraceDays() * DAY_IN_MS);
}

export function getIntakeRetentionPolicy() {
  return {
    retentionDays: getIntakeRetentionDays(),
    purgeGraceDays: getIntakePurgeGraceDays(),
  };
}

