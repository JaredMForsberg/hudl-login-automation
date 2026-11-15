/**
 * End-to-end tests for Hudl's authentication workflow.
 *
 * Covers login form validation, password visibility, successful
 * and unsuccessful authentication, account recovery navigation,
 * and logout functionality.
 *
 * Tests execute across Chromium, Firefox, and WebKit to verify
 * consistent behavior across browser engines.
 *
 * Authenticated scenarios use HUDL_EMAIL and HUDL_PASSWORD
 * environment variables to keep credentials out of source control.
 */
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Hudl Login", () => {
  test("login page displays email field and Continue button", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await expect(loginPage.emailField).toBeVisible();

    await expect(loginPage.continueButton).toBeVisible();
  });

  test("shows an error when email is empty", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.continueButton.click();

    await expect(
      page.getByText("Please enter your email address"),
    ).toBeVisible();
  });

  test("shows an error for an invalid email format", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.enterEmail("notanemail");

    await expect(page.getByText("Enter a valid email.")).toBeVisible();
  });

  test("valid email advances to password screen", async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Use an existing test account because the password step
    // depends on Hudl recognizing the submitted email address.
    const email = process.env.HUDL_EMAIL;

    if (!email) {
      throw new Error("HUDL_EMAIL environment variable is missing");
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await expect(loginPage.passwordField).toBeVisible();
  });

  test("shows an error when password is empty", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.HUDL_EMAIL;

    if (!email) {
      throw new Error("HUDL_EMAIL environment variable is missing");
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await loginPage.continueButton.click();

    await expect(page.getByText("Please enter your password")).toBeVisible();
  });

  test("password is hidden by default", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.HUDL_EMAIL;

    if (!email) {
      throw new Error("HUDL_EMAIL environment variable is missing");
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await expect(loginPage.passwordField).toHaveAttribute("type", "password");
  });

  test("password visibility can be toggled", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.HUDL_EMAIL;

    if (!email) {
      throw new Error("HUDL_EMAIL environment variable is missing");
    }

    await loginPage.navigate();
    await loginPage.enterEmail(email);

    await loginPage.passwordField.fill("ExamplePassword123!");
    // Verify that revealing the password preserves its value,
    // then confirm the field returns to a masked state.
    await loginPage.togglePasswordVisibility();

    await expect(page.locator('input[type="text"]').last()).toHaveValue(
      "ExamplePassword123!",
    );

    await loginPage.togglePasswordVisibility();

    await expect(loginPage.passwordField).toHaveAttribute("type", "password");
  });

  test("user can successfully log in", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.HUDL_EMAIL;
    const password = process.env.HUDL_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "HUDL_EMAIL or HUDL_PASSWORD environment variable is missing",
      );
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await loginPage.enterPassword(password);
    // Confirm authentication succeeded by checking for content
    // available on the authenticated dashboard.
    await expect(
      page
        .getByRole("navigation", { name: "Global navigation" })
        .locator(".hui-globaluseritem"),
    ).toBeVisible();
  });

  test("shows an error for an incorrect password", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.HUDL_EMAIL;

    if (!email) {
      throw new Error("HUDL_EMAIL environment variable is missing");
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await loginPage.enterPassword("IncorrectTestPassword123!");

    await expect(
      page.getByText("Your email or password is incorrect. Try again."),
    ).toBeVisible();
  });

  test("user can edit their email address", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.HUDL_EMAIL;

    if (!email) {
      throw new Error("HUDL_EMAIL environment variable is missing");
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await loginPage.editEmail();

    await expect(loginPage.emailField).toBeVisible();

    await expect(loginPage.emailField).toBeEmpty();
  });

  test("user can navigate to forgot password", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env.HUDL_EMAIL;

    if (!email) {
      throw new Error("HUDL_EMAIL environment variable is missing");
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await loginPage.forgotPassword();

    await expect(
      page.getByRole("heading", { name: "Reset Password" }),
    ).toBeVisible();

    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(
      email,
    );

    await expect(page.getByText("Go Back")).toBeVisible();
  });

  test("user can log out successfully", async ({ page }) => {
    // Allow additional time for the complete login and logout
    // sequence, which involves multiple page transitions.
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    const email = process.env.HUDL_EMAIL;
    const password = process.env.HUDL_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "HUDL_EMAIL or HUDL_PASSWORD environment variable is missing",
      );
    }

    await loginPage.navigate();

    await loginPage.enterEmail(email);

    await loginPage.enterPassword(password);

    await expect(
      page
        .getByRole("navigation", { name: "Global navigation" })
        .locator(".hui-globaluseritem"),
    ).toBeVisible();

    await dashboardPage.logout();

    await expect(page).toHaveURL("https://www.hudl.com/");

    await expect(
      page.getByText("Log in", { exact: true }).first(),
    ).toBeVisible();
  });
});
