import { test, testInTournamentAsAdmin } from "./e2eUtils";

test("root should redirect not logged-in users to the login page", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForURL(/login/);
});

testInTournamentAsAdmin(
  "root should redirect logged-in users to tournaments page",
  async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/tournaments/);
  },
);
