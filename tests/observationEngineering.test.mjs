import test from 'node:test';
import assert from 'node:assert/strict';
import { engineeringExample, engineeringFrame } from '../src/lib/observationEngineering.ts';
test('lag and rolling mean use past readings, with forward filling for the missing input',()=>{
  const sample=engineeringExample();
  assert.equal(sample.readings[5],null);
  assert.equal(sample.prepared[5],29);
  assert.deepEqual(sample.rows.find(row=>row.hour===4),{hour:4,lag:22,mean:18,target:29});
  assert.deepEqual(sample.rows.find(row=>row.hour===6),{hour:6,lag:29,mean:80/3,target:42});
  assert.equal(sample.prepared[10],82,'An unusual reading is retained for review, not silently removed');
  assert.ok(!sample.rows.some(row=>row.hour===5),'A missing target must not become fabricated training ground truth');
});
test('engineering window advances through earlier readings before revealing each feature row',()=>{
  const first=engineeringFrame(7600);
  assert.deepEqual(first.sourceHours,[0,1,2]);
  assert.equal(first.rowHour,3);
  assert.equal(first.completedRows,0);
  assert.equal(engineeringFrame(8800).completedRows,1);
  assert.deepEqual(engineeringFrame(9200).sourceHours,[1,2,3]);
  assert.deepEqual(engineeringFrame(10700).sourceHours,[3,4,5]);
  assert.equal(engineeringFrame(13000).completedRows,3);
  assert.equal(engineeringFrame(16000).completedRows,0);
});
