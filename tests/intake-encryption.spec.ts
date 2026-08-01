import { lookup } from "node:dns/promises";
import { promises as fs } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  INTAKE_RATE_LIMIT_WINDOW_MS,
  MAX_INTAKE_SUBMISSIONS_PER_WINDOW,
} from "@/lib/intake/config";
import { takeRateLimit } from "@/lib/security/rateLimit";

const intakePostUrl =
  process.env.PLAYWRIGHT_INTAKE_URL ?? "https://api.unionize.software/intake";

/** Lambda CORS allowlist is the live www origin, not the Playwright dev server. */
const intakeAllowedOrigin = "https://www.unionize.software";

function buildValidApiPayload() {
  return {
    ciphertext: "c".repeat(256),
    public_key_id: "default-2026-04",
    urgency: "low",
    coarse_region: "California",
    work_type: "game dev",
  };
}

test("intake request contains ciphertext and no plaintext fields", async ({ page }) => {
  let requestBody: Record<string, unknown> | null = null;

  await page.route("**/intake", async (route) => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "test-intake-id",
        expires_at: "2026-05-22T00:00:00.000Z",
      }),
    });
  });

  await page.goto("/talk-to-organizer");

  await page.getByLabel("Name or alias").fill("Alex");
  await page.getByLabel("Personal email").fill("alex@example.com");
  await page.getByLabel("Personal phone (optional)").fill("555-0100");
  await page.getByLabel("State or region").fill("California");
  await page.getByLabel("Employer").fill("Example Games");
  await page.getByLabel("Best contact time").fill("Evenings");
  await page
    .getByLabel("Context")
    .fill("Workers are being tracked and several people are worried about discipline and AI training.");

  await page.getByRole("button", { name: /Submit encrypted intake/i }).click();

  await expect.poll(() => requestBody).not.toBeNull();
  const payload = requestBody as unknown as Record<string, unknown>;
  expect(payload).toHaveProperty("ciphertext");
  expect(payload).toHaveProperty("public_key_id");
  expect(payload).not.toHaveProperty("name");
  expect(payload).not.toHaveProperty("email");
  expect(payload).not.toHaveProperty("phone");
  expect(payload).not.toHaveProperty("employer");
  expect(payload).not.toHaveProperty("context");
  expect(String(payload.ciphertext)).not.toContain("Alex");
  expect(String(payload.ciphertext)).not.toContain("Example Games");
  await expect(page.getByText(/Ciphertext expiry target/i)).toBeVisible();
});

test.describe("intake API (deployed)", () => {
  let deployedIntakeReachable = false;

  test.beforeAll(async () => {
    if (process.env.PLAYWRIGHT_SKIP_LIVE_INTAKE === "1") {
      deployedIntakeReachable = false;
      return;
    }
    try {
      const host = new URL(intakePostUrl).hostname;
      await lookup(host);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const preflight = await fetch(intakePostUrl, {
          method: "OPTIONS",
          headers: { Origin: intakeAllowedOrigin },
          signal: controller.signal,
        });
        deployedIntakeReachable = preflight.status === 204 || preflight.status === 403;
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      deployedIntakeReachable = false;
    }
  });

  test.beforeEach(() => {
    test.skip(
      !deployedIntakeReachable,
      `Skipped: intake API not reachable at ${intakePostUrl} (deploy Terraform + DNS, or set PLAYWRIGHT_SKIP_LIVE_INTAKE=1).`,
    );
  });

  test("intake API rejects plaintext pii keys", async ({ request }) => {
    const response = await request.post(intakePostUrl, {
      headers: {
        Origin: intakeAllowedOrigin,
        "x-forwarded-for": "198.51.100.10",
      },
      data: {
        name: "Alex",
        email: "alex@example.com",
        ciphertext: "ciphertext",
        public_key_id: "default-2026-04",
        urgency: "low",
      },
    });

    expect(response.status()).toBe(400);
  });

  test("intake API rejects requests from the wrong origin", async ({ request }) => {
    const response = await request.post(intakePostUrl, {
      headers: {
        Origin: "https://example.com",
        "x-forwarded-for": "198.51.100.11",
      },
      data: buildValidApiPayload(),
    });

    expect(response.status()).toBe(403);
  });

  test("intake API rejects unknown public key ids", async ({ request }) => {
    const response = await request.post(intakePostUrl, {
      headers: {
        Origin: intakeAllowedOrigin,
        "x-forwarded-for": "198.51.100.12",
      },
      data: {
        ...buildValidApiPayload(),
        public_key_id: "wrong-key-id",
      },
    });

    expect(response.status()).toBe(400);
  });

  test("intake API rejects oversized encrypted payloads", async ({ request }) => {
    const response = await request.post(intakePostUrl, {
      headers: {
        Origin: intakeAllowedOrigin,
        "x-forwarded-for": "198.51.100.13",
      },
      data: {
        ...buildValidApiPayload(),
        ciphertext: "x".repeat(20_000),
      },
    });

    expect(response.status()).toBe(413);
  });
});

test("rate limiter blocks repeated attempts within the window", async () => {
  const key = `intake-rate-limit-test-${Date.now()}`;
  const now = Date.now();

  for (let attempt = 0; attempt < MAX_INTAKE_SUBMISSIONS_PER_WINDOW; attempt += 1) {
    const result = takeRateLimit({
      key,
      limit: MAX_INTAKE_SUBMISSIONS_PER_WINDOW,
      windowMs: INTAKE_RATE_LIMIT_WINDOW_MS,
      now,
    });

    expect(result.allowed).toBeTruthy();
  }

  const blockedResult = takeRateLimit({
    key,
    limit: MAX_INTAKE_SUBMISSIONS_PER_WINDOW,
    windowMs: INTAKE_RATE_LIMIT_WINDOW_MS,
    now,
  });

  expect(blockedResult.allowed).toBeFalsy();

  const resetResult = takeRateLimit({
    key,
    limit: MAX_INTAKE_SUBMISSIONS_PER_WINDOW,
    windowMs: INTAKE_RATE_LIMIT_WINDOW_MS,
    now: now + INTAKE_RATE_LIMIT_WINDOW_MS + 1,
  });

  expect(resetResult.allowed).toBeTruthy();
});

test("supabase migrations enable row level security", async () => {
  const migrationPath = path.join(process.cwd(), "supabase", "migrations", "0002_rls.sql");
  const contents = await fs.readFile(migrationPath, "utf8");

  expect(contents).toContain("enable row level security");
});

test("intake hardening migration adds expiry metadata", async () => {
  const migrationPath = path.join(
    process.cwd(),
    "supabase",
    "migrations",
    "0003_intake_ops_hardening.sql",
  );
  const contents = await fs.readFile(migrationPath, "utf8");

  expect(contents).toContain("expires_at");
  expect(contents).toContain("fingerprint");
});
