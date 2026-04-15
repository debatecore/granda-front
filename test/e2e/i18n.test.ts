import { test as base, expect } from "@playwright/test";
import { TestContainers } from "./e2eUtils";
import { spawn } from "child_process";
import getPort from "get-port";
import kill from "tree-kill";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let serverProcess: any;

type Fixtures = {
  testContainers: TestContainers;
  frontendPort: number;
  frontendSocket: string;
};

const test = base.extend<Fixtures>({
  frontendPort: async ({}, use) => {
    const frontendPort = await getPort();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(frontendPort);
  },
  testContainers: async ({}, use) => {
    const containers = new TestContainers();
    await containers.start();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(containers);
    await containers.stop();
  },
  page: async ({ browser, frontendPort }, use) => {
    const page = await browser.newPage({
      baseURL: `http://localhost:${frontendPort}`,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

test.describe("routing-based i18n on login page", async () => {
  test.beforeEach(async ({ page, testContainers, frontendPort }) => {
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
    await waitForServer(`http://localhost:${frontendPort}/en/login`);
    await page.goto("/en/login");
  });

  async function waitForServer(url: string, timeout = 120000) {
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
    if (serverProcess?.pid) {
      await new Promise((resolve) => {
        kill(serverProcess.pid, "SIGTERM", resolve);
      });
    }
  });

  test("en", async ({ page }) => {
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

  test.only("pl", async ({ page }) => {
    // GIVEN
    await page.goto("/pl/login");

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
