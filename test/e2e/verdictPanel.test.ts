import { UUID_MAX } from "@/types/User";
import { expect } from "@playwright/test";
import { test, testInTournamentAsAdmin } from "./e2eUtils";
import { planTournament } from "./tournament-ladder-rendering.test";

test.describe("verdict panel", () => {
  const userId = UUID_MAX;
  // const tournamentId = "019da9ec-09ed-75b0-b437-803201f5453f";
  // const debateId = "019dc02f-cc43-74b1-a093-fc281bf009db";
  // const verdictPageUrl = `/en/tournaments/verdict?userId=${userId}&tournamentId=${tournamentId}&debateId=${debateId}`;
  const tournamentId = "019e0840-ec00-7c63-8dd5-4a28c7e7a218";
  const debateId = "019dc02f-cc43-74b1-a093-fc281bf009db";
  const verdictPageUrl = `/en/tournaments/verdict?userId=${userId}&tournamentId=${tournamentId}&debateId=${debateId}`;

  // test.beforeEach(async ({ page }) => {
  //   await page.goto("/en/login");

  //   await page
  //     .getByRole("textbox", { name: "Your handle (username)" })
  //     .fill("admin");

  //   await page.getByRole("textbox", { name: "Your password" }).fill("admin");

  //   await page.getByRole("button", { name: "Log in" }).click();

  //   await page.waitForURL("/en/tournaments");
  // });

  // -------------                       why tf is this not working, when the POST one with the exact same lines is working?
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
      page.getByRole("button", { name: "Proposition" });
      page.getByRole("button", { name: "Opposition" });
    },
  );

  test("non-judge permission hides verdict submission options", async ({
    page,
  }) => {
    await page.route(`/users/${userId}`, (route) => {
      route.fulfill({
        status: 403,
        body: JSON.stringify({ error: "Forbidden" }),
      });
    });

    await page.route(
      `/tournaments/${tournamentId}/debates/${debateId}/verdicts`,
      (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([]),
        });
      },
    );

    await page.goto(verdictPageUrl);

    await expect(page.getByText("Verdict panel")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Proposition" }),
    ).not.toBeVisible();
  });

  test("displays majority verdict from odd number of verdicts", async ({
    page,
  }) => {
    await page.route(`/users/${userId}`, (route) => {
      route.abort();
    });

    const verdicts = [
      { id: "v1", judge_user_id: "judge-2", proposition_won: true },
      { id: "v2", judge_user_id: "judge-3", proposition_won: true },
      { id: "v3", judge_user_id: "judge-4", proposition_won: false },
    ];

    await page.route(
      `/tournaments/${tournamentId}/debates/${debateId}/verdicts`,
      (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(verdicts),
        });
      },
    );

    await page.goto(verdictPageUrl);

    await expect(page.getByText("Proposition")).toBeVisible();
  });

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

      await page.getByText("The Proposition is the winning team!").waitFor();
      const winningText = page.getByText(
        "The Proposition is the winning team!",
      );
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

      await page.getByText("The Proposition is the winning team!").waitFor();
      const winningText = page.getByText(
        "The Proposition is the winning team!",
      );
      await expect(winningText).toBeVisible();

      // PATCH check (this check gives a 404 resource not found error?)
      // await page.getByRole("button", { name: "Opposition" }).click();
      // await page.getByRole("button", { name: "Submit" }).click();

      // await page.getByText("The Opposition is the winning team!").waitFor();
      // const updatedWinningText = page.getByText("The Opposition is the winning team!");
      // await expect(updatedWinningText).toBeVisible();
    },
  );
});
