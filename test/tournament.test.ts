import { test, expect } from "@playwright/test";

test.describe("tournament creation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");

    await page
      .getByRole("textbox", { name: "Your handle (username)" })
      .fill("admin");

    await page
      .getByRole("textbox", { name: "Your password" })
      .fill("admin");

    await page.getByRole("button", { name: "Log in" }).click();

    await page.waitForURL("/en/tournaments");
  });

  test("admin sees create tournament button", async ({ page }) => {
    const button = page.getByRole("button", { name: "Create tournament" });
    await expect(button).toBeVisible();
  });

  test("opens create tournament modal", async ({ page }) => {
    await page.getByRole("button", { name: "Create tournament" }).click();

    await expect(
      page.getByRole("heading", { name: "Create tournament" })
    ).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByLabel("Short name")).toBeVisible();
  });

  test("creates tournament successfully", async ({ page }) => {
    await page.getByRole("button", { name: "Create tournament" }).click();

    await expect(
      page.getByRole("heading", { name: "Create tournament" })
    ).toBeVisible();

    const unique = Date.now();
    const fullName = `Tournament ${unique}`;
    const shortName = `T${unique}`;

    await page.getByLabel("Full name").fill(fullName);
    await page.getByLabel("Short name").fill(shortName);
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.getByText(fullName)).toBeVisible();
  });

  test("shows error when creating duplicate tournament", async ({ page }) => {
    const unique = Date.now();
    const fullName = `Tournament ${unique}`;
    const shortName = `T${unique}`;

    await page.getByRole("button", { name: "Create tournament" }).click();

    await expect(
      page.getByRole("heading", { name: "Create tournament" })
    ).toBeVisible();

    await page.getByLabel("Full name").fill(fullName);
    await page.getByLabel("Short name").fill(shortName);
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(
      page.getByRole("heading", { name: "Create tournament" })
    ).not.toBeVisible();

    await expect(page.getByText(fullName)).toBeVisible();

    await page.getByRole("button", { name: "Create tournament" }).click();

    await expect(
      page.getByRole("heading", { name: "Create tournament" })
    ).toBeVisible();

    await page.getByLabel("Full name").fill(fullName);
    await page.getByLabel("Short name").fill(shortName);
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.locator("form")).toContainText(/failed to create tournament/i);
  });
});