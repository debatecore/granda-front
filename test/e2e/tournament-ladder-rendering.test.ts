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
    expect(await roundLabel.count()).toBe(7);
  },
);

testInTournamentAsAdmin(
  "round labels show config modal on click",
  async ({ page }) => {
    // GIVEN
    const groupsCount = 5;
    const testMotion1 = "This House Would teach TDD in schools.";
    const testInfoslide1 = `
      Test-driven development (TDD) is a way of writing code
      that involves writing an automated unit-level test case that fails,
      then writing just enough code to make the test pass,
      then refactoring both the test code and the production code,
      then repeating with another new test case. ~Wikipedia`;
    const testMotion2 = "This House regrets the phenomenon of vibe coding";
    const testInfoslide2 = `
      Vibe coding is a software development practice assisted
      by artificial intelligence (AI) where the software developer describes
      a project or task in a prompt to a large language model (LLM),
      which generates source code automatically. Vibe coding may involve accepting
      AI-generated code without thorough review of the output, instead relying on results
      and follow-up prompts to guide changes.
    `;

    await planTournament({
      page,
      groupsCount,
      groupPhaseRounds: 2,
      totalTeams: 22,
      advancingTeams: 8,
    });

    // Opening round config
    await expect(
      page.getByRole("heading", { name: "Tournament Ladder" }),
    ).toBeVisible();
    const configButton = page.getByText("round_1").first();
    await configButton.click();
    const configHeading = page.getByText("Round round_1 configuration");
    await expect(configHeading).toBeVisible();

    // Configuring round
    const motionInput = page.getByRole("textbox", { name: "(Required)" });
    const infoslideInput = page.getByRole("textbox").filter({ hasText: /^$/ });
    const applyButton = page.getByRole("button", { name: "Apply" });
    const successMessage = page.getByText("Applied");

    await motionInput.fill(testMotion1);
    await infoslideInput.fill(testInfoslide1);

    await expect(successMessage).not.toBeVisible();
    await applyButton.click();
    await expect(successMessage).toBeVisible();

    // Closing the config
    await page.reload();

    expect(configHeading).not.toBeVisible();
    expect(
      await page.getByRole("link", { name: "This House Would t…" }).count(),
    ).toBe(5);

    // Reopening the config
    const prefilledMotionInput = page.getByText(testMotion1);
    const prefilledInfoslideInput = page.getByText(testInfoslide1);

    await configButton.click();
    await expect(prefilledMotionInput).toBeVisible();
    await expect(prefilledInfoslideInput).toBeVisible();

    // Changing the config
    await prefilledMotionInput.fill(testMotion2);
    await prefilledInfoslideInput.fill(testInfoslide2);

    await expect(successMessage).not.toBeVisible();
    await applyButton.click();
    await expect(successMessage).toBeVisible();

    // Checking the config
    await page.reload();
    expect(
      await page.getByRole("link", { name: "This House regrets…" }).count(),
    ).toBe(5);
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
