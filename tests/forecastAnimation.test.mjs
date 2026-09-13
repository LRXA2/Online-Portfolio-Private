import test from 'node:test';
import assert from 'node:assert/strict';
import { trainingFrame } from '../src/lib/forecastAnimation.ts';
const initial = [.5,.2,.3,.8,0,0,.7,.5,0];
test('training shows forward, error, backward, then a single weight update', () => {
  assert.equal(trainingFrame(0).phase,'forward');
  assert.equal(trainingFrame(1100).phase,'error');
  assert.equal(trainingFrame(2200).phase,'backward');
  assert.equal(trainingFrame(3300).phase,'update');
  assert.equal(trainingFrame(4400).updates,1);
  const expected = [.511928,.207952,.30852,.80568,.01988,.0142,.710792,.5142,.0284];
  trainingFrame(4400).weights.forEach((w,i)=>assert.ok(Math.abs(w-expected[i])<1e-9));
});
test('three updates hold, explicitly restart, and repeat deterministically', () => {
  assert.equal(trainingFrame(13200).phase,'hold');
  assert.equal(trainingFrame(13200).updates,3);
  assert.equal(trainingFrame(15000).phase,'restart');
  assert.deepEqual(trainingFrame(15000).weights,initial);
  assert.deepEqual(trainingFrame(16200),trainingFrame(0));
  assert.deepEqual(trainingFrame(16200+4400),trainingFrame(4400));
});