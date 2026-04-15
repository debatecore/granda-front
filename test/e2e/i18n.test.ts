import { test as base, expect } from "@playwright/test";
import { TestContainers } from "./testcontainers";
import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let serverProcess: any;

type Fixtures = {
  testContainers: TestContainers;
  frontendPort: number;
  frontendSocket: string;
};

const test = base.extend<Fixtures>({
  frontendPort: async ({}, use) => {
    const frontendPort = 3001;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(frontendPort);
  },
  frontendSocket: async ({ frontendPort }, use) => {
    const baseURL = `http://localhost:${frontendPort}`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(baseURL);
  },
  testContainers: async ({}, use) => {
    const containers = new TestContainers();
    await containers.start();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(containers);
    await containers.stop();
  },
});

test.describe("routing-based i18n on login page", async () => {
  test.beforeEach(
    async ({ page, testContainers, frontendPort, frontendSocket }) => {
      const port = testContainers.server?.getMappedPort(2023);
      process.env.SERVER_URL = `http://localhost:${port}`;
      console.log(`port set outside: ${process.env.SERVER_URL}`);
      serverProcess = spawn("npm", ["run", "dev"], {
        env: {
          ...process.env,
          SERVER_URL: `http://localhost:${port}`,
          PORT: frontendPort.toString(),
        },
        stdio: "inherit",
      });
      await waitForServer(`${frontendSocket}/en/login`);
      await page.goto(`${frontendSocket}/en/login`);
    },
  );

  async function waitForServer(url: string, timeout = 10000) {
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

  test.afterEach(async () => {
    await serverProcess.kill();
  });

  test("en", async ({ page, frontendPort }) => {
    // GIVEN
    await page.goto("/en/login");

    // WHEN
    const handleLabel = page.getByText("Handle");
    const passwordLabel = page.getByText("Password");
    const loginButton = page.getByRole("button", { name: "Log in" });

    // THEN
    await expect(handleLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test.only("pl", async ({ page, testContainers, frontendSocket }) => {
    // GIVEN
    await page.goto(`${frontendSocket}/pl/login`);

    // WHEN
    const handleLabel = page.getByText("Nick");
    const passwordLabel = page.getByText("Hasło");
    const loginButton = page.getByRole("button", { name: "Zaloguj się" });

    // THEN
    await expect(handleLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});
