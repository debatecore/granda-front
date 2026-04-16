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

import { test as base } from "@playwright/test";
import getPort from "get-port";
import kill from "tree-kill";
import { spawn } from "child_process";

export const test = base.extend<Fixtures>({
  page: async ({ browser }, use) => {
    const frontendPort = await getPort();
    const containers = new TestContainers();
    await containers.start(frontendPort);
    const backendPort = containers.server?.getMappedPort(2023);

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
      .withExposedPorts(2023)
      .withWaitStrategy(Wait.forHttp("/health", 2023))
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
};
