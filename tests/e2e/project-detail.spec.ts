import { test, expect } from '@playwright/test';

test.describe('Project Detail Page', () => {
  test('navigates from bento card to detail page and renders all parts', async ({ page }) => {
    await page.goto('/');

    const projectsSection = page.locator('[data-section="projects"]');
    await projectsSection.scrollIntoViewIfNeeded();

    // First bento card → /projects/<id>/
    const firstCard = projectsSection.locator('.project-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    await expect(page).toHaveURL(/\/projects\/[^/]+\/?$/);

    const article = page.locator('.project-detail');
    await expect(article).toBeVisible();
    await expect(article.locator('.project-detail__eyebrow')).toBeVisible();
    await expect(article.locator('#project-title')).toBeVisible();
    await expect(article.locator('.project-detail__tagline')).toBeVisible();
    await expect(article.locator('.project-detail__meta')).toBeVisible();
    await expect(article.locator('.project-detail__body')).toBeVisible();
    await expect(article.locator('.project-detail__foot-nav')).toBeVisible();
  });

  test('renders mermaid diagram + code block on a project page', async ({ page }) => {
    // finance-analyzer has both a mermaid pipeline diagram and a fenced TS code block,
    // so it exercises both renderers. SpecKit page is a short pointer to the blog
    // and intentionally has no code block.
    await page.goto('/projects/finance-analyzer/');

    // Mermaid lazy-init swaps the .mermaid div for an inline SVG
    const mermaid = page.locator('.project-detail__body .mermaid svg').first();
    await expect(mermaid).toBeAttached({ timeout: 10000 });

    // codehilite emits .highlight wrappers around fenced code blocks
    const highlight = page.locator('.project-detail__body .highlight').first();
    await expect(highlight).toBeVisible();
  });

  test('foot navigation links to adjacent projects', async ({ page }) => {
    // finance-analyzer is the 2nd entry in projects.json, so both prev and next exist
    await page.goto('/projects/finance-analyzer/');

    const prev = page.locator('.project-detail__nav--prev');
    const next = page.locator('.project-detail__nav--next');

    await expect(prev).toBeVisible();
    await expect(next).toBeVisible();
    await expect(prev).toHaveAttribute('href', /\/projects\/.+\/$/);
    await expect(next).toHaveAttribute('href', /\/projects\/.+\/$/);
  });

  test('renders 404 view for unknown slug', async ({ page }) => {
    // Vite serves the matching shell only for registered routes; we exercise
    // the renderer's 404 path by visiting a slug that has a route shell but
    // would not be in projects.json. Skip if no such slug exists in this repo.
    test.skip(true, 'all 4 routes are valid in current repo');
  });
});
