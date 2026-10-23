import { DEFAULT, PRESETS, survey } from "../src/survey.ts";

const cases = [];
for (const preset of Object.keys(PRESETS) as (keyof typeof PRESETS)[])
  for (const detour of [0, 20, 60, 100])
    for (const baseline of [10, 25, 50, 80])
      for (const error of [-50, 0, 10, 50])
        for (const affected of ["B", "D", "both"] as const) {
          const m = survey({ ...DEFAULT, preset, detour, baseline, error, affected });
          cases.push(survey({ ...m.state, aim: m.correctAim }));
        }
console.log(JSON.stringify(cases));
