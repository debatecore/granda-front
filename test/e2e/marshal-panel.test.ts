import { expect } from "@playwright/test";
import { testInTournamentAsAdmin, planTournament } from "./e2eUtils";

testInTournamentAsAdmin(
  "marshal panel shows translated proceed to debate button",
  async ({ page }) => {
    // GIVEN
    await planTournament({
      page,
      groupPhaseRounds: 3,
      groupsCount: 5,
      totalTeams: 30,
      advancingTeams: 16,
    });

    // WHEN
    await page
      .getByRole("link", { name: "Unconfigured debate" })
      .first()
      .click();

    await page.waitForURL(/debates/);

    // THEN
    await expect(page.getByText("Marshal Panel")).toBeVisible();

    const proceedToDebateLink = page.getByRole("link", {
      name: "Proceed to Debate!",
    });

    await expect(proceedToDebateLink).toBeVisible();
    await expect(proceedToDebateLink).toHaveAttribute(
      "href",
      /https:\/\/tools\.debateco\.re\/oxford-debate\/setup\?motion=/,
    );

    await expect(page.getByText("Conduct debate!")).not.toBeVisible();
  },
);
