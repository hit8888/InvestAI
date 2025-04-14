import { defineConfig, devices } from "@playwright/test";
import os from "os";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testMatch: "*.spec.ts",
  timeout: 60000,
  expect: {
    timeout: 30000,
  },
  fullyParallel: true,
  retries: 1,
  workers: Math.max(os.cpus().length - 1, 1),
  reporter: [
    ["html"], // Generates a nice HTML report
    ["list"], // Shows progress in console
  ],
  use: {
    actionTimeout: 30000,
    navigationTimeout: 30000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
