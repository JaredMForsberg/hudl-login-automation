
import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async logout() {
    const navigation = this.page.getByRole('navigation', {
      name: 'Global navigation'
    });

    await navigation.getByText('Jared Forsberg').hover();

    await navigation.getByText('Log Out', {
      exact: true
    }).click();
  }
}
