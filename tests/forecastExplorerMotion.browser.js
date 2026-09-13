async(page)=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('http://localhost:4321/Online-Portfolio-Private/');
  await page.getByRole('button',{name:'Explore anatomy of a forecast'}).click();
  const dialog=page.getByRole('dialog');
  const animated=await dialog.evaluate(el=>getComputedStyle(el).animationName!=='none');
  if(!animated)throw Error('Opening must animate the enlarged diagram');
  await page.waitForFunction(()=>document.querySelector('#forecast-explorer').getAnimations().every(a=>a.playState==='finished'));
  const before=await dialog.locator('.layer-diagram').boundingBox();
  await dialog.getByRole('button',{name:'Observations',exact:true}).locator('.layer-caption').click();
  const after=await dialog.locator('.layer-diagram').boundingBox();
  if(Math.abs(before.height-after.height)>1)throw Error('Selection must not abruptly shrink the diagram');
  await page.waitForFunction(()=>{const d=document.querySelector('#forecast-explorer');return d.scrollTop>30;});
  await page.keyboard.press('Escape');
  return 'PASS: animated opening, stable diagram size, scrolling selection';
}
