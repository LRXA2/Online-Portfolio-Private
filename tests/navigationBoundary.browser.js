import { test, expect } from '@playwright/test';

test('active section follows the complete mobile sticky bar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./projects');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await page.getByRole('button', { name: 'Year', exact: true }).click();
  await page.evaluate(() => {
    const bar = document.querySelector('.project-navigation');
    const target = document.getElementById('year-2025');
    // Put the heading just beneath the complete sticky bar.
    const top = parseFloat(getComputedStyle(bar).top) + bar.getBoundingClientRect().height;
    scrollTo({ top: target.getBoundingClientRect().top + scrollY - top - 1, behavior: 'instant' });
  });
  await expect(page.locator('.section-nav a[aria-current]')).toHaveText('2025');
});

test('changing project grouping cancels an in-progress section scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./projects');
  const movement = await page.evaluate(async () => {
    document.querySelector('.section-nav a[href="#personal"]').click();
    // Allow the scroll to start before changing the layout.
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    document.querySelector('[data-project-view="year"]').click();
    // Allow immediate layout/scroll anchoring to settle.
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const stoppedAt = scrollY;
    await new Promise(resolve => setTimeout(resolve, 700));
    return Math.abs(scrollY - stoppedAt);
  });
  expect(movement).toBeLessThan(2);
});
