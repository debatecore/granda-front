import { expect, Page } from "@playwright/test";
import { testInTournamentAsAdmin } from "./e2eUtils";

testInTournamentAsAdmin(
  "tournament ladder is generated after planning a tournament",
  async ({ page }) => {
    // GIVEN
    const groupPhaseRounds = 3;
    const groupsCount = 5;
    const totalTeams = 30;
    const advancingTeams = 16;

    // WHEN
    await planTournament({
      page,
      groupPhaseRounds,
      groupsCount,
      totalTeams,
      advancingTeams,
    });

    // THEN
    await expect(
      page.getByRole("heading", { name: "Tournament Ladder" }),
    ).toBeVisible();

    const roundLabel = page.getByText(/^round.?\d/i);
    await expect(roundLabel).toBeVisible();
    expect(roundLabel.count()).toBe(7);
  },
);

testInTournamentAsAdmin(
  "round labels show config modal on click",
  async ({ page }) => {
    // GIVEN
    await planTournament({
      page,
      groupPhaseRounds: 2,
      groupsCount: 5,
      totalTeams: 22,
      advancingTeams: 8,
    });

    // WHEN
    page.getByText("round_1").first().click();

    // THEN
    expect(
      page.getByRole("heading", { name: /Round.+configuration/ }),
    ).toBeVisible();
  },
);

async function planTournament({
  page,
  groupPhaseRounds,
  groupsCount,
  totalTeams,
  advancingTeams,
}: {
  page: Page;
  groupPhaseRounds: number;
  groupsCount: number;
  totalTeams: number;
  advancingTeams: number;
}) {
  await page.getByRole("link", { name: "Tournament Ladder" }).click();
  await page.waitForURL(/ladder/);
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
}
