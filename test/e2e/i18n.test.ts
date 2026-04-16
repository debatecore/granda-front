import { expect } from "@playwright/test";
import { test } from "./e2eUtils";

test.describe("routing-based i18n on login page", async () => {
  test("en", async ({ page }) => {
    // GIVEN
    await page.goto("/en/login");

    // WHEN
    const handleLabel = page.getByText("Handle");
    const passwordLabel = page.getByText("Password");
    const loginButton = page.getByRole("button", { name: "Log in" });

    // THEN
    await expect(handleLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test.only("pl", async ({ page }) => {
    // GIVEN
    await page.goto("/pl/login");

    // WHEN
    const handleLabel = page.getByText("Nick");
    const passwordLabel = page.getByText("Hasło");
    const loginButton = page.getByRole("button", { name: "Zaloguj się" });

    // THEN
    await expect(handleLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});
