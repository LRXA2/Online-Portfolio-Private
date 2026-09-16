import { test } from '@playwright/test';

test("mobileForecast", async ({ page }) => {
  await page.bringToFront();
  const renderingChanges = () => page.locator('.forecast-demonstrations').evaluate(async root => {
    // Let responsive media-query handlers finish before measuring steady rendering.
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    let changes = 0;
    const observer = new MutationObserver(records => { changes += records.length; });
    observer.observe(root, { attributes: true, childList: true, characterData: true, subtree: true });
    for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
    observer.disconnect();
    return changes;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  await page.locator('[data-open-forecast]').click();
  for (const layer of ['observations', 'forecast', 'uncertainty']) {
    await page.locator(`[data-layer-choice="${layer}"] .layer-caption`).click();
    const summary = page.locator(`[data-mobile-layer="${layer}"]`);
    if (!await summary.isVisible()) throw new Error(`${layer}: mobile must show a static explanation`);
    if (await page.locator('.animation-toggle').isVisible()) throw new Error('Mobile must not offer hidden desktop animation controls');
    if (await page.locator('.forecast-demonstrations').isVisible()) throw new Error('Mobile must replace the detailed animation');
  }
  if (await renderingChanges() !== 0) throw new Error('Mobile must stop the detailed animation renderer');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('[data-layer-choice="forecast"] .layer-caption').click();
  if (!await page.locator('.forecast-demonstrations').isVisible()) throw new Error('Desktop must retain the detailed animation');
  if (await page.locator('.animation-toggle').textContent() !== 'Pause') throw new Error('Desktop must retain autoplay');
  if (await renderingChanges() === 0) throw new Error('Desktop must actually animate');
  await page.setViewportSize({ width: 390, height: 844 });
  if (!await page.locator('[data-mobile-layer="forecast"]').isVisible()) throw new Error('Resizing back to mobile must restore the static explanation');
  if (await renderingChanges() !== 0) throw new Error('Resizing to mobile must stop rendering');
  await page.getByRole('button', { name: 'Close forecast explorer' }).click();
  if (!await page.locator('[data-open-forecast]').evaluate(el => el === document.activeElement)) throw new Error('Closing must return focus to the opener');
  return { passed: true };
});
