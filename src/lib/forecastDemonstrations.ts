import { inspectNetwork, trainingSample } from './neuralTraining.ts';
import { trainingFrame } from './forecastAnimation.ts';
import { engineeringExample, engineeringFrame } from './observationEngineering.ts';
export const demonstrationLayers = [
  { id: 'observations', label: 'Observations' },
  { id: 'forecast', label: 'Forecast' },
  { id: 'uncertainty', label: 'Uncertainty' },
] as const;
export type DemonstrationLayer = typeof demonstrationLayers[number]['id'];
const clamp = (n: number) => Math.max(0,Math.min(1,n));
const ease = (n: number) => { const p=clamp(n); return p*p*(3-2*p); };
export function createDemonstration(root: HTMLElement, phaseLabel: HTMLElement) {
  const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-demo]'));
  const readings = Array.from(root.querySelectorAll<SVGCircleElement>('[data-reading]')).map(dot=>({dot,x:Number(dot.dataset.x),y:Number(dot.dataset.y)}));
  const example=engineeringExample();
  const chart=root.querySelector<HTMLElement>('[data-eda-chart]')!;
  const scan=root.querySelector<SVGLineElement>('[data-eda-scan]')!;
  const flags=root.querySelector<SVGGElement>('[data-eda-flags]')!;
  const summary=root.querySelector<HTMLElement>('[data-eda-summary]')!;
  const matrix=root.querySelector<HTMLElement>('[data-feature-matrix]')!;
  const featureRows=Array.from(root.querySelectorAll<HTMLElement>('[data-feature-row]'));
  const stages=Array.from(root.querySelectorAll<HTMLElement>('[data-engineering-stage]'));
  const observationView=root.querySelector<HTMLElement>('[data-observation-view]')!;
  const observationLine = root.querySelector<SVGPathElement>('[data-observation-line]')!;
  const trend=root.querySelector<SVGPolylineElement>('[data-trend]')!;
  const window=root.querySelector<SVGRectElement>('[data-feature-window]')!;
  const calculation=root.querySelector<HTMLElement>('[data-feature-calculation]')!;
  const observationCaption = root.querySelector<HTMLElement>('[data-observation-caption]')!;
  const possibilities = Array.from(root.querySelectorAll<SVGPolylineElement>('[data-possibility]'));
  const envelope = root.querySelector<SVGPolygonElement>('[data-envelope]')!;
  const estimate = root.querySelector<SVGPolylineElement>('[data-central-estimate]')!;
  const network = root.querySelector<HTMLElement>('.neural-training')!;
  const nodes = Array.from(network.querySelectorAll<SVGTextElement>('[data-node]'));
  const edgeLabels = Array.from(network.querySelectorAll<SVGTextElement>('[data-edge-value]'));
  const connections = Array.from(network.querySelectorAll<SVGGElement>('[data-connection]')).map(group=>{
    const line=group.querySelector<SVGLineElement>('line')!;
    return {index:Number(group.dataset.connection),line,pulse:group.querySelector<SVGCircleElement>('circle')!,x1:line.x1.baseVal.value,y1:line.y1.baseVal.value,x2:line.x2.baseVal.value,y2:line.y2.baseVal.value};
  });
  const prediction = network.querySelector<HTMLElement>('[data-prediction]')!;
  const predictionBar = network.querySelector<HTMLElement>('[data-prediction-bar]')!;
  const loss = network.querySelector<HTMLElement>('[data-loss]')!;
  const updates = network.querySelector<HTMLElement>('[data-updates]')!;
  let selected: DemonstrationLayer | null = null;
  function setPhase(label: string) { if (phaseLabel.textContent !== label) phaseLabel.textContent=label; }
  function observations(time: number) {
    const frame=engineeringFrame(time);
    const {elapsed:t,phase}=frame;
    const reset=phase==='restart'?1-ease((t-14800)/1200):1;
    const inspecting=ease((t-3500)/600);
    const engineered=ease((t-7500)/500);
    const row=example.rows.find(row=>row.hour===frame.rowHour)!;
    readings.forEach((r,i)=>{
      const missing=example.readings[i]===null;
      r.dot.style.opacity=String((missing?engineered:clamp((t-i*55)/200))*reset);
      r.dot.setAttribute('cx',String(r.x));r.dot.setAttribute('cy',String(r.y));
      const source=engineered>0&&frame.sourceHours.includes(i);
      r.dot.setAttribute('r',source?'10':'6');
      r.dot.style.fill=missing?'#181918':source?'#a9be9b':'';
      r.dot.style.stroke=missing?'#a9be9b':'none';
      r.dot.style.strokeWidth=missing?'3':'0';
    });
    observationLine.style.strokeDasharray='1';
    observationLine.style.strokeDashoffset=String(1-clamp(t/1600));
    observationLine.style.opacity=String(reset*(1-ease((t-1700)/1000)*.55));
    trend.style.strokeDasharray='1';trend.style.strokeDashoffset=String(1-clamp((t-1700)/1300));
    trend.style.opacity=String((1-inspecting*.8)*(1-engineered)*reset);
    scan.setAttribute('x1',String(65+clamp((t-3500)/3500)*770));scan.setAttribute('x2',scan.getAttribute('x1')!);
    scan.style.opacity=phase==='inspect'?'.7':'0';
    flags.style.opacity=String(inspecting*(1-engineered)*reset);
    summary.style.opacity=String(inspecting*(1-engineered)*reset);
    summary.style.visibility=inspecting>0&&engineered<1?'visible':'hidden';
    summary.hidden=engineered>=1;
    chart.style.opacity=String(reset);chart.style.visibility='visible';chart.removeAttribute('aria-hidden');
    window.setAttribute('x',String(65+frame.sourceHours[0]/23*770-20));
    window.style.opacity=String(engineered*reset);
    matrix.style.opacity=String(engineered*reset);
    matrix.style.visibility=engineered>0?'visible':'hidden';
    matrix.setAttribute('aria-hidden',String(engineered<=0));
    const sourceValues=frame.sourceHours.map(hour=>example.prepared[hour]);
    calculation.textContent=`(${sourceValues.join(' + ')}) / 3 ${frame.progress>=.4?'= '+row.mean.toFixed(1):'= …'}`;
    featureRows.forEach((element,i)=>{
      element.style.opacity=i<frame.completedRows?'1':'0';
      element.style.transform='none';
      element.classList.toggle('is-current',Number(element.dataset.featureRow)===frame.rowHour);
    });
    const active=phase==='collect'?0:phase==='inspect'?1:2;
    stages.forEach((stage,i)=>stage.classList.toggle('is-active',i===active));
    observationView.textContent=engineered>0?'3-hour window':phase==='collect'?'Rolling trend':'Data quality';
    observationCaption.textContent=engineered>0?'Past readings → rolling mean':phase==='inspect'?'Gap & unusual value':'Readings → trend';
    const labels={collect:'Reveal the trend',inspect:'Check data quality',engineer:'Build features',ready:'Ready for a model',restart:'Restart'};
    setPhase(labels[phase]);  }  function uncertainty(time: number) {
    const t=time%9200;
    const reset=t>8200 ? 1-ease((t-8200)/1000) : 1;
    const band=ease((t-4800)/1200);
    estimate.style.strokeDasharray='1';estimate.style.strokeDashoffset=String(1-clamp(t/1100));estimate.style.opacity=String(reset);
    possibilities.forEach((curve,i)=>{curve.style.strokeDasharray='1';curve.style.strokeDashoffset=String(1-clamp((t-1100-i*160)/1500));curve.style.opacity=String((.5-band*.38)*reset);});
    envelope.style.opacity=String(band*reset);
    setPhase(t<1100?'Predict':t<4800?'Possible outcomes':t<8200?'A range emerges':'Restart');
  }
  function training(time: number) {
    const frame=trainingFrame(time);
    const state=inspectNetwork(frame.weights);
    network.dataset.phase=frame.phase;
    const values=[...trainingSample.inputs,...state.hidden,state.prediction];
    nodes.forEach(node=>{node.textContent=values[Number(node.dataset.node)].toFixed(3);});
    edgeLabels.forEach(label=>{label.textContent=frame.weights[Number(label.dataset.edgeValue)].toFixed(3);});
    connections.forEach(edge=>{
      edge.line.style.strokeWidth=String(1+Math.abs(frame.weights[edge.index])*3);
      const backward=frame.phase==='backward';
      const tier=backward ? (edge.index<4?1:0) : (edge.index<4?0:1);
      const progress=frame.progress*2-tier;
      const active=(frame.phase==='forward'||backward)&&progress>=0&&progress<=1;
      edge.pulse.style.opacity=active?'1':'0';
      const p=backward?1-clamp(progress):clamp(progress);
      edge.pulse.setAttribute('cx',String(edge.x1+(edge.x2-edge.x1)*p));edge.pulse.setAttribute('cy',String(edge.y1+(edge.y2-edge.y1)*p));
    });
    prediction.textContent=state.prediction.toFixed(3);predictionBar.style.width=`${clamp(state.prediction)*100}%`;
    loss.textContent=state.loss.toFixed(6);updates.textContent=`${frame.updates} / 3`;
    const labels={forward:'Forward pass',error:'Compare with target',backward:'Backpropagation',update:'Adjust weights',hold:'Three updates complete',restart:'New training run'};
    setPhase(labels[frame.phase]);
  }
  const renderers={observations,forecast:training,uncertainty};
  return {
    select(layer: DemonstrationLayer | null) { selected=layer;sections.forEach(section=>{section.hidden=section.dataset.demo!==layer;}); },
    render(time: number) { if(selected)renderers[selected](time); },
  };
}