import { expect, test, type Page } from "@playwright/test";

async function answerPathfinder(page: Page, labels: string[]) {
  for (const label of labels) {
    await page.getByRole("button", { name: label }).click();
  }
}

test("start wizard does not call intake API and makes AI guide recommendations clickable", async ({ page }) => {
  let intakeCalled = false;

  page.on("request", (request) => {
    if (request.url().includes("/api/intake")) {
      intakeCalled = true;
    }
  });

  await page.goto("/start");
  await answerPathfinder(page, [
    "Yes",
    "Yes",
    "Employee",
    "No",
    "Startup",
    "Hybrid",
    "Full-stack, frontend, or backend",
    "AI surveillance",
    "None yet",
    "No",
    "No",
  ]);

  await expect(page.getByRole("heading", { name: /AI surveillance issue campaign/i })).toBeVisible();
  await expect(page.getByText("AI or monitoring issue", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("AI_SURVEILLANCE_ISSUE_CAMPAIGN")).toHaveCount(0);

  const aiGuideLink = page.getByRole("link", { name: "Open AI Surveillance and Worker Data" });
  await expect(aiGuideLink).toBeVisible();
  await expect(aiGuideLink).toHaveAttribute("href", "/resources/ai-surveillance-worker-data");
  await expect(
    page.getByRole("link", { name: /Retaliation Warning Signs/ }),
  ).toHaveAttribute("href", "/resources/retaliation-warning-signs");

  await aiGuideLink.click();
  await expect(page).toHaveURL(/\/resources\/ai-surveillance-worker-data$/);
  expect(intakeCalled).toBeFalsy();
});

test("retaliation result prioritizes response, device safety, and organizer contact", async ({ page }) => {
  await page.goto("/start");
  await answerPathfinder(page, [
    "Yes",
    "Yes",
    "Employee",
    "No",
    "Startup",
    "Hybrid",
    "Full-stack, frontend, or backend",
    "Retaliation",
    "None yet",
    "Yes",
    "Yes",
  ]);

  await expect(page.getByRole("heading", { name: /Retaliation-risk lane/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Do this first" })).toBeVisible();
  await expect(page.locator('a[href="/resources/retaliation-response-checklist"]').first()).toHaveAttribute(
    "href",
    "/resources/retaliation-response-checklist",
  );
  await expect(page.locator('a[href="/resources/company-device-and-account-safety-checklist"]').first()).toHaveAttribute(
    "href",
    "/resources/company-device-and-account-safety-checklist",
  );
  await expect(page.getByRole("link", { name: /Contact an organizer/i })).toHaveAttribute(
    "href",
    "/talk-to-organizer",
  );
});

test("non-US path shortens the wizard and routes to the off-ramp", async ({ page }) => {
  await page.goto("/start");
  await page.getByRole("button", { name: "No" }).click();

  await expect(
    page.getByRole("heading", { name: /How does the work actually happen/i }),
  ).toBeVisible();

  await answerPathfinder(page, [
    "Mostly remote or distributed",
    "Layoffs or severance",
    "None yet",
    "No",
    "No",
  ]);

  await expect(page.getByRole("heading", { name: /Outside-the-United-States off-ramp/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Outside the United States: Start Here" })).toHaveAttribute(
    "href",
    "/resources/outside-the-united-states-start-here",
  );
});

test("contractor and supervisor lanes use readable signals and primary guides", async ({ page }) => {
  await page.goto("/start");
  await answerPathfinder(page, [
    "Yes",
    "Yes",
    "Contractor",
    "Unsure",
    "Vendor or staffing",
    "Mostly remote or distributed",
    "QA or test",
    "Contractor or vendor issues",
    "1-3 trusted coworkers",
    "No",
    "No",
  ]);

  await expect(page.getByRole("heading", { name: /Possible contractor or misclassification lane/i })).toBeVisible();
  await expect(page.getByText("Coverage question", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Supervisor-status question", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open Contractor, Vendor, and Misclassification Questions" }),
  ).toHaveAttribute("href", "/resources/contractor-vendor-misclassification");
});

test("game worker path recommends the game worker guide", async ({ page }) => {
  await page.goto("/start");
  await answerPathfinder(page, [
    "Yes",
    "Yes",
    "Employee",
    "No",
    "Game studio",
    "Mostly in-person",
    "Game development",
    "Crunch",
    "1-3 trusted coworkers",
    "No",
    "No",
  ]);

  await expect(page.getByRole("heading", { name: /Game worker lane/i })).toBeVisible();
  await expect(page.getByText("Game-worker lane", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Game Worker Crunch" })).toHaveAttribute(
    "href",
    "/resources/game-worker-crunch",
  );
});
