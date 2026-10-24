import {
  FLOW_DEFAULT,
  type FlowState,
  flowArea,
  flowVolume,
  flowWindow,
} from "../src/flow-model.ts";

const cases = [];
for (const [width, depth, a, b] of [
  [12, 4, 10, 30],
  [4, 1, 5, 30],
  [16, 6, 30, 5],
  [9, 3, 17, 17],
  [7, 5, 13, 29],
] as const) {
  for (const variable of [false, true])
    for (const window of ["first", "last", "whole"] as const) {
      const s: FlowState = {
        ...FLOW_DEFAULT,
        width: width,
        depth: depth,
        speedA: a,
        speedB: b,
        variable,
        window,
      };
      cases.push({
        state: s,
        area: flowArea(s),
        measure: flowWindow(s),
        frames: [0, 0.1, 5, 9.9, 10, 10.1, 15, 19.9, 20].map((time) => ({
          time,
          A: flowVolume(s, "A", time),
          B: flowVolume(s, "B", time),
        })),
      });
    }
}
console.log(JSON.stringify(cases));
