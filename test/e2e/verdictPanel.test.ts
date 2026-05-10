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

  test("judge permission renders verdict submission options", async ({
    page,
  }) => {
    await page.route(`/users/${userId}`, (route) => {
      route.abort();
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
      page.getByRole("button", { name: /proposition/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /opposition/i }),
    ).toBeVisible();
  });

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
      page.getByRole("button", { name: /proposition/i }),
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
    "submits new verdict with POST request",
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

      await page.route(`/users/${userId}`, (route) => {
        route.abort();
      });

      let postCalled = false;

      await page.route(
        `/tournaments/${tournamentId}/debates/${debateId}/verdicts`,
        (route) => {
          if (route.request().method() === "POST") {
            postCalled = true;
            route.fulfill({
              status: 200,
              body: JSON.stringify({
                id: "v-new",
                judge_user_id: userId,
                proposition_won: true,
              }),
            });
          } else {
            route.fulfill({
              status: 200,
              body: JSON.stringify([]),
            });
          }
        },
      );

      await page.goto(verdictPageUrl);

      await page.getByRole("button", { name: /proposition/i }).click();
      await page.getByRole("button", { name: /submit/i }).click();

      await expect(postCalled).toBeTruthy();
    },
  );

  test("updates existing verdict with PATCH request", async ({ page }) => {
    const existingVerdictId = "v-existing";

    await page.route(`/users/${userId}`, (route) => {
      route.abort();
    });

    let patchCalled = false;

    await page.route(
      `/tournaments/${tournamentId}/debates/${debateId}/verdicts`,
      (route) => {
        if (route.request().method() === "PATCH") {
          patchCalled = true;
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              id: existingVerdictId,
              judge_user_id: userId,
              proposition_won: false,
            }),
          });
        } else {
          route.fulfill({
            status: 200,
            body: JSON.stringify([
              {
                id: existingVerdictId,
                judge_user_id: userId,
                proposition_won: true,
              },
            ]),
          });
        }
      },
    );

    await page.route(
      `/tournaments/${tournamentId}/debates/${debateId}/verdicts/${existingVerdictId}`,
      (route) => {
        if (route.request().method() === "PATCH") {
          patchCalled = true;
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              id: existingVerdictId,
              judge_user_id: userId,
              proposition_won: false,
            }),
          });
        }
      },
    );

    await page.goto(verdictPageUrl);

    await page.getByRole("button", { name: /opposition/i }).click();
    await page.getByRole("button", { name: /submit/i }).click();

    await expect(patchCalled).toBeTruthy();
  });
});
