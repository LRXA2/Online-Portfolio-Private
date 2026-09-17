import { test } from '@playwright/test';

test("forecastInvitation", async ({ page }) => {
  await page.goto('./');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const invitation = page.getByRole('button', { name: 'Explore anatomy of a forecast', exact: true });
  const caption = page.getByText('ANATOMY OF A FORECAST', { exact: true });
  if (await page.getByRole('button', { name: 'Explore the forecast', exact: true }).count()) throw new Error('The separate invitation must be removed');
  if (!await caption.isVisible()) throw new Error('The diagram heading must remain visible');
  const dialog = page.getByRole('dialog', { name: 'Anatomy of a forecast', exact: true });
  const clickDiagram = async () => {
    const box = await page.locator('.forecast-stage').boundingBox();
    if (!box) throw new Error('The forecast diagram must be visible');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  };
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await clickDiagram();
    if (width < 768 && await dialog.isVisible()) throw new Error('Tapping the mobile diagram must not open the explorer');
    if (width < 768) await page.getByText('Explore the diagram', { exact: true }).click();
    if (!await dialog.isVisible()) throw new Error('The active invitation must open the explorer');
    await page.keyboard.press('Escape');
    if (!await invitation.evaluate(el => el === document.activeElement)) throw new Error('Closing must return focus to the invitation');
    for (const key of ['Enter', 'Space']) {
      await invitation.focus();
      await page.keyboard.press(key);
      if (!await dialog.isVisible()) throw new Error(key + ' must open the explorer');
      await page.keyboard.press('Escape');
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await clickDiagram();
  if (!await dialog.isVisible()) throw new Error('The desktop diagram must still open the explorer');
  await page.keyboard.press('Escape');
  return 'Invitation click, Enter, Space, focus return and diagram click passed';
});
