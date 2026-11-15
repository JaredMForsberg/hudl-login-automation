import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Hudl authentication testing.
 *
 * Defines cross-browser execution, test reporting, and debugging
 * settings for both local development and CI environments.
 */
export default defineConfig({
  testDir: "./tests",

  // Allow independent tests to execute concurrently.
  fullyParallel: true,

  // Prevent accidentally committed test.only() calls from
  // silently excluding other tests during CI execution.
  forbidOnly: !!process.env.CI,

  // Retry failures in CI to help identify intermittent issues.
  // Keep local runs at zero retries for immediate feedback.
  retries: process.env.CI ? 2 : 0,

  // Limit CI concurrency by default to reduce resource usage.
  // The GitHub Actions workflow currently overrides this to 2.
  workers: process.env.CI ? 1 : undefined,

  // Generate an HTML report for reviewing test results.
  reporter: "html",

  use: {
    // Base URL allows page objects to navigate using relative paths.
    baseURL: "https://www.hudl.com",

    // Collect traces on the first retry and screenshots on failure
    // to help diagnose unsuccessful test executions.
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  // Execute each test against three major browser engines.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
