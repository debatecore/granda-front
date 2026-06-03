import { expect } from "@playwright/test";
import { testInTournamentAsAdmin } from "./e2eUtils";

testInTournamentAsAdmin(
  "settings shortcut redirects to settings page and is removed from account dropdown",
  async ({ page }) => {
    // GIVEN
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();

    const settingsShortcut = page.getByRole("button", { name: "Settings" });

    await expect(settingsShortcut).toBeVisible();

    // WHEN
    await settingsShortcut.click();

    // THEN
    await page.waitForURL(/\/en\/t\/[^/]+\/settings$/);
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    // WHEN
    await page.getByText("admin").click();

    // THEN
    await expect(page.getByText("Your account")).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Settings" })).toHaveCount(
      0,
    );
    await expect(page.getByRole("menuitem", { name: "Log out" })).toBeVisible();
  },
);
