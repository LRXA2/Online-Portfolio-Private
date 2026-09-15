// Run with browser_run_code's filename argument against the local Astro server.
async (page) => {
  await page.bringToFront();
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:4321/Online-Portfolio-Private/');
    const result = await page.locator('.navbar-menu').evaluate(menu => {
      menu.scrollTop = 100;
      const bounds = menu.getBoundingClientRect();
      return {
        scrollTop: menu.scrollTop,
        contentFits: menu.scrollHeight <= menu.clientHeight,
        linksFit: Array.from(menu.querySelectorAll('a')).every(link => {
          const rect = link.getBoundingClientRect();
          return rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1;
        }),
      };
    });
    if (result.scrollTop !== 0 || !result.contentFits || !result.linksFit)
      throw new Error('Navbar must fit its links without vertical scrolling at ' + width + ': ' + JSON.stringify(result));
  }
  return { passed: true };
}
