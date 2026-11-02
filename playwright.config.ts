import { defineConfig } from "@playwright/test";

/**
 * Browser tests against the production build: `npm run build` first, then
 * `npm run test:e2e`. Each spec sets its own screen size; see e2e/screens.ts.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: "http://localhost:3210",
    // The service worker would serve cached bundles and defeat page.route.
    serviceWorkers: "block",
  },
  webServer: {
    command: "npx next start -p 3210",
    url: "http://localhost:3210",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
