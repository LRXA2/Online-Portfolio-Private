/** Illustrative hourly readings, with one missing reading and one value flagged for review. */
export function engineeringExample() {
  const readings: (number|null)[] = [12,14,18,22,29,null,42,46,45,48,82,51,49,47,43,39,34,29,26,22,19,16,14,11];
  const prepared: number[] = [];
  readings.forEach((value,index)=>prepared.push(value ?? prepared[index-1]));
  const rows = readings.flatMap((target,hour)=>hour<3 || target===null ? [] : [{hour,lag:prepared[hour-1],mean:(prepared[hour-3]+prepared[hour-2]+prepared[hour-1])/3,target}]);
  return {readings,prepared,rows,flaggedIndex:10,missingIndex:5};
}
export type EngineeringPhase = 'collect'|'inspect'|'engineer'|'ready'|'restart';
export function engineeringFrame(time: number) {
  const elapsed=Math.max(0,time)%16000;
  const phase=elapsed<3500?'collect':elapsed<7500?'inspect':elapsed<12000?'engineer':elapsed<14800?'ready':'restart';
  const step=Math.min(2,Math.max(0,Math.floor((elapsed-7500)/1500)));
  const rowHour=[3,4,6][step];
  const progress=Math.max(0,Math.min(1,(elapsed-7500-step*1500)/1500));
  const completedRows=elapsed<7500?0:Math.min(3,step+(progress>=.75?1:0));
  return {elapsed,phase:phase as EngineeringPhase,rowHour,sourceHours:[rowHour-3,rowHour-2,rowHour-1],progress,completedRows};
}