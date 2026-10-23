import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT, normalize, PRESETS, parse, query, survey } from "../src/survey";

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
test("moving the bends changes the walk but never the portals or hidden displacement", () => {
  for (const preset of Object.keys(PRESETS) as (keyof typeof PRESETS)[])
    for (let detour = 0; detour <= 100; detour += 10) {
      const m = survey({ ...DEFAULT, preset, detour });
      close(m.x, PRESETS[preset].run);
      close(m.y, PRESETS[preset].rise);
      close(m.routeLength, PRESETS[preset].run + 200 + 2 * detour + PRESETS[preset].rise);
      for (const [i, l] of m.legs.entries()) {
        assert.ok(l.length > 0);
        close(l.dx * l.dy, 0);
        const next = m.legs[i + 1];
        if (next) close(l.dx * next.dx + l.dy * next.dy, 0);
      }
    }
});
test("the chosen source ratio uses 560 metres outside to determine a 300 by 60 triangle", () => {
  const m = survey(DEFAULT);
  close(m.routeLength, 560);
  close(m.x / m.y, 5);
  close(m.targetPegRise, 10);
  close(m.tunnelLength, Math.sqrt(93600));
});
test("correct exterior triangles and both middle fronts are collinear with the portals", () => {
  for (const preset of Object.keys(PRESETS) as (keyof typeof PRESETS)[])
    for (const baseline of [10, 25, 80]) {
      const original = survey({ ...DEFAULT, preset, baseline }),
        m = survey({ ...original.state, aim: original.correctAim });
      close(m.bPeg.x * m.y - m.bPeg.y * m.x, 0);
      close((m.dPeg.x - m.x) * m.y - (m.dPeg.y - m.y) * m.x, 0);
      close(m.bMiddle.y, m.y / 2);
      close(m.dMiddle.y, m.y / 2);
      close(m.gap, 0);
    }
});
test("signed peg displacements give the expected middle gap and respond to baseline length", () => {
  const m = survey({ ...DEFAULT, aim: 0.2, error: 10 });
  close(m.gap, 0.06);
  close(survey({ ...m.state, affected: "B" }).gap, 0.03);
  close(survey({ ...m.state, affected: "D" }).gap, 0.03);
  close(survey({ ...m.state, error: -10 }).gap, -0.06);
  close(survey({ ...m.state, baseline: 25 }).gap, 0.12);
  close(survey({ ...m.state, baseline: 80 }).gap, 0.0375);
});
test("a mistaken proportion remains a distinct contribution from peg error", () => {
  const m = survey({ ...DEFAULT, aim: 0.16, error: 10 });
  close(m.gap, -11.94);
  close(m.farOffset, -11.94);
});
test("extension is a fraction of horizontal half-span, with the middle comparison independent of progress", () => {
  for (const progress of [0, 25, 75, 100]) {
    const m = survey({ ...DEFAULT, aim: 0.2, error: 10, progress });
    close(m.bEnd.x, 1.5 * progress);
    close(m.dEnd.x, 300 - 1.5 * progress);
    close(m.gap, 0.06);
  }
});
test("shared numerical settings cannot introduce nonfinite geometry or move outside the declared ranges", () => {
  const malformed = parse(
    "?preset=__proto__&aim=NaN&baseline=Infinity&progress=-4&error=999&reading=&source=2&source=3",
  );
  assert.equal(malformed.adjusted, true);
  assert.equal(malformed.state.preset, "five");
  assert.equal(malformed.state.progress, 0);
  assert.equal(malformed.state.error, 50);
  assert.ok(Number.isFinite(survey(malformed.state).gap));
  const s = normalize({
    ...DEFAULT,
    preset: "seven",
    stage: 3,
    baseline: 35,
    aim: 1 / 7,
    error: -11,
    affected: "D",
    reading: 6,
    source: 3,
  });
  assert.deepEqual(parse(query(s)), { state: s, adjusted: false });
});
