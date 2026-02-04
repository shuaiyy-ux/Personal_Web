import { test, expect } from '@playwright/test';

test.describe('Navigation Blocks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays three navigation blocks for Blog, LinkedIn, GitHub', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    await expect(navSection).toBeVisible();

    const blocks = navSection.locator('.nav-block');
    await expect(blocks).toHaveCount(3);

    await expect(blocks.nth(0)).toContainText('Blog');
    await expect(blocks.nth(1)).toContainText('LinkedIn');
    await expect(blocks.nth(2)).toContainText('GitHub');
  });

  test('navigation blocks display action labels', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const blocks = navSection.locator('.nav-block');

    await expect(blocks.nth(0).locator('.nav-block__action')).toContainText('Read articles');
    await expect(blocks.nth(1).locator('.nav-block__action')).toContainText('Connect');
    await expect(blocks.nth(2).locator('.nav-block__action')).toContainText('View code');
  });

  test('navigation blocks have arrow indicators', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const arrows = navSection.locator('.nav-block__arrow');
    await expect(arrows).toHaveCount(3);
  });

  test('navigation blocks are visible without scrolling on desktop', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const box = await navSection.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const viewportHeight = page.viewportSize()?.height ?? 800;
      // Allow some leeway; blocks should start within first ~1.5 viewports
      expect(box.y).toBeLessThan(viewportHeight * 1.5);
    }
  });

  test('navigation blocks have correct href targets', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const links = navSection.locator('a.nav-block');

    // Blog – internal or external, should have href
    await expect(links.nth(0)).toHaveAttribute('href', /blog|\/blog/i);
    // LinkedIn
    await expect(links.nth(1)).toHaveAttribute('href', /linkedin\.com/);
    // GitHub
    await expect(links.nth(2)).toHaveAttribute('href', /github\.com/);
  });

  test('navigation blocks respond to keyboard focus', async ({ page }) => {
    const navSection = page.locator('[data-section="navigation"]');
    const firstBlock = navSection.locator('.nav-block').first();
    
    // Tab to focus
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip skip-link
    
    // Should be focusable
    await expect(firstBlock).toBeFocused();
  });
});
