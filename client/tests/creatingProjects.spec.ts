import { test, expect } from '@playwright/test';

test('When i create a valid project the window closes', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'Add Project' }).click();
  await page.locator('input[name="name"]').fill('Test project');
  await page.locator('select[name="customer"]').selectOption('3');
  await page.locator('textarea[name="description"]').fill('test');
  await page.getByRole('button', { name: 'Register time' }).click();

  // window should close when item is created correctly 
  await expect(await page.getByRole('heading', { name: 'Add time' })).toBeHidden();
});

test('When no name is provided for the project an error is shown', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'Add Project' }).click();
  await page.getByRole('button', { name: 'Register time' }).click();

  await expect(await page.getByText('This name is required')).toBeVisible();
});