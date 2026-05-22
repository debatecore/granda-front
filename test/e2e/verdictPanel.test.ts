import { expect } from "@playwright/test";
import {
  test,
  testInTournamentAsAdmin,
  testInTournamentAsUser,
  planTournament,
  createUserAndCastVote,
} from "./e2eUtils";

test.describe("verdict panel", () => {
  testInTournamentAsAdmin(
    "judge permission renders verdict submission options",
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

      await page.getByRole("link", { name: "No motion" }).first().click();
      await page.waitForURL(/debates/);

      await page.getByRole("button", { name: "Proposition" }).click();
    },
  );

  testInTournamentAsUser(
    "non-judge permission hides verdict submission options",
    async ({ page }) => {
      await page.waitForURL("/en/tournaments");
      await page.getByRole("link", { name: "Tournament" }).click();

      await page.getByRole("link", { name: "Tournament Ladder" }).click();
      await page.getByRole("link", { name: "No motion" }).first().click();

      await expect(page.getByText("Verdict panel")).toBeVisible();
      await expect(page.getByText("Opposition")).not.toBeVisible();
    },
  );

  testInTournamentAsAdmin(
    "displays majority verdict from odd number of verdicts",
    async ({ page, backendPort }) => {
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

      await createUserAndCastVote({
        page,
        backendPort,
        numberOfUsers: "3",
      });

      await page.getByRole("link", { name: "Tournament Ladder" }).click();
      await page.getByRole("link", { name: "No motion" }).first().click();
      await page.waitForURL(/debates/);

      const winningText = page.getByText("ThePropositionis the winning");
      await expect(winningText).toBeVisible();
    },
  );

  testInTournamentAsAdmin(
    "with POST request, creates new verdict",
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

      await page.getByRole("link", { name: "No motion" }).first().click();
      await page.waitForURL(/debates/);

      await page.getByRole("button", { name: "Proposition" }).click();
      await page.getByRole("button", { name: "Submit" }).click();

      const winningText = page.getByText("ThePropositionis the winning");
      await expect(winningText).toBeVisible();
    },
  );

  testInTournamentAsAdmin(
    "with PATCH request, updates existing verdict",
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

      await page.getByRole("link", { name: "No motion" }).first().click();
      await page.waitForURL(/debates/);

      await page.getByRole("button", { name: "Proposition" }).click();
      await page.getByRole("button", { name: "Submit" }).click();

      const winningText = page.getByText("ThePropositionis the winning");
      await expect(winningText).toBeVisible();

      // PATCH check
      await page.getByRole("button", { name: "Opposition" }).click();
      await page.getByRole("button", { name: "Submit" }).click();

      const otherWinningText = page.getByText("TheOppositionis the winning");
      await expect(otherWinningText).toBeVisible();
    },
  );
});
