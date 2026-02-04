import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Navigation Accessibility', () => {
  test('navigation section passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .include('[data-section="navigation"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('navigation blocks are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const firstBlock = page.locator('.nav-block').first();

    // Tab to first nav block
    await page.keyboard.press('Tab'); // Skip to main link
    await page.keyboard.press('Tab'); // First nav block

    await expect(firstBlock).toBeFocused();
  });

  test('focus states are visible', async ({ page }) => {
    await page.goto('/');
    const firstBlock = page.locator('.nav-block').first();

    await firstBlock.focus();

    // Check that outline or visible focus indicator is present
    const outlineWidth = await firstBlock.evaluate((el) => {
      const styles = getComputedStyle(el);
      return parseFloat(styles.outlineWidth) || 0;
    });

    expect(outlineWidth).toBeGreaterThan(0);
  });
});
