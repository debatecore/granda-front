import { expect } from "@playwright/test";
import { planTournament, testInTournamentAsAdmin } from "./e2eUtils";

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

    const groupRoundLabel = page.getByText(/^Round \d+$/i);
    expect(await groupRoundLabel.count()).toBe(3);
  },
);

testInTournamentAsAdmin(
  "tournament ladder hint explains debate boxes and can be dismissed",
  async ({ page }) => {
    // GIVEN
    await planTournament({
      page,
      groupPhaseRounds: 3,
      groupsCount: 5,
      totalTeams: 30,
      advancingTeams: 16,
    });

    await expect(
      page.getByRole("heading", { name: "Tournament Ladder" }),
    ).toBeVisible();

    const hintButton = page.getByRole("button", {
      name: "Tournament Ladder",
    });

    await expect(hintButton).toBeVisible();

    // WHEN
    await hintButton.click();

    // THEN
    await expect(page.getByText("Each box represents a debate.")).toBeVisible();
    await expect(
      page.getByText("You can click on a specific box"),
    ).toBeVisible();
    await expect(
      page.getByText("The ladder visualizes the flow of the tournament"),
    ).toBeVisible();

    // WHEN
    await page.getByText("OK").click();

    // THEN
    await expect(
      page.getByText("Each box represents a debate."),
    ).not.toBeVisible();
  },
);

testInTournamentAsAdmin(
  "round labels can be used to open round configs",
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

    await expect(
      page.getByRole("heading", { name: "Tournament Ladder" }),
    ).toBeVisible();

    const configButton = page.getByText("Round 1");
    const configHeading = page.getByText("Round 1 configuration");

    await configButton.click();
    await expect(configHeading).toBeVisible();

    const motionInput = page.getByRole("textbox", { name: "(Required)" });
    const infoslideInput = page.getByRole("textbox").filter({ hasText: /^$/ });
    const applyButton = page.getByRole("button", { name: "Apply" });
    const successMessage = page.getByText("Applied");

    await motionInput.fill(testMotion1);
    await infoslideInput.fill(testInfoslide1);

    await expect(successMessage).not.toBeVisible();
    await applyButton.click();
    await expect(successMessage).toBeVisible();

    // Closing the config – it can be exited by clicking on the black backdrop,
    // but it's difficult to simulate in a test.
    await page.reload();
    await expect(configHeading).not.toBeVisible();

    const debateNodesDisplayingMotion = page.getByRole("link", {
      name: "This House Would t…",
    });
    expect(await debateNodesDisplayingMotion.count()).toBe(5);

    const prefilledMotionInput = page.getByText(testMotion1);
    const prefilledInfoslideInput = page.getByText(testInfoslide1);

    await configButton.click();
    await expect(prefilledMotionInput).toBeVisible();
    await expect(prefilledInfoslideInput).toBeVisible();

    await prefilledMotionInput.fill(testMotion2);
    await prefilledInfoslideInput.fill(testInfoslide2);

    await expect(successMessage).not.toBeVisible();
    await applyButton.click();
    await expect(successMessage).toBeVisible();

    await page.reload();

    const updatedDebateNodes = page.getByRole("link", {
      name: "This House regrets…",
    });
    expect(await updatedDebateNodes.count()).toBe(5);
  },
);

testInTournamentAsAdmin(
  "tournament planning form should contain informative placeholders",
  async ({ page }) => {
    // GIVEN
    await page.getByRole("link", { name: "Tournament Ladder" }).first().click();
    await page.waitForURL(/ladder/);

    // WHEN
    const advancingTeamsInput = page.getByPlaceholder("2, 4, 8, 16…");
    const otherInputs = page.getByPlaceholder("0");

    // THEN
    await expect(advancingTeamsInput).toBeVisible();
    expect(await otherInputs.count()).toBe(3);
  },
);

testInTournamentAsAdmin(
  "tournament planning form should contain clickable hint icons",
  async ({ page }) => {
    // GIVEN
    await page.getByRole("link", { name: "Tournament Ladder" }).first().click();
    await page.waitForURL(/ladder/);

    // WHEN
    const hintSelector = page.getByLabel(/^Hint/);
    const group_rounds_selector = page.getByText(
      "Determines how many debate rounds will occurr one after another in the group phase.",
    );
    const group_count_selector = page.getByText(
      "Within a group, one debate is held in each round. This number will determine how many simultaneous debates will take place in each round. Must be lower than the total team count.",
    );
    const total_teams_selector = page.getByText(
      "The total number of teams taking part in the tournament.",
    );
    const advancing_teams_selector = page.getByText(
      "Defines how many teams advance from the group phase to the finals phase. Must be a power of 2.",
    );

    // THEN
    expect(await hintSelector.count()).toBe(4);
    await hintSelector.nth(0).click();
    await expect(group_rounds_selector).toBeVisible();

    await hintSelector.nth(1).click();
    await expect(group_rounds_selector).not.toBeVisible();
    await expect(group_count_selector).toBeVisible();

    await hintSelector.nth(2).click();
    await expect(group_count_selector).not.toBeVisible();
    await expect(total_teams_selector).toBeVisible();

    await hintSelector.nth(3).click();
    await expect(total_teams_selector).not.toBeVisible();
    await expect(advancing_teams_selector).toBeVisible();
  },
);

testInTournamentAsAdmin(
  "advancing teams input should increment by 2",
  async ({ page }) => {
    // GIVEN
    await page.getByRole("link", { name: "Tournament Ladder" }).first().click();
    await page.waitForURL(/ladder/);
    const advancingTeamsInput = page.getByPlaceholder("2, 4, 8, 16…");

    // WHEN
    await advancingTeamsInput.press("ArrowUp");

    // THEN
    await expect(advancingTeamsInput).toHaveValue("2");
  },
);

testInTournamentAsAdmin(
  "Round config can be closed by pressing the close button",
  async ({ page }) => {
    // GIVEN
    const groupsCount = 5;

    await planTournament({
      page,
      groupsCount,
      groupPhaseRounds: 2,
      totalTeams: 22,
      advancingTeams: 8,
    });

    await expect(
      page.getByRole("heading", { name: "Tournament Ladder" }),
    ).toBeVisible();

    const configButton = page.getByText("Round 1");
    const configHeading = page.getByText("Round 1 configuration");

    await configButton.click();
    await expect(configHeading).toBeVisible();

    await page
      .getByRole("button", { name: "Close round configuration" })
      .click();
    await expect(configHeading).not.toBeVisible();
  },
);
