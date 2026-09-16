import { test } from '@playwright/test';

test("testimonialChoices", async ({ page }) => {
  await page.bringToFront();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const bar = page.getByRole('slider', { name: 'Scroll testimonial choices' });
  if (!await bar.count() || !await bar.isVisible()) throw new Error('Mobile choices need a separate visible scrollbar');
  const strip = page.locator('.quote-selectors');
  const labels = await strip.boundingBox();
  const control = await bar.boundingBox();
  if (control.y < labels.y + labels.height) throw new Error('Scrollbar must sit below the labels');
  await bar.focus();
  await bar.press('End');
  await page.waitForFunction(() => {
    const el = document.querySelector('.quote-selectors');
    return el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
  });
  if (await strip.locator('button').first().getAttribute('aria-current') !== 'true') throw new Error('Scrolling choices must not change the quote');
  await bar.press('Home');
  await page.waitForFunction(() => document.querySelector('.quote-selectors').scrollLeft <= 1);
  await strip.evaluate(el => { el.scrollLeft = el.scrollWidth; });
  await page.waitForFunction(() => Number(document.querySelector('input[aria-label="Scroll testimonial choices"]').value) >= 99);
  await strip.locator('button').last().click();
  if (await strip.locator('button').last().getAttribute('aria-current') !== 'true') throw new Error('Text choices must still select testimonials');
  await page.setViewportSize({ width: 1440, height: 900 });
  if (await bar.isVisible()) throw new Error('Mobile scrollbar must stay hidden on desktop');
  return { passed: true };
});
