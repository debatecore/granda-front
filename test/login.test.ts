import { test, expect } from "@playwright/test";

test.describe("login procedure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
  });

  const handle = "admin";
  const password = "admin";

  test("default credentials", async ({ page }) => {
    // GIVEN
    const usernameInput = page.getByRole("textbox", {
      name: "Your handle (username)",
    });
    const passwordInput = page.getByRole("textbox", { name: "Your password" });
    const loginButton = page.getByRole("button", { name: "Log in" });
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // WHEN
    await usernameInput.fill(handle);
    await expect(usernameInput).toHaveValue(handle);
    await passwordInput.fill(password);
    await loginButton.click();

    // THEN
    await page.waitForURL("/en/tournaments");
    const welcomeMessage = page.getByRole("heading", {
      name: `Welcome, ${handle}!`,
    });
    await expect(welcomeMessage).toBeVisible();
  });

  test("invalid credentials", async ({ page }) => {
    // GIVEN
    const usernameInput = page.getByRole("textbox", {
      name: "Your handle (username)",
    });
    const passwordInput = page.getByRole("textbox", { name: "Your password" });
    const loginButton = page.getByRole("button", { name: "Log in" });
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // WHEN
    await usernameInput.fill(handle);
    await expect(usernameInput).toHaveValue(handle);
    await passwordInput.fill("invalid password");
    await loginButton.click();

    // THEN
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("lacking password", async ({ page }) => {
    // GIVEN
    const usernameInput = page.getByRole("textbox", {
      name: "Your handle (username)",
    });
    const loginButton = page.getByRole("button", { name: "Log in" });
    await expect(usernameInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // WHEN
    await usernameInput.fill(handle);
    await expect(usernameInput).toHaveValue(handle);
    await loginButton.click();

    // THEN
    await expect(page.getByText("Password must not be empty.")).toBeVisible();
  });

  test("lacking handle", async ({ page }) => {
    // GIVEN
    const passwordInput = page.getByRole("textbox", { name: "Your password" });
    const loginButton = page.getByRole("button", { name: "Log in" });
    await expect(loginButton).toBeVisible();

    // WHEN
    await passwordInput.fill(handle);
    await loginButton.click();

    // THEN
    await expect(page.getByText("Handle must not be empty.")).toBeVisible();
  });
});
