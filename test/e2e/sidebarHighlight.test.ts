import { expect } from "@playwright/test";
import { testInTournamentAsAdmin } from "./e2eUtils";

testInTournamentAsAdmin(
  "sidebar highlights the current page",
  async ({ page }) => {
    // GIVEN
    const overviewSidebarItem = page.getByRole("link", { name: "Overview" });
    const tournamentSidebarItem = page
      .getByRole("link", { name: "Tournament Ladder" })
      .first();
    const debatesSidebarItem = page.getByRole("link", { name: "Debates" });

    await expect(overviewSidebarItem).toHaveClass(/border-stone-600/);
    await expect(tournamentSidebarItem).not.toHaveClass(/border-stone-600/);
    await expect(debatesSidebarItem).not.toHaveClass(/border-stone-600/);

    // WHEN
    await tournamentSidebarItem.click();

    // THEN
    await page.waitForURL(/\/en\/t\/[^/]+\/ladder$/);
    await expect(overviewSidebarItem).not.toHaveClass(/border-stone-600/);
    await expect(tournamentSidebarItem).toHaveClass(/border-stone-600/);
    await expect(debatesSidebarItem).not.toHaveClass(/border-stone-600/);
  },
);
