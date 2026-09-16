import { test } from '@playwright/test';

test("forecastExplorerScroll", async ({ page }) => {
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto('./');
    await page.getByRole('button',{name:'Explore anatomy of a forecast',exact:true}).click();
    const dialog=page.getByRole('dialog');
    await dialog.getByRole('button',{name:'Observations',exact:true}).locator('.layer-caption').click();
    const state=await dialog.evaluate(el=>{
      const header=el.querySelector('.explorer-header').getBoundingClientRect();
      const diagram=el.querySelector('.layer-diagram').getBoundingClientRect();
      const title=el.querySelector('#demonstration-title');
      return {scroll:el.scrollTop,diagramBottom:diagram.bottom,headerBottom:header.bottom,titleTop:title.getBoundingClientRect().top,titleBottom:title.getBoundingClientRect().bottom,dialogBottom:el.getBoundingClientRect().bottom,focused:title===document.activeElement};
    });
    if(width >= 768) assert(state.scroll>0,'Selecting a layer must scroll to its demonstration');
    if(width >= 768) assert(state.diagramBottom<=state.headerBottom+2,'The layer diagram must scroll out of the way');
    assert(state.titleTop>=state.headerBottom,'The selected heading must not be covered');
    assert(state.titleBottom<=state.dialogBottom,'Selected heading must fit in the dialog');
    assert(state.focused,'Keyboard focus must follow the selected content');
    await dialog.evaluate(el=>el.scrollTop=0);
    await dialog.getByRole('button',{name:'Uncertainty',exact:true}).locator('.layer-caption').click();
    if(width >= 768) assert(await dialog.evaluate(el=>el.scrollTop)>0,'Another layer must also scroll into view');
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Explore anatomy of a forecast',exact:true}).click();
    assert(await dialog.evaluate(el=>el.scrollTop)===0,'Reopening must return to the overview');
    await page.keyboard.press('Escape');
  }
  return 'PASS: selection scrolls content into view, diagram scrolls away, focus follows, reopening resets at desktop/mobile widths';
});
