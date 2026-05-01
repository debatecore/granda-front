import { expect } from "@playwright/test";
import { testInTournamentAsAdmin } from "./e2eUtils";

testInTournamentAsAdmin(
  "tournament ladder is generated after planning a tournament",
  async ({ page }) => {
    // GIVEN
    const groupPhaseRounds = 3;
    const groupsCount = 5;
    const totalTeams = 30;
    const advancingTeams = 16;
    await page.getByRole("link", { name: "Tournament Ladder" }).click();
    await page.waitForURL(/ladder/);

    // WHEN
    await page
      .getByRole("spinbutton", { name: "Group phase rounds" })
      .fill(groupPhaseRounds.toString());
    await page
      .getByRole("spinbutton", { name: "Groups count" })
      .fill(groupsCount.toString());
    await page.locator("#total_teams").fill(totalTeams.toString());
    await page
      .getByRole("spinbutton", { name: "Total teams Advancing teams" })
      .fill(advancingTeams.toString());
    await page.getByRole("button", { name: "Plan tournament" }).click();

    // THEN
    expect(
      page.getByRole("heading", { name: "Tournament Ladder" }),
    ).toBeVisible();
    expect(page.getByText(/^round/i)).toBeVisible();
  },
);
