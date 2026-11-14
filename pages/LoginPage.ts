
import { Page, Locator } from '@playwright/test';

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

    this.continueButton = page.getByRole('button', {
      name: 'Continue',
      exact: true
    });
    this.passwordToggle = page.getByRole('button', {
  name: /^(Show|Hide) password$/
});
  }

  async navigate() {
    await this.page.goto('/login');
  }

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
  await this.page.getByRole('link', {name: 'Edit email address'}).click();
}

async forgotPassword() {
  await this.page.getByRole('link', {name: 'Forgot password?', exact: true}).click();
}
}
