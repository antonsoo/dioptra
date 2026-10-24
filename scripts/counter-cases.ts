import { COUNTER_DEFAULT, counter } from "../src/counter-model";

for (const trial of [20, 24, 30] as const) {
  const points = new Set([
    0, 1, 7, 8, 9, 79, 80, 81, 159, 160, 191, 192, 239, 240, 4799, 4800, 5759, 5760, 7199, 7200,
  ]);
  for (let i = 0; i <= 7200; i += 7) points.add(i);
  for (const turns of [...points].sort((a, b) => a - b))
    for (const calibrated of [false, true]) {
      const s = { ...COUNTER_DEFAULT, trial, turns, probe: trial, calibrated };
      console.log(JSON.stringify({ state: s, result: counter(s) }));
    }
}
