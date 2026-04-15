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

export class TestContainers {
  server?: StartedTestContainer;
  db?: StartedPostgreSqlContainer;
  network?: StartedNetwork;

  async start() {
    const network = await new Network().start();
    const db = await new PostgreSqlContainer("postgres:17.2")
      .withNetwork(network)
      .withNetworkAliases("postgres")
      .start();
    const connectionString = `postgresql://${db.getUsername()}:${db.getPassword()}@postgres:5432/${db.getDatabase()}`;
    const server = await new GenericContainer("tau-server-prod:latest")
      .withNetwork(network)
      .withExposedPorts(2023)
      .withWaitStrategy(Wait.forHttp("/health", 2023))
      .withEnvironment({
        DATABASE_URL: connectionString,
        FRONTEND_ORIGIN: "http://localhost:3000",
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
  frontendPort: number;
  frontendSocket: string;
};
