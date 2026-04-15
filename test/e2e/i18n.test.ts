import { test, expect } from "@playwright/test";
import { DockerComposeEnvironment } from "testcontainers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let environment: any;

test.describe("routing-based i18n on login page", async () => {
  test.beforeAll(async () => {
    environment = await new DockerComposeEnvironment("../tau", "compose.yaml")
      .withProfiles("prod")
      .up();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
  });

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

  test("pl", async ({ page }) => {
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

  test.afterAll(async () => {
    await environment.down();
  });
});
