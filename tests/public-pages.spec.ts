import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/start",
  "/know-your-rights",
  "/evidence",
  "/organize",
  "/paths",
  "/ai-surveillance",
  "/ai-surveillance/keystrokes",
  "/game-workers",
  "/recognition",
  "/first-contract",
  "/coops",
  "/talk-to-organizer",
  "/resources",
  "/resources/safety-basics",
  "/resources/keystroke-tracking-ai-training",
  "/resources/retaliation-response-checklist",
  "/resources/company-device-and-account-safety-checklist",
  "/tooling",
  "/tooling/cli",
  "/tooling/mcp",
  "/tooling/skills",
  "/privacy",
  "/security",
  "/about",
];

const mobilePages = [
  "/",
  "/paths",
  "/resources",
  "/resources/safety-basics",
  "/resources/keystroke-tracking-ai-training",
  "/tooling",
  "/evidence",
];

for (const pagePath of pages) {
  test(`${pagePath} renders`, async ({ page }) => {
    await page.goto(pagePath);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

for (const pagePath of mobilePages) {
  test(`${pagePath} stays within the mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(pagePath);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const overflowWidth = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflowWidth).toBeLessThanOrEqual(1);
  });
}

test("/resources supports optional tag filters", async ({ page }) => {
  await page.goto("/resources");
  const searchResults = page.getByRole("region", { name: "Search results" });

  await page.getByRole("button", { name: "AI surveillance" }).click();

  await expect(searchResults.getByText("AI Surveillance and Worker Data", { exact: true })).toBeVisible();
  await expect(
    searchResults.getByText("My Employer Is Tracking Computer Activity for AI Training", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(searchResults.getByText("Layoffs and Severance", { exact: true })).toHaveCount(0);
});

test("/resources/software-worker-scale-and-leverage shows resource page chrome", async ({ page }) => {
  await page.goto("/resources/software-worker-scale-and-leverage");

  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  await expect(page.getByText("Before you use this page")).toBeVisible();
  await expect(page.getByRole("heading", { name: "On this page" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sources" })).toBeVisible();
  await expect(page.getByText("When to use")).toBeVisible();
});

test("/paths shows worker reading paths", async ({ page }) => {
  await page.goto("/paths");

  await expect(page.getByRole("heading", { name: /Choose the route/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Retaliation or discipline risk" })).toBeVisible();
  await expect(page.locator('a[href="/resources/safety-basics"]').first()).toHaveAttribute(
    "href",
    "/resources/safety-basics",
  );
  await expect(page.getByRole("link", { name: /AI Surveillance and Worker Data/ })).toHaveAttribute(
    "href",
    "/resources/ai-surveillance-worker-data",
  );
});

test("/resources/safety-basics shows canonical safety page", async ({ page }) => {
  await page.goto("/resources/safety-basics");

  await expect(page.getByRole("heading", { name: "Safety Basics Before You Organize" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "First move: get off company systems" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Source footing" })).toBeVisible();
});

test("/resources/public-sector-workers-start-here shows structured sources", async ({ page }) => {
  await page.goto("/resources/public-sector-workers-start-here");

  await expect(page.getByRole("heading", { name: "Source footing" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Are You Covered\?/ })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /The Statute: Section 7102. Employees' rights/ }),
  ).toBeVisible();
});

test("/organize shows hub page structure", async ({ page }) => {
  await page.goto("/organize");

  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  await expect(page.getByText("Start here", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Workplace mapping" })).toBeVisible();
});
