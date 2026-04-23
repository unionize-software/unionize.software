import { expect, test } from "@playwright/test";

test("start wizard does not call intake API", async ({ page }) => {
  let intakeCalled = false;

  page.on("request", (request) => {
    if (request.url().includes("/api/intake")) {
      intakeCalled = true;
    }
  });

  await page.goto("/start");

  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByRole("button", { name: "Employee" }).click();
  await page.getByRole("button", { name: "No" }).click();
  await page.getByRole("button", { name: "Startup" }).click();
  await page.getByRole("button", { name: "Hybrid" }).click();
  await page.getByRole("button", { name: "Full-stack, frontend, or backend" }).click();
  await page.getByRole("button", { name: "AI surveillance" }).click();
  await page.getByRole("button", { name: "None yet" }).click();
  await page.getByRole("button", { name: "No" }).click();
  await page.getByRole("button", { name: "No" }).click();

  await expect(page.getByRole("heading", { name: /AI surveillance issue campaign/i })).toBeVisible();
  expect(intakeCalled).toBeFalsy();
});
