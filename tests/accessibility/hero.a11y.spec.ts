import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Hero Accessibility', () => {
  test('hero passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .include('[data-section="hero"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const hero = page.locator('[data-section="hero"]');
    await expect(hero).toBeVisible();

    // Animation should be paused or have near-zero duration
    const animationDuration = await hero.evaluate((el) => {
      return getComputedStyle(el).animationDuration;
    });
    // Accept 0s, 0.01ms, etc. as "reduced"
    const durationMs = parseFloat(animationDuration) || 0;
    expect(durationMs).toBeLessThanOrEqual(0.1);
  });
});
