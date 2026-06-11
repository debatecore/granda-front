import { expect } from "@playwright/test";
import { testInTournamentAsAdmin, planTournament } from "./e2eUtils";

testInTournamentAsAdmin(
  "should present the welcome screen when the tournament plan does not exist",
  async ({ page }) => {
    // GIVEN
    await expect(
      page.getByRole("heading", { name: /Welcome to/i }),
    ).toBeVisible();

    // WHEN
    await page.getByRole("link", { name: "Tournament Ladder" }).nth(1).click();
    await page.waitForURL(/ladder/);

    // THEN
    await expect(
      page.getByRole("heading", { name: "Tournament Planning" }),
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
    await planTournament({
      page,
      groupPhaseRounds: 2,
      groupsCount: 2,
      totalTeams: 8,
      advancingTeams: 4,
    });

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
