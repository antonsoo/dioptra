/** Modern ideal collection experiment. cm, seconds and litres are chosen teaching units. */
export type FlowState = {
  width: number;
  depth: number;
  speedA: number;
  speedB: number;
  variable: boolean;
  time: number;
  window: "first" | "last" | "whole";
  reading: number;
};
export const FLOW_DEFAULT: FlowState = {
  width: 12,
  depth: 4,
  speedA: 10,
  speedB: 30,
  variable: false,
  time: 20,
  window: "whole",
  reading: 0,
};
export const FLOW_LIMITS = {
  width: [4, 16, 1],
  depth: [1, 6, 1],
  speedA: [5, 30, 1],
  speedB: [5, 30, 1],
  time: [0, 20, 0.1],
  reading: [0, 10, 1],
} as const;
export type NumericFlowKey = keyof typeof FLOW_LIMITS;
export function normalizeFlow(raw: Partial<FlowState>): FlowState {
  const state = { ...FLOW_DEFAULT, ...raw };
  for (const key of Object.keys(FLOW_LIMITS) as NumericFlowKey[]) {
    const [min, max, step] = FLOW_LIMITS[key];
    const value = Number.isFinite(state[key]) ? state[key] : FLOW_DEFAULT[key];
    state[key] = Math.round(Math.min(max, Math.max(min, value)) / step) * step;
    state[key] = Number(state[key].toFixed(1));
  }
  state.variable = state.variable === true;
  if (!["first", "last", "whole"].includes(state.window)) state.window = "whole";
  return state;
}
export function flowArea(s: FlowState) {
  return s.width * s.depth;
}
export function flowSpeed(s: FlowState, stream: "A" | "B", time = s.time) {
  return stream === "A" || (s.variable && time >= 10) ? s.speedA : s.speedB;
}
export function flowVolume(s: FlowState, stream: "A" | "B", time = s.time) {
  const t = Math.min(20, Math.max(0, time));
  const distance =
    stream === "A"
      ? s.speedA * t
      : s.variable
        ? s.speedB * Math.min(t, 10) + s.speedA * Math.max(0, t - 10)
        : s.speedB * t;
  return (flowArea(s) * distance) / 1000;
}
export function flowWindow(s: FlowState) {
  const start = s.window === "last" ? 10 : 0;
  const end = s.window === "first" ? 10 : 20;
  const streams = (["A", "B"] as const).map((stream) => {
    const before = flowVolume(s, stream, start),
      after = flowVolume(s, stream, end);
    const volume = after - before,
      average = volume / (end - start);
    return {
      stream,
      before,
      after,
      volume,
      average,
      extrapolated: average * 20,
      actual: flowVolume(s, stream, 20),
    };
  });
  return { start, end, duration: end - start, streams };
}
export function flowQuery(s: FlowState) {
  return `?w=${s.width}&d=${s.depth}&a=${s.speedA}&b=${s.speedB}&v=${+s.variable}&t=${s.time}&m=${s.window}&r=${s.reading}`;
}
export function parseFlow(search: string): { state: FlowState; adjusted: boolean } {
  const p = new URLSearchParams(search),
    state = { ...FLOW_DEFAULT };
  let adjusted = false;
  const names = {
    w: "width",
    d: "depth",
    a: "speedA",
    b: "speedB",
    t: "time",
    r: "reading",
  } as const;
  for (const [name, key] of Object.entries(names)) {
    if (!p.has(name)) continue;
    const raw = p.get(name) ?? "",
      value = Number(raw),
      [min, max, step] = FLOW_LIMITS[key];
    if (
      p.getAll(name).length !== 1 ||
      !/^\d+(?:\.\d+)?$/.test(raw) ||
      !Number.isFinite(value) ||
      value < min ||
      value > max ||
      Math.abs(value / step - Math.round(value / step)) > 1e-8
    )
      adjusted = true;
    else state[key] = value;
  }
  if (p.has("v")) {
    if (p.getAll("v").length !== 1 || !["0", "1"].includes(p.get("v") ?? "")) adjusted = true;
    else state.variable = p.get("v") === "1";
  }
  if (p.has("m")) {
    const m = p.get("m");
    if (p.getAll("m").length !== 1 || (m !== "first" && m !== "last" && m !== "whole"))
      adjusted = true;
    else state.window = m;
  }
  return { state: normalizeFlow(state), adjusted };
}
export const flowNumber = (n: number) =>
  Number(n.toFixed(4)).toLocaleString("en-US", { maximumFractionDigits: 4 });
