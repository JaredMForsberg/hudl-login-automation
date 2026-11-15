import { Page } from "@playwright/test";
/**
 * Page Object Model for Hudl's authenticated dashboard.
 *
 * Encapsulates interactions available after a successful login,
 * keeping authenticated page behavior separate from the login flow.
 *
 * Currently provides logout functionality used to verify that
 * users can successfully end their authenticated session.
 */
export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async logout() {
    const navigation = this.page.getByRole("navigation", {
      name: "Global navigation",
    });

    // Target the account menu container instead of a specific user's name.
    // This allows the logout interaction to work across different accounts.
    const accountMenu = navigation.locator(".hui-globaluseritem");

    // Hover over the account menu to reveal the logout option.
    await accountMenu.hover();

    await navigation.getByText("Log Out", { exact: true }).click();
  }
}
