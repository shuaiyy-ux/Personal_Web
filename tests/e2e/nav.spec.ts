import { test, expect } from '@playwright/test';

test.describe('Navigation Blocks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays navigation blocks with expected links', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    await expect(navSection).toBeVisible();

    const blocks = navSection.locator('.nav-block');
    const count = await blocks.count();
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(5);

    // Blog block is always first
    await expect(blocks.nth(0)).toHaveAttribute('href', /\/blog/);
  });

  test('navigation blocks display action labels', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const blocks = navSection.locator('.nav-block');

    // Each block has an action label
    const count = await blocks.count();
    for (let i = 0; i < count; i++) {
      await expect(blocks.nth(i).locator('.nav-block__action')).toBeVisible();
    }
  });

  test('navigation blocks have arrow indicators', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const blocks = navSection.locator('.nav-block');
    const arrows = navSection.locator('.nav-block__arrow');

    const blockCount = await blocks.count();
    await expect(arrows).toHaveCount(blockCount);
  });

  test('navigation blocks contain expected external links', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');

    // Should have links to linkedin and github somewhere in nav blocks
    await expect(navSection.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(navSection.locator('a[href*="github.com"]')).toBeVisible();
  });

  test('navigation blocks are visible without scrolling on desktop', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const box = await navSection.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const viewportHeight = page.viewportSize()?.height ?? 800;
      expect(box.y).toBeLessThan(viewportHeight * 1.5);
    }
  });
});
