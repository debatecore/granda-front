import { expect } from "@playwright/test";
import { testInTournamentAsAdmin } from "./e2eUtils";

testInTournamentAsAdmin(
  "should present the welcome screen when the tournament plan does not exist",
  async ({ page }) => {
    // GIVEN
    await expect(
      page.getByRole("heading", { name: /Welcome to/i }),
    ).toBeVisible();

    // THEN
    await expect(
      page.getByRole("link", { name: "Tournament Ladder" }),
    ).toBeVisible();
  },
);

testInTournamentAsAdmin(
  "should present the 4 informative placeholder panels after a tournament plan is created",
  async ({ page }) => {
    // GIVEN
    await expect(
      page.getByRole("heading", { name: /Welcome to/i }),
    ).toBeVisible();

    // WHEN
    await page.getByRole("link", { name: "Tournament Ladder" }).click();
    await page.waitForURL(/ladder/);

    await page
      .getByRole("spinbutton", { name: "Group phase rounds" })
      .fill("2");
    await page.getByRole("spinbutton", { name: "Groups count" }).fill("2");
    await page.locator("#total_teams").fill("8");
    await page
      .getByRole("spinbutton", { name: "Total teams Advancing teams" })
      .fill("4");
    await page.getByRole("button", { name: "Plan tournament" }).click();

    await expect(
      page.getByRole("heading", { name: "Tournament Ladder" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Overview" }).click();

    // THEN
    await expect(
      page.getByText("Team leaderboard (to be implemented)"),
    ).toBeVisible();
    await expect(
      page.getByText("Upcoming debates (to be implemented)"),
    ).toBeVisible();
    await expect(page.getByText("Event log (to be implemented)")).toBeVisible();
    await expect(
      page.getByText("Tournament rules (to be implemented)"),
    ).toBeVisible();
  },
);
