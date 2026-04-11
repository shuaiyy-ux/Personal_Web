import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays brand system with index label, headline, and subheadline', async ({ page }) => {
    const hero = page.locator('[data-section="hero"]');
    await expect(hero).toBeVisible();

    // Index label with brand name and number
    const indexLabel = hero.locator('.hero__index');
    await expect(indexLabel).toContainText('CM Yao');
    await expect(indexLabel).toContainText('001');

    // Brand symbol
    const brandSymbol = hero.locator('.hero__symbol');
    await expect(brandSymbol).toBeVisible();

    // Headline (supports en/zh)
    const headline = hero.locator('h1');
    await expect(headline).toBeVisible();

    // Subheadline
    const subheadline = hero.locator('.hero__subheadline');
    await expect(subheadline).toBeVisible();
  });

  test('displays corner bracket framing', async ({ page }) => {
    const hero = page.locator('[data-section="hero"]');
    const brackets = hero.locator('.hero__bracket');
    await expect(brackets).toHaveCount(4);
  });

  test('displays scroll cue indicator', async ({ page }) => {
    const scrollCue = page.locator('.hero__scroll-cue');
    await expect(scrollCue).toBeVisible();
  });

  test('hero is readable within first viewport (no scroll)', async ({ page }) => {
    const hero = page.locator('[data-section="hero"]');
    const box = await hero.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const viewportHeight = page.viewportSize()?.height ?? 800;
      expect(box.y + box.height).toBeLessThanOrEqual(viewportHeight + 100);
    }
  });
});
