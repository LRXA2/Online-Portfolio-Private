// Playwright browser_run_code_unsafe filename test; requires localhost:4321.
// Replaces the drilldown/rotation test after the user explicitly removed those behaviors.
async (page) => {
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://localhost:4321/Online-Portfolio-Private/');
  const opener=page.getByRole('button',{name:'Explore anatomy of a forecast',exact:true});
  await opener.focus();await page.keyboard.press('Enter');
  const dialog=page.getByRole('dialog',{name:'Anatomy of a forecast',exact:true});
  const choices=dialog.getByRole('group',{name:'Select a forecast layer'});
  assert(await dialog.isVisible(),'Keyboard activation must open the explorer');
  assert(await dialog.locator('a,nav,details,[data-view],[data-go-pipeline]').count()===0,'The explorer must have no drilldown controls');
  assert(await choices.locator('[aria-pressed="true"]').count()===0,'Opening must show an unfocused overview');
  for(const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:900});
    for(const name of ['Observations','Forecast','Uncertainty']) {
      const button=choices.getByRole('button',{name,exact:true});
      await button.focus();await page.keyboard.press('Enter');
      assert(await button.getAttribute('aria-pressed')==='true',name+' must be selectable');
      assert(await dialog.locator('[data-demo]:visible').count()===1,'Exactly one demonstration must appear');
      assert(await dialog.getByRole('heading',{name,exact:true}).isVisible(),'Selected scene must be labelled');
      assert(await choices.locator('.layer-plane').evaluateAll(xs=>xs.every(x=>{const r=x.getBoundingClientRect();if(!r.width||!r.height)return false;for(let n=x;n;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility!=='visible'||Number(s.opacity)<.99)return false;if(n.tagName==='DIALOG')break;}return true;})),'All planes must remain visible');
    }
    const labels=await choices.locator('.layer-caption').evaluateAll(xs=>xs.map(x=>({top:x.getBoundingClientRect().top,bottom:x.getBoundingClientRect().bottom})).sort((a,b)=>a.top-b.top));
    assert(labels.every((r,i)=>i===0||r.top>=labels[i-1].bottom),'Layer hit areas must not overlap at '+width);
    assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'No horizontal dialog overflow at '+width);
    assert(await dialog.getByRole('button',{name:'Play',exact:true}).isVisible(),'Reduced motion must not autoplay');
  }
  await page.setViewportSize({width:1440,height:1000});
  // Wait for the sticky header's ResizeObserver after changing viewport width.
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  // A real pointer click on a plane must select that layer, not an overlaid button.
  const point=await choices.locator('[data-layer-choice="observations"] svg').evaluate(svg=>{
    const points=svg.querySelector('polygon').points;
    const p=svg.createSVGPoint();p.x=(points.getItem(2).x+points.getItem(3).x)/2;p.y=(points.getItem(2).y+points.getItem(3).y)/2-8;
    const screen=p.matrixTransform(svg.getScreenCTM());return{x:screen.x,y:screen.y};
  });
  await page.mouse.click(point.x,point.y);
  assert(await choices.getByRole('button',{name:'Observations',exact:true}).getAttribute('aria-pressed')==='true','Direct plane click must select observations');
  await page.keyboard.press('Escape');
  assert(await opener.evaluate(el=>el===document.activeElement),'Closing must restore focus');
  await opener.click();
  assert(await choices.locator('[aria-pressed="true"]').count()===0,'Reopening must clear the previous selection');
  assert(await dialog.locator('.layer-demonstration').isHidden(),'Reopening must clear the prior demonstration');
  await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await opener.click();
  await choices.getByRole('button',{name:'Observations',exact:true}).locator('.layer-caption').click();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('[data-reading]')).some(el=>Number(el.style.opacity)>.5),{},{timeout:8000});
  assert(await dialog.locator('[data-reading]').evaluateAll(xs=>xs.some(el=>Number(el.style.opacity)>.5)),'The time series must draw automatically');
  await dialog.getByRole('button',{name:'Pause',exact:true}).click();
  const snapshot=()=>dialog.locator('[data-reading]').evaluateAll(xs=>xs.map(x=>[x.getAttribute('cx'),x.getAttribute('cy'),x.style.opacity]));
  const paused=JSON.stringify(await snapshot());await page.waitForTimeout(350);
  assert(JSON.stringify(await snapshot())===paused,'Pause must freeze the complete visual');
  await dialog.getByRole('button',{name:'Play',exact:true}).click();
  await page.waitForFunction(previous=>JSON.stringify(Array.from(document.querySelectorAll('[data-reading]'),x=>[x.getAttribute('cx'),x.getAttribute('cy'),x.style.opacity]))!==previous,paused,{timeout:8000});
  assert(JSON.stringify(await snapshot())!==paused,'Play must resume the visual');
  await choices.getByRole('button',{name:'Forecast',exact:true}).locator('.layer-caption').click();
  await page.waitForFunction(()=>Number(document.querySelector('[data-loss]').textContent)<.040328,{},{timeout:15000});
  assert(Number(await dialog.locator('[data-loss]').innerText())<.040328,'Training animation must improve the sample prediction');
  await page.keyboard.press('Escape');
  const closedLoss=await page.locator('#forecast-explorer [data-loss]').textContent();await page.waitForTimeout(350);
  assert(await page.locator('#forecast-explorer [data-loss]').textContent()===closedLoss,'Closing must stop the clock');
  assert(await page.evaluate(()=>document.documentElement.style.overflow)!=='hidden','Closing must restore page scrolling');
  return 'PASS: flat overview, persistent layers, real hit targets, keyboard, four widths, reduced motion, Pause/Play, training, and close/reset';
}