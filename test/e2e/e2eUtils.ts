import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import {
  GenericContainer,
  Network,
  StartedNetwork,
  StartedTestContainer,
  Wait,
} from "testcontainers";

import { test as base, Page } from "@playwright/test";
import getPort from "get-port";
import kill from "tree-kill";
import { spawn } from "child_process";
import { expect } from "@playwright/test";

const DEFAULT_BACKEND_PORT = 2023;

export const test = base.extend<Fixtures>({
  page: async ({ browser }, use) => {
    const frontendPort = await getPort();
    const containers = new TestContainers();
    await containers.start(frontendPort);
    const backendPort = containers.server?.getMappedPort(DEFAULT_BACKEND_PORT);

    const page = await browser.newPage({
      baseURL: `http://localhost:${frontendPort}`,
    });
    const frontendServer = spawn("npm", ["run", "dev"], {
      env: {
        ...process.env,
        CORS_ORIGIN: `http://localhost:${frontendPort}`,
        BACKEND_URL: `http://localhost:${backendPort}`,
        PORT: frontendPort.toString(),
      },
    });
    await waitForServer(`http://localhost:${frontendPort}/en/login`);

    await page.goto("/en/login");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);

    await containers.stop();
    if (frontendServer.pid) {
      killFrontendServer(frontendServer.pid);
    }
  },
});

export const testInTournamentAsAdmin = base.extend<Fixtures>({
  testContainers: async ({}, fixture) => {
    const containers = new TestContainers();

    // frontendPort needed for backend CORS
    const frontendPort = await getPort();

    await containers.start(frontendPort);

    await fixture(containers);

    await containers.stop();
  },

  backendPort: async ({ testContainers }, fixture) => {
    const backendPort =
      testContainers.server?.getMappedPort(DEFAULT_BACKEND_PORT);

    if (!backendPort) {
      throw new Error("Could not determine backend port");
    }

    await fixture(backendPort);
  },

  page: async ({ browser, backendPort }, fixture) => {
    const frontendPort = await getPort();

    const page = await browser.newPage({
      baseURL: `http://localhost:${frontendPort}`,
    });

    const frontendServer = spawn("npm", ["run", "dev"], {
      env: {
        ...process.env,
        CORS_ORIGIN: `http://localhost:${frontendPort}`,
        BACKEND_URL: `http://localhost:${backendPort}`,
        PORT: frontendPort.toString(),
      },
    });

    await waitForServer(`http://localhost:${frontendPort}/en/login`);

    await logInAsAdmin(page);
    await createTournament(page);

    await fixture(page);

    if (frontendServer.pid) {
      killFrontendServer(frontendServer.pid);
    }
  },
});

export const testInTournamentAsUser = base.extend<Fixtures>({
  page: async ({ browser }, use) => {
    const frontendPort = await getPort();
    const containers = new TestContainers();
    await containers.start(frontendPort);
    const backendPort = containers.server?.getMappedPort(DEFAULT_BACKEND_PORT);

    const page = await browser.newPage({
      baseURL: `http://localhost:${frontendPort}`,
    });
    const frontendServer = spawn("npm", ["run", "dev"], {
      env: {
        ...process.env,
        CORS_ORIGIN: `http://localhost:${frontendPort}`,
        BACKEND_URL: `http://localhost:${backendPort}`,
        PORT: frontendPort.toString(),
      },
    });
    await waitForServer(`http://localhost:${frontendPort}/en/login`);

    await logInAsAdmin(page);
    await createTournament(page);

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

    // Extract tournament id from current URL
    const currentUrl = new URL(page.url());
    const segments = currentUrl.pathname.split("/").filter(Boolean);
    const urlIdIndex = segments.indexOf("t");
    const tournamentId = urlIdIndex >= 0 ? segments[urlIdIndex + 1] : undefined;

    // Create user via backend
    const createUserRes = await page.request.post(
      `http://localhost:${backendPort}/users`,
      {
        data: {
          handle: "user",
          picture_link: null,
          password: "user",
        },
      },
    );

    if (!createUserRes.ok()) {
      console.log(await createUserRes.text());
      throw new Error(`Failed to create user: ${createUserRes.status()}`);
    }

    console.log("Create user response:", await createUserRes.text());

    const createdUser = await createUserRes.json();
    const userId = createdUser?.id ?? createdUser?.user?.id;

    if (!userId) {
      throw new Error("Could not determine created user id");
    }

    if (!tournamentId) {
      throw new Error("Could not determine tournament id from URL");
    }

    // Assign Marshal role to the user for the tournament
    const assignRoleRes = await page.request.post(
      `http://localhost:${backendPort}/users/${userId}/tournaments/${tournamentId}/roles`,
      {
        data: ["Marshal"],
      },
    );

    if (!assignRoleRes.ok) {
      throw new Error(`Failed to assign role: ${assignRoleRes.status}`);
    }

    await page.getByText("admin").click();
    await page.getByText("Log out").click();

    // Log in as the created user
    await page
      .getByRole("textbox", { name: "Your handle (username)" })
      .fill("user");

    await page.getByRole("textbox", { name: "Your password" }).fill("user");
    await page.getByRole("button", { name: "Log in" }).click();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);

    await containers.stop();
    if (frontendServer.pid) {
      killFrontendServer(frontendServer.pid);
    }
  },
});

const logInAsAdmin = async (page: Page) => {
  await page.goto("/en/login");
  await page
    .getByRole("textbox", { name: "Your handle (username)" })
    .fill("admin");

  await page.getByRole("textbox", { name: "Your password" }).fill("admin");
  await page.getByRole("button", { name: "Log in" }).click();
};

const createTournament = async (page: Page) => {
  await page.waitForURL("/en/tournaments");
  await page.getByRole("button", { name: "Create tournament" }).click();

  expect(
    page.getByRole("heading", { name: "Create tournament" }),
  ).toBeVisible();

  const unique = Date.now();
  const fullName = `Tournament ${unique}`;
  const shortName = `T${unique}`;

  await page.getByLabel("Full name").fill(fullName);
  await page.getByLabel("Short name").fill(shortName);
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page.getByText(fullName).click();

  expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
};

export class TestContainers {
  server?: StartedTestContainer;
  db?: StartedPostgreSqlContainer;
  network?: StartedNetwork;

  async start(frontendPort: number) {
    const network = await new Network().start();
    const db = await new PostgreSqlContainer("postgres:17.2")
      .withNetwork(network)
      .withNetworkAliases("postgres")
      .start();
    const connectionString = `postgresql://${db.getUsername()}:${db.getPassword()}@postgres:5432/${db.getDatabase()}`;
    const server = await new GenericContainer("tau:latest")
      .withNetwork(network)
      .withExposedPorts(DEFAULT_BACKEND_PORT)
      .withWaitStrategy(Wait.forHttp("/health", DEFAULT_BACKEND_PORT))
      .withEnvironment({
        DATABASE_URL: connectionString,
        FRONTEND_ORIGIN: `http://localhost:${frontendPort}`,
      })
      .start();
    this.server = server;
    this.db = db;
    this.network = network;
  }

  async stop() {
    await this.db?.stop();
    await this.server?.stop();
    await this.network?.stop();
  }
}

export async function waitForServer(url: string, timeout = 120000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      await fetch(url);
      return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }

  throw new Error("Server did not start in time");
}

export const killFrontendServer = async (pid: number) => {
  await new Promise((resolve) => {
    kill(pid, "SIGTERM", resolve);
  });
};

export type Fixtures = {
  testContainers: TestContainers;
  backendPort: number;
};

export async function planTournament({
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

// users cast votes in an alternating fashion
export async function createUserAndCastVote({
  page,
  backendPort,
  numberOfUsers,
}: {
  page: Page;
  backendPort: number;
  numberOfUsers: string;
}) {
  let currentUrl = new URL(page.url());
  let segments = currentUrl.pathname.split("/").filter(Boolean);
  let urlIdIndex = segments.indexOf("t");
  const tournamentId = urlIdIndex >= 0 ? segments[urlIdIndex + 1] : undefined;

  await page.getByRole("link", { name: "No motion" }).first().click();
  await page.waitForURL(/debates/);

  currentUrl = new URL(page.url());
  segments = currentUrl.pathname.split("/").filter(Boolean);
  urlIdIndex = segments.indexOf("debates");
  const debateId = urlIdIndex >= 0 ? segments[urlIdIndex + 1] : undefined;

  for (let i = 0; i < parseInt(numberOfUsers); i++) {
    const createUserRes = await page.request.post(
      `http://localhost:${backendPort}/users`,
      {
        data: {
          handle: "user" + (i + 1),
          picture_link: null,
          password: "user" + (i + 1),
        },
      },
    );

    if (!createUserRes.ok()) {
      console.log(await createUserRes.text());
      throw new Error(`Failed to create user: ${createUserRes.status()}`);
    }

    console.log("Create user response:", await createUserRes.text());

    const createdUser = await createUserRes.json();
    const userId = createdUser?.id ?? createdUser?.user?.id;

    if (!userId) {
      throw new Error("Could not determine created user id");
    }

    if (!tournamentId) {
      throw new Error("Could not determine tournament id from URL");
    }

    const assignRoleRes = await page.request.post(
      `http://localhost:${backendPort}/users/${userId}/tournaments/${tournamentId}/roles`,
      {
        data: ["Judge"],
      },
    );

    if (!assignRoleRes.ok) {
      throw new Error(`Failed to assign role: ${assignRoleRes.status}`);
    }

    const propositionWon = i % 2 === 0;
    const castVoteRes = await page.request.post(
      `http://localhost:${backendPort}/tournaments/${tournamentId}/debates/${debateId}/verdicts`,
      {
        data: {
          debate_id: debateId,
          judge_user_id: userId,
          proposition_won: propositionWon,
        },
      },
    );

    if (!castVoteRes.ok) {
      throw new Error(`Failed to cast vote: ${castVoteRes.status}`);
    }
  }
}
