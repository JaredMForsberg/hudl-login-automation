import { Page, Locator } from "@playwright/test";
/**
 * Page Object Model for Hudl's authentication flow.
 *
 * Encapsulates login page locators and user interactions so that
 * automated tests can focus on expected behavior rather than
 * implementation details.
 *
 * Centralizing these interactions improves maintainability and
 * reduces duplicated code across test scenarios.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly continueButton: Locator;
  readonly passwordToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailField = page.locator('input[type="email"]');
    this.passwordField = page.locator('input[type="password"]');

    this.continueButton = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });
    // Match both accessible button labels because the button changes
    // from "Show password" to "Hide password" when visibility is toggled.
    this.passwordToggle = page.getByRole("button", {
      name: /^(Show|Hide) password$/,
    });
  }

  async navigate() {
    await this.page.goto("/login");
  }
  // Hudl uses a two-step authentication flow: submitting the email
  // advances to the password screen, where Continue is reused.
  async enterEmail(email: string) {
    await this.emailField.fill(email);
    await this.continueButton.click();
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
    await this.continueButton.click();
  }

  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }

  async editEmail() {
    await this.page.getByRole("link", { name: "Edit email address" }).click();
  }

  async forgotPassword() {
    await this.page
      .getByRole("link", { name: "Forgot password?", exact: true })
      .click();
  }
}
