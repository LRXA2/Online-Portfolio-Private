import { test } from '@playwright/test';

test("responsiveNavigation", async ({ page }) => {
  await page.bringToFront();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto('./projects');
  const enlarged = await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await page.locator('[data-project-view="year"]').click();
  const assertAnchorClear = async () => {
    await page.locator('.section-nav a:visible').last().click();
    const result = await page.evaluate(() => ({
      targetTop: document.getElementById(location.hash.slice(1)).getBoundingClientRect().top,
      navigationBottom: document.querySelector('.project-navigation').getBoundingClientRect().bottom,
    }));
    if (result.targetTop < result.navigationBottom - 1)
      throw new Error('Project heading must clear the sticky navigation: ' + JSON.stringify(result));
  };
  await assertAnchorClear();
  await enlarged.evaluate(el => el.remove());
  await page.locator('[data-project-view="category"]').click();
  await assertAnchorClear();
  return { passed: true };
});
