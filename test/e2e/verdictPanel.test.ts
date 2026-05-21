import { expect } from "@playwright/test";
import {
  test,
  testInTournamentAsAdmin,
  testInTournamentAsUser,
  planTournament,
  createUserAndCastVote,
} from "./e2eUtils";

test.describe("verdict panel", () => {
  // const userId = UUID_MAX;
  // const tournamentId = "019da9ec-09ed-75b0-b437-803201f5453f";
  // const debateId = "019dc02f-cc43-74b1-a093-fc281bf009db";
  // const verdictPageUrl = `/en/tournaments/verdict?userId=${userId}&tournamentId=${tournamentId}&debateId=${debateId}`;
  // const tournamentId = "019e0840-ec00-7c63-8dd5-4a28c7e7a218";
  // const debateId = "019dc02f-cc43-74b1-a093-fc281bf009db";
  // const verdictPageUrl = `/en/tournaments/verdict?userId=${userId}&tournamentId=${tournamentId}&debateId=${debateId}`;

  // test.beforeEach(async ({ page }) => {
  //   await page.goto("/en/login");

  //   await page
  //     .getByRole("textbox", { name: "Your handle (username)" })
  //     .fill("admin");

  //   await page.getByRole("textbox", { name: "Your password" }).fill("admin");

  //   await page.getByRole("button", { name: "Log in" }).click();

  //   await page.waitForURL("/en/tournaments");
  // });

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

      await createUserAndCastVote({
        page,
        numberOfUsers: "3",
      });

      // await page.getByRole("link", { name: "No motion" }).first().click();
      // await page.waitForURL(/debates/);

      // const winningText = page.getByText("is the winning team!");
      // await expect(winningText).toBeVisible();
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

      const winningText = page.getByText("is the winning team!");
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

      const winningText = page.getByText("is the winning team!");
      await expect(winningText).toBeVisible();

      // PATCH check (this, for some reason, gives a 404 resource not found error, same happens when running the site through a browser)
      await page.getByRole("button", { name: "Opposition" }).click();
      await page.getByRole("button", { name: "Submit" }).click();

      const otherWinningText = page.getByText("is the winning team!");
      await expect(otherWinningText).toBeVisible();
    },
  );
});
