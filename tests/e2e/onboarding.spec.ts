import { test, expect } from '@playwright/test';

test('permite completar onboarding demo', async ({ page }) => {
  await page.goto('/onboarding');
  await page.fill('input[name="age"]', '30');
  await page.fill('input[name="heightCm"]', '178');
  await page.fill('input[name="weightKg"]', '78');
  await page.click('button:has-text("Guardar y continuar")');
  await expect(page).toHaveURL(/dashboard/);
});
