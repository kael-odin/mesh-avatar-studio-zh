import { chromium, test as base, expect } from '@playwright/test';

// The app defaults to Simplified Chinese in this fork; existing specs assert
// English UI text, so pin the language before any page script runs. Specs that
// register their own addInitScript later (e.g. project-errors) override this.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => { localStorage.setItem('mesh-avatar-language', 'en'); });
    await use(page);
  },
});
export { chromium, expect };
export type { Page, BrowserContext } from '@playwright/test';