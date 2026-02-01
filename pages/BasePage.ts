import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // navigation
  async goto(url: string) {
    await this.page.goto(url);
  }

  // waits
  async waitForURL(pattern: string | RegExp) {
    await this.page.waitForURL(pattern);
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load') {
    await this.page.waitForLoadState(state);
  }

  // locator methods
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  getByDataId(dataId: string): Locator {
    return this.page.locator(`[data-id="${dataId}"]`);
  }
}
