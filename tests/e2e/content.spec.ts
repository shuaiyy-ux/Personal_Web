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

  test('displays projects section with all project items', async ({ page }) => {
    const projectsSection = page.locator('[data-section="projects"]');
    await expect(projectsSection).toBeVisible();

    // Heading + count badge
    await expect(projectsSection.locator('#projects-heading')).toBeVisible();
    await expect(projectsSection.locator('.projects__count')).toBeVisible();

    // Scroll into view so reveal animation has fired
    await projectsSection.scrollIntoViewIfNeeded();

    const items = projectsSection.locator('.project-card');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstItem = items.first();
    await expect(firstItem.locator('.project-card__title')).toBeVisible();
    await expect(firstItem.locator('.project-card__tagline')).toBeVisible();
    await expect(firstItem.locator('.project-card__icon svg')).toBeAttached();
    await expect(firstItem).toHaveAttribute('href', /.+/);
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
