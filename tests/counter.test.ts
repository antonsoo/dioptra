import assert from "node:assert/strict";
import { test } from "node:test";
import {
  COUNTER_DEFAULT,
  counter,
  counterQuery,
  normalizeCounter,
  parseCounter,
} from "../src/counter-model";

test("Hero's trial changes the graduation, leaving the same fifteen-division pointer", () => {
  const a = counter(COUNTER_DEFAULT);
  const b = counter({ ...COUNTER_DEFAULT, probe: 20, calibrated: true });
  assert.equal(a.firstTick, 15);
  assert.equal(a.indicated, 1200);
  assert.equal(b.indicated, 800);
  assert.equal(a.firstAngle, b.firstAngle);
  assert.equal(a.secondAngle, b.secondAngle);
  assert.equal(a.ledger, b.ledger);
});
test("carry includes complete first-dial turns without counting its fine fraction twice", () => {
  const s = { ...COUNTER_DEFAULT, probe: 20, calibrated: true };
  const before = counter({ ...s, turns: 159 }),
    after = counter({ ...s, turns: 160 });
  assert.equal(before.coarse, 0);
  assert.equal(after.coarse, 1);
  assert.equal(after.firstTick, 0);
  assert.equal(after.indicated - before.indicated, 10);
});
test("a complete circuit loses distance from the instrument, not the outside ledger", () => {
  const m = counter({ ...COUNTER_DEFAULT, turns: 4800, probe: 20, calibrated: true });
  assert.equal(m.firstTick, 0);
  assert.equal(m.secondTick, 0);
  assert.equal(m.indicated, 0);
  assert.equal(m.ledger, 48000);
  assert.equal(m.wraps, 1);
});
test("the independent extra trial needs its own observation and graduation", () => {
  const s = { ...COUNTER_DEFAULT, trial: 24 as const, turns: 96, probe: 24, calibrated: true };
  assert.equal(counter(s).indicated, 960);
  assert.equal(counter(s).graduation, 64);
  const incomplete = normalizeCounter({ ...s, probe: 23 });
  assert.equal(incomplete.calibrated, false);
  assert.equal(parseCounter(counterQuery(s)).state.calibrated, true);
});
test("shared state rejects unfinished measured scales and bounds corrupt controls", () => {
  const p = parseCounter("?w=Infinity&trial=999&probe=-4&scale=measured&r=800&page=NaN");
  assert(p.adjusted);
  assert.deepEqual(p.state, { ...COUNTER_DEFAULT, reading: 13 });
  const full = {
    ...COUNTER_DEFAULT,
    turns: 4800,
    probe: 20,
    calibrated: true,
    reading: 13,
    page: 300,
  };
  assert.deepEqual(parseCounter(counterQuery(full)).state, full);
});
