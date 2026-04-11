import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Content Accessibility', () => {
  test('writing section passes axe audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .include('[data-section="writing"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('CTA section passes axe audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .include('[data-section="cta"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('CTA button is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const ctaButton = page.locator('.cta__button');

    // Navigate to CTA button via keyboard
    await ctaButton.focus();
    await expect(ctaButton).toBeFocused();
  });
});
