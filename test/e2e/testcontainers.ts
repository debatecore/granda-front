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
