/** Fixed, illustrative 2 -> 2 ReLU -> 1 linear network, trained on one sample. */
export const trainingSample = { inputs: [.6, .4] as const, target: .8 };
export function initialWeights(): number[] { return [.5, .2, .3, .8, 0, 0, .7, .5, 0]; }
export function inspectNetwork(weights: readonly number[]) {
  const [x1, x2] = trainingSample.inputs;
  const hidden = [Math.max(0, x1 * weights[0] + x2 * weights[1] + weights[4]), Math.max(0, x1 * weights[2] + x2 * weights[3] + weights[5])];
  const prediction = hidden[0] * weights[6] + hidden[1] * weights[7] + weights[8];
  const error = prediction - trainingSample.target;
  const hiddenGradient = hidden.map((value, index) => value > 0 ? error * weights[6 + index] : 0);
  const gradients = [hiddenGradient[0] * x1, hiddenGradient[0] * x2, hiddenGradient[1] * x1, hiddenGradient[1] * x2, ...hiddenGradient, error * hidden[0], error * hidden[1], error];
  return { hidden, prediction, error, loss: .5 * error * error, gradients };
}
export function trainStep(weights: readonly number[], rate = .1): number[] {
  const { gradients } = inspectNetwork(weights);
  return weights.map((weight, index) => weight - rate * gradients[index]);
}
