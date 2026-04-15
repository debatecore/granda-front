import { expect, test as base } from "@playwright/test";
import {
  Fixtures,
  getFixturedTest,
  killFrontendServer,
  TestContainers,
  waitForServer,
} from "./e2eUtils";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import getPort from "get-port";

let frontendServer: ChildProcessWithoutNullStreams;

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
    const backendPort = testContainers.server?.getMappedPort(2023);
    frontendServer = spawn("npm", ["run", "dev"], {
      env: {
        ...process.env,
        SERVER_URL: `http://localhost:${backendPort}`,
        PORT: frontendPort.toString(),
      },
    });
    await waitForServer(`http://localhost:${frontendPort}/en/login`);
    await page.goto("/en/login");
  });

  test.afterEach(async () => {
    if (frontendServer.pid) {
      killFrontendServer(frontendServer.pid);
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
