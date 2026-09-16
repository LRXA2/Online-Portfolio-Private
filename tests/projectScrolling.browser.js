import { test } from '@playwright/test';

test("projectScrolling", async ({ page }) => {
  await page.bringToFront();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./projects');
  for (const selector of ['.section-nav a[href="#personal"]', '.project-bookmarks a[href="#reminder-agent"]']) {
    const result = await page.evaluate(async selector => {
      scrollTo({ top: 0, behavior: 'instant' });
      const link = document.querySelector(selector);
      const target = document.getElementById(link.hash.slice(1));
      const end = Math.min(document.documentElement.scrollHeight - innerHeight,
        target.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(target).scrollMarginTop));
      link.click();
      const samples = [];
      const started = performance.now();
      while (performance.now() - started < 900) {
        await new Promise(requestAnimationFrame);
        samples.push(scrollY);
      }
      return { intermediate: samples.some(y => y > 0 && y < end - 2), landed: Math.abs(scrollY - end) < 2, hash: location.hash, expectedHash: link.hash };
    }, selector);
    if (!result.intermediate) throw new Error(`${selector} must animate through intermediate scroll positions`);
    if (!result.landed || result.hash !== result.expectedHash) throw new Error(`${selector} must land at its anchor and update the URL`);
  }
  await page.goto('./experience');
  const experience = await page.evaluate(async () => {
    scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('.section-nav a[href="#nus"]').click();
    const samples = [];
    const started = performance.now();
    while (performance.now() - started < 900) {
      await new Promise(requestAnimationFrame);
      samples.push(scrollY);
    }
    return { animated: samples.some(y => y > 0 && y < scrollY - 2), hash: location.hash };
  });
  if (!experience.animated || experience.hash !== '#nus') throw new Error('Experience navigation must scroll through intermediate positions to its section');
  await page.goto('./projects');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const immediate = await page.evaluate(() => {
    scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('.section-nav a[href="#personal"]').click();
    return scrollY > 0;
  });
  if (!immediate) throw new Error('Reduced motion must navigate immediately');
  return { passed: true };
});
