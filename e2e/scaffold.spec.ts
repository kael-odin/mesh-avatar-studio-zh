import { expect, test } from './test-base';
test('opens the app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mesh Avatar Studio' })).toBeVisible();
});
