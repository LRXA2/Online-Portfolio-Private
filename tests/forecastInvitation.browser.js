// Run with Playwright browser_run_code_unsafe; requires the local dev server.
async (page) => {
  await page.goto('http://127.0.0.1:4321/Online-Portfolio-Private/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const invitation = page.getByRole('button', { name: 'Explore anatomy of a forecast', exact: true });
  const caption = page.getByText('ANATOMY OF A FORECAST', { exact: true });
  if (await page.getByRole('button', { name: 'Explore the forecast', exact: true }).count()) throw new Error('The separate invitation must be removed');
  if (!await invitation.getByText('ANATOMY OF A FORECAST', { exact: true }).count()) throw new Error('The centered title must be part of the diagram button');
  const dialog = page.getByRole('dialog', { name: 'Anatomy of a forecast', exact: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await caption.click();
    if (!await dialog.isVisible()) throw new Error('Clicking the invitation must open the explorer');
    await page.keyboard.press('Escape');
    if (!await invitation.evaluate(el => el === document.activeElement)) throw new Error('Closing must return focus to the invitation');
    for (const key of ['Enter', 'Space']) {
      await invitation.focus();
      await page.keyboard.press(key);
      if (!await dialog.isVisible()) throw new Error(key + ' must open the explorer');
      await page.keyboard.press('Escape');
    }
  }
  await page.getByRole('button', { name: 'Explore anatomy of a forecast', exact: true }).click();
  if (!await dialog.isVisible()) throw new Error('The diagram must still open the explorer');
  await page.keyboard.press('Escape');
  return 'Invitation click, Enter, Space, focus return and diagram click passed';
}
