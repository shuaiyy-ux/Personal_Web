import { test, expect } from '@playwright/test';

test.describe('Content Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays latest writing section with items', async ({ page }) => {
    const writingSection = page.locator('[data-section="writing"]');
    await expect(writingSection).toBeVisible();

    const items = writingSection.locator('.writing-item');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(9);

    // First item has title, summary, tags, date
    const firstItem = items.first();
    await expect(firstItem.locator('.writing-item__title')).toBeVisible();
    await expect(firstItem.locator('.writing-item__summary')).toBeVisible();
  });

  test('CTA section shows contact options', async ({ page }) => {
    const ctaSection = page.locator('[data-section="cta"]');
    await expect(ctaSection).toBeVisible();

    // CTA button exists and links to email
    const ctaButton = ctaSection.locator('.cta__button');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', /^mailto:/);

    // Contact links for LinkedIn and GitHub
    await expect(ctaSection.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(ctaSection.locator('a[href*="github.com"]')).toBeVisible();
  });
});
