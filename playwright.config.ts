import { defineConfig, devices } from "@playwright/test";

const testPublicKeyBase64 =
  process.env.NEXT_PUBLIC_INTAKE_PUBLIC_KEY_BASE64 ??
  "OoEiPBwUDiIQ45+GbW3UaUU0dJ8pZ3+RNDGmyK7xL0I=";
const testPort = 3100;
const testBaseUrl = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: testBaseUrl,
    trace: "on-first-retry",
  },
  webServer: {
    command: `pnpm build && pnpm exec next start --hostname 127.0.0.1 --port ${testPort}`,
    url: testBaseUrl,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SITE_URL: testBaseUrl,
      NEXT_PUBLIC_INTAKE_PUBLIC_KEY_ID: "test-2026-04",
      NEXT_PUBLIC_INTAKE_PUBLIC_KEY_BASE64: testPublicKeyBase64,
      NEXT_PUBLIC_INTAKE_PUBLIC_KEY_ROTATED_AT: "2026-04-22",
      INTAKE_RETENTION_DAYS: "30",
      INTAKE_PURGE_GRACE_DAYS: "7",
      NEXT_PUBLIC_ENABLE_SENTRY: "false",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
