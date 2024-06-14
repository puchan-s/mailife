// example.test.js
import { test, expect } from '@playwright/test';

test('Google Homepage', async ({ page }) => {
  await page.goto('http://localhost:3000/SpendingList');
  //await expect(page).toHaveTitle('Google');
  await page.screenshot({ path: 'screenshot/google-homepage.png' });
});
    