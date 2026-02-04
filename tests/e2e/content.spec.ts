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

  test('displays projects section with items', async ({ page }) => {
    const projectsSection = page.locator('[data-section="projects"]');
    await expect(projectsSection).toBeVisible();

    const cards = projectsSection.locator('.project-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(6);

    // Each card has GitHub link
    const firstCard = cards.first();
    await expect(firstCard.locator('a[href*="github.com"]')).toBeVisible();
  });

  test('CTA section shows contact options', async ({ page }) => {
    const ctaSection = page.locator('[data-section="cta"]');
    await expect(ctaSection).toBeVisible();

    // Button with "LET'S START"
    const ctaButton = ctaSection.locator('.cta__button');
    await expect(ctaButton).toContainText("LET'S START");

    // Contact links for email, LinkedIn, GitHub
    await expect(ctaSection.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(ctaSection.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(ctaSection.locator('a[href*="github.com"]')).toBeVisible();
  });
});
