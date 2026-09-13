/** Decorative, deterministic sample series; not measured project results. */
export function forecastLayers(progress: number, yaw = 0) {
  const separation = progress * 54;
  const project = (x: number, y: number, layer: number) => {
    const dx = x - 250;
    const dy = y - 115;
    const rotatedX = 250 + dx * Math.cos(yaw) - dy * Math.sin(yaw);
    const rotatedY = 115 + dx * Math.sin(yaw) + dy * Math.cos(yaw);
    return { x: 62 + rotatedX * .94 + rotatedY * .42, y: 300 - rotatedX * .2 + rotatedY * .59 - layer * 38 + (1 - layer) * separation };
  };
  const mean = (t: number) => 160 - 88 * Math.sin(t * Math.PI) + 12 * Math.sin(t * 13.44);
  const series = Array.from({ length: 97 }, (_, i) => ({ x: 28 + i / 96 * 440, y: mean(i / 96), spread: 12 + i / 96 * 18 }));
  const points = (values: { x: number; y: number }[], layer: number) => values.map(v => {
    const p = project(v.x, v.y, layer);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(' ');
  return [0, 1, 2].map(layer => ({
    plane: points([{x:0,y:0},{x:500,y:0},{x:500,y:230},{x:0,y:230}], layer),
    label: project(12, 22, layer),
    line: points(series, layer),
    band: points([...series.map(v => ({x:v.x,y:v.y-v.spread})), ...series.toReversed().map(v=>({x:v.x,y:v.y+v.spread}))], layer),
    grid: [50,100,150,200].map(y => points([{x:20,y},{x:480,y}],layer)),
    dots: Array.from({length:33},(_,i)=>project(28+i/32*440,mean(i/32)+13*Math.sin(i*2.3)+7*Math.cos(i*.91),layer)),
  }));
}
