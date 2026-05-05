import { test, expect, type Page, type Route } from "@playwright/test";

const TEST_USER_ID = "user-123";
const TEST_TOURNAMENT_ID = "tournament-456";
const TEST_DEBATE_ID = "debate-789";

const permissionRoute = `**/users/${TEST_USER_ID}`;
const verdictsRoute = `**/tournaments/${TEST_TOURNAMENT_ID}/debates/${TEST_DEBATE_ID}/verdicts`;

async function mockPermission(page: Page, responseBody: unknown) {
  await page.route(permissionRoute, (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(responseBody),
    });
  });
}

async function mockVerdicts(page: Page, responseBody: unknown) {
  await page.route(verdictsRoute, (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(responseBody),
    });
  });
}

async function visitVerdictPage(page: Page) {
  await page.goto(
    `/en/tournaments/verdict?userId=${TEST_USER_ID}&tournamentId=${TEST_TOURNAMENT_ID}&debateId=${TEST_DEBATE_ID}`
  );
}

test.describe("VerdictPanel", () => {
  test("shows judge controls when permission is truthy", async ({ page }) => {
    await mockPermission(page, { id: TEST_USER_ID });
    await mockVerdicts(page, []);

    await visitVerdictPage(page);

    await expect(page.getByRole("button", { name: "Proposition" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Opposition" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    await expect(page.getByText("There is no verdict yet.")).toBeVisible();
  });

  test("shows viewer-only UI when permission is falsy", async ({ page }) => {
    await mockPermission(page, null);
    await mockVerdicts(page, []);

    await visitVerdictPage(page);

    await expect(page.getByText("Current decision: no verdict")).toBeVisible();
    await expect(page.getByRole("button", { name: "Proposition" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Opposition" })).toHaveCount(0);
  });

  test("displays majority verdict from odd verdict count", async ({ page }) => {
    await mockPermission(page, { id: TEST_USER_ID });
    await mockVerdicts(page, [
      { id: "v1", judge_user_id: "u1", proposition_won: true },
      { id: "v2", judge_user_id: "u2", proposition_won: true },
      { id: "v3", judge_user_id: "u3", proposition_won: false },
    ]);

    await visitVerdictPage(page);

    await expect(page.getByText("The Proposition is the winning team!")).toBeVisible();
  });

  test("sends POST when judge submits a new verdict", async ({ page }) => {
    let postCalled = false;

    await page.route(permissionRoute, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: TEST_USER_ID }),
      });
    });

    await page.route(verdictsRoute, (route) => {
      const request = route.request();
      if (request.method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
        return;
      }

      if (request.method() === "POST") {
        postCalled = true;
        const body = request.postDataJSON();
        expect(body).toEqual({ 
          debate_id: TEST_DEBATE_ID,
          judge_user_id: TEST_USER_ID,
          proposition_won: true 
        });
        route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "new-vote",
            judge_user_id: TEST_USER_ID,
            proposition_won: true,
          }),
        });
        return;
      }

      route.continue();
    });

    await visitVerdictPage(page);

    await page.getByRole("button", { name: "Proposition" }).click();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect.poll(() => postCalled).toBeTruthy();
  });

  test("sends PATCH when judge updates an existing verdict", async ({ page }) => {
    const existingVerdictId = "existing-vote";
    let patchCalled = false;

    await mockPermission(page, { id: TEST_USER_ID });
    await page.route(verdictsRoute, (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: existingVerdictId, judge_user_id: TEST_USER_ID, proposition_won: false },
          ]),
        });
        return;
      }

      route.continue();
    });

    await page.route(`**/tournaments/${TEST_TOURNAMENT_ID}/debates/${TEST_DEBATE_ID}/verdicts/${existingVerdictId}`, (route) => {
      if (route.request().method() === "PATCH") {
        patchCalled = true;
        const body = route.request().postDataJSON();
        expect(body).toEqual({ 
          debate_id: TEST_DEBATE_ID,
          judge_user_id: TEST_USER_ID,
          proposition_won: true 
        });
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: existingVerdictId,
            judge_user_id: TEST_USER_ID,
            proposition_won: true,
          }),
        });
        return;
      }
      route.continue();
    });

    await visitVerdictPage(page);

    await page.getByRole("button", { name: "Proposition" }).click();
    await page.getByRole("button", { name: "Update" }).click();

    await expect.poll(() => patchCalled).toBeTruthy();
  });
});
