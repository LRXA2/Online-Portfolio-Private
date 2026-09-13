import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectNetwork } from '../src/lib/neuralTraining.ts';
const weights = [.5, .2, .3, .8, 0, 0, .7, .5, 0];
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
test('forward pass matches a hand-calculated two-neuron example', () => {
  // x=(.6,.4); h1=.6*.5+.4*.2=.38; h2=.6*.3+.4*.8=.50.
  // y=.38*.7+.50*.5=.516; L=.5*(.516-.8)^2=.040328.
  const state = inspectNetwork(weights);
  near(state.hidden[0], .38);
  near(state.hidden[1], .5);
  near(state.prediction, .516);
  near(state.loss, .040328);
});
test('backpropagation matches the chain rule and finite differences', () => {
  const state = inspectNetwork(weights);
  const expected = [-.11928, -.07952, -.0852, -.0568, -.1988, -.142, -.10792, -.142, -.284];
  expected.forEach((value, index) => {
    near(state.gradients[index], value);
    const plus = [...weights], minus = [...weights];
    plus[index] += 1e-5; minus[index] -= 1e-5;
    const numerical = (inspectNetwork(plus).loss - inspectNetwork(minus).loss) / 2e-5;
    near(state.gradients[index], numerical);
  });
});

test('one gradient step updates weights and reduces this sample loss without mutation', async () => {
  const { trainStep } = await import('../src/lib/neuralTraining.ts');
  const original = [...weights];
  const updated = trainStep(weights);
  const expected = [.511928, .207952, .30852, .80568, .01988, .0142, .710792, .5142, .0284];
  expected.forEach((value, i) => near(updated[i], value));
  assert.deepEqual(weights, original);
  assert.ok(inspectNetwork(updated).loss < .040328);
});
