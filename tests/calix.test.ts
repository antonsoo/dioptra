import assert from "node:assert/strict";
import test from "node:test";
import { CALIX_INITIAL, calixCSV, calixModel, calixQuery, readCalix } from "../src/calix-model";

test("diameter, summed opening and head lead to different comparisons", () => {
  const model = (quarters: number, count: number, head: number, duration = 1) =>
    calixModel({ quarters, count, head, duration });
  assert.deepEqual(model(10, 1, 16).diameter, [5, 2]);
  assert.deepEqual(model(10, 1, 16).areaRatio, [4, 1]);
  assert.equal(model(10, 1, 16).flowRatio, 4);
  assert.equal(model(5, 4, 16).flowRatio, 4);
  assert.equal(model(10, 1, 1).flowRatio, 1);
  assert.equal(model(5, 1, 64).flowRatio, 2);
  assert.equal(model(6, 1, 16).openingRatio, 1.44);
  assert.deepEqual(model(6, 1, 16).flowSquared, [1296, 625]);
  assert.equal(model(10, 1, 1, 4).comparisonVolume, 4);
  assert.equal(model(10, 1, 1, 4).referenceVolume, 4);
});

test("relative deliveries agree with separately computed circular areas and energy speeds", () => {
  let count = 0;
  // Use actual circle areas and a chosen common g and coefficient instead of
  // repeating the production ratio formula. Absolute units cancel.
  for (let quarters = 5; quarters <= 10; quarters++)
    for (let outlets = 1; outlets <= 4; outlets++)
      for (let head = 1; head <= 64; head++)
        for (let duration = 1; duration <= 4; duration++) {
          const g = 9.81,
            coefficient = 0.63,
            baseRadius = 5 / 8,
            radius = quarters / 8;
          const reference = coefficient * Math.PI * baseRadius ** 2 * Math.sqrt(2 * g * 16);
          const comparison =
            outlets * coefficient * Math.PI * radius ** 2 * Math.sqrt(2 * g * head);
          const m = calixModel({ quarters, count: outlets, head, duration });
          assert(Math.abs(m.flowRatio - comparison / reference) < 1e-12);
          assert(Math.abs(m.comparisonVolume / m.referenceVolume - comparison / reference) < 1e-12);
          count++;
        }
  assert.equal(count, 6144);
});

test("a shared field book round trips every trial and rejects an invalid whole record", () => {
  const state = {
    ...CALIX_INITIAL,
    reading: 8,
    trials: [
      { quarters: 10, count: 1, head: 16, duration: 1 },
      { quarters: 10, count: 1, head: 1, duration: 4 },
    ],
  };
  assert.deepEqual(readCalix(calixQuery(state)), { state, error: "" });
  for (const query of [
    "rig=10.1.16.1&rig=5.1.16.1",
    "read=9",
    "rig=11.1.16.1",
    "rig=5.0.16.1",
    "rig=5.1.0.1",
    "rig=5.1.16.5",
    "rig=5.1.16.1&trials=10.1.16.1;5.1.NaN.1",
    `trials=${Array(13).fill("5.1.16.1").join(";")}`,
  ]) {
    const result = readCalix(query);
    assert(result.error);
    assert.deepEqual(result.state, { ...CALIX_INITIAL, trials: [] });
  }
  const csv = calixCSV(state);
  assert(csv.includes('"1","10","1","16","1","5/2","4","1","16","4.00000000000000"'));
  assert(
    csv.includes(
      '"2","10","1","1","4","5/2","4","1/16","1","1.00000000000000","4","4.00000000000000"',
    ),
  );
});
