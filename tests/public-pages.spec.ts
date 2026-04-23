import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/start",
  "/know-your-rights",
  "/organize",
  "/ai-surveillance",
  "/ai-surveillance/keystrokes",
  "/game-workers",
  "/recognition",
  "/first-contract",
  "/coops",
  "/talk-to-organizer",
  "/resources",
  "/resources/keystroke-tracking-ai-training",
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
  "/resources",
  "/resources/keystroke-tracking-ai-training",
  "/tooling",
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
