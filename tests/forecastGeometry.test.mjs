import test from 'node:test';
import assert from 'node:assert/strict';
import { forecastLayers } from '../src/lib/forecastGeometry.ts';

test('forecast separates around a stationary middle plane', () => {
  for (const yaw of [-.1, 0, .1]) {
    const resting = forecastLayers(0, yaw);
    for (const progress of [.25, .5, 1]) {
      const expanded = forecastLayers(progress, yaw);
      assert.deepEqual(expanded[1], resting[1], 'middle plane stays in place');
      const down = expanded[0].label.y - resting[0].label.y;
      const up = resting[2].label.y - expanded[2].label.y;
      assert.ok(down > 0, 'bottom plane moves down');
      assert.ok(up > 0, 'top plane moves up');
      assert.ok(Math.abs(down - up) < 1e-9, 'outer planes move equally');
    }
  }
});
