import { initialWeights, trainStep } from './neuralTraining.ts';
const runs = [initialWeights()];
for (let update = 0; update < 3; update++) runs.push(trainStep(runs[update]));
export type TrainingPhase = 'forward' | 'error' | 'backward' | 'update' | 'hold' | 'restart';
export function trainingFrame(time: number): { phase: TrainingPhase; updates: number; weights: number[]; progress: number } {
  const elapsed = Math.max(0,time) % 16200;
  if (elapsed >= 15000) return {phase:'restart',updates:0,weights:[...runs[0]],progress:(elapsed-15000)/1200};
  if (elapsed >= 13200) return {phase:'hold',updates:3,weights:[...runs[3]],progress:(elapsed-13200)/1800};
  const update = Math.floor(elapsed/4400);
  const phaseIndex = Math.floor((elapsed%4400)/1100);
  const phase = (['forward','error','backward','update'] as const)[phaseIndex];
  const progress = (elapsed%1100)/1100;
  const weights = runs[update].map((weight,index) => phase === 'update' ? weight + (runs[update+1][index]-weight)*progress : weight);
  return {phase,updates:update,weights,progress};
}