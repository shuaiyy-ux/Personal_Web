import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Project Detail Page Accessibility', () => {
  test('speckit detail page passes axe audit', async ({ page }) => {
    await page.goto('/projects/speckit/');
    const results = await new AxeBuilder({ page })
      .include('.project-detail')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
