export const PRESETS = {
  five: {
    title: "Five to one",
    run: 300,
    rise: 60,
    note: "Hero's example ratio; distances are chosen.",
  },
  two: { title: "Two to one", run: 240, rise: 120, note: "A steeper modern exercise." },
  seven: { title: "Seven to one", run: 420, rise: 60, note: "A flatter modern exercise." },
} as const;
export type Preset = keyof typeof PRESETS;
export interface SurveyState {
  preset: Preset;
  detour: number;
  stage: number;
  leg: number;
  baseline: number;
  aim: number;
  error: number;
  affected: "B" | "D" | "both";
  progress: number;
  reading: number;
  source: number;
}
export interface Point {
  x: number;
  y: number;
}
export interface Station extends Point {
  id: string;
  label: string;
}
export interface Leg {
  from: Station;
  to: Station;
  length: number;
  dx: number;
  dy: number;
  axis: "x" | "y";
  sign: 1 | -1;
}
export const DEFAULT: SurveyState = {
  preset: "five",
  detour: 0,
  stage: 0,
  leg: 0,
  baseline: 50,
  aim: 0.16,
  error: 0,
  affected: "both",
  progress: 100,
  reading: 0,
  source: 0,
};
const bounded = (n: unknown, fallback: number, lo: number, hi: number, step?: number): number => {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  const clipped = Math.min(hi, Math.max(lo, n));
  return step ? Math.round(clipped / step) * step : clipped;
};
export function normalize(input: Partial<SurveyState>): SurveyState {
  return {
    preset: input.preset && Object.hasOwn(PRESETS, input.preset) ? input.preset : DEFAULT.preset,
    detour: bounded(input.detour, DEFAULT.detour, 0, 100, 10),
    stage: bounded(input.stage, DEFAULT.stage, 0, 3, 1),
    leg: bounded(input.leg, DEFAULT.leg, 0, 6, 1),
    baseline: bounded(input.baseline, DEFAULT.baseline, 10, 80, 5),
    aim: bounded(input.aim, DEFAULT.aim, 0, 1),
    error: bounded(input.error, DEFAULT.error, -50, 50, 1),
    affected: ["B", "D", "both"].includes(input.affected ?? "")
      ? (input.affected as SurveyState["affected"])
      : DEFAULT.affected,
    progress: bounded(input.progress, DEFAULT.progress, 0, 100, 1),
    reading: bounded(input.reading, DEFAULT.reading, 0, 7, 1),
    source: bounded(input.source, DEFAULT.source, 0, 3, 1),
  };
}
export function survey(input: Partial<SurveyState>) {
  const state = normalize(input),
    { run, rise } = PRESETS[state.preset],
    d = state.detour;
  // Bends move; the two portals remain fixed. This deliberate cancellation is
  // the experiment, not a measured traverse or a terrain reconstruction.
  const stations: Station[] = [
    { id: "B", label: "Β", x: 0, y: 0 },
    { id: "E", label: "Ε", x: 0.6 * run - 0.6 * d, y: 0 },
    { id: "Z", label: "Ζ", x: 0.6 * run - 0.6 * d, y: rise * (1 / 6 - d / 1200) },
    { id: "H", label: "Η", x: run + 100 + d, y: rise * (1 / 6 - d / 1200) },
    { id: "T", label: "Θ", x: run + 100 + d, y: rise * (2 / 3 + d / 1200) },
    { id: "K", label: "Κ", x: run + 20 + 0.2 * d, y: rise * (2 / 3 + d / 1200) },
    { id: "M", label: "Μ", x: run + 20 + 0.2 * d, y: rise },
    { id: "D", label: "Δ", x: run, y: rise },
  ];
  const legs: Leg[] = stations.slice(1).map((to, i) => {
    const from = stations[i];
    if (!from) throw new Error("Incomplete survey route");
    const dx = to.x - from.x,
      dy = to.y - from.y,
      axis = dx === 0 ? "y" : "x";
    return { from, to, dx, dy, axis, length: Math.hypot(dx, dy), sign: (dx || dy) > 0 ? 1 : -1 };
  });
  const east = legs.reduce((n, l) => n + Math.max(l.dx, 0), 0);
  const west = legs.reduce((n, l) => n + Math.max(-l.dx, 0), 0);
  const north = legs.reduce((n, l) => n + Math.max(l.dy, 0), 0);
  const south = legs.reduce((n, l) => n + Math.max(-l.dy, 0), 0);
  const x = east - west,
    y = north - south;
  const correctAim = y / x,
    targetPegRise = state.baseline * correctAim;
  const errorB = state.affected === "D" ? 0 : state.error / 1000;
  const errorD = state.affected === "B" ? 0 : state.error / 1000;
  const slopeB = state.aim + errorB / state.baseline;
  const slopeD = state.aim + errorD / state.baseline;
  const bEnd = { x: (x * state.progress) / 200, y: (slopeB * x * state.progress) / 200 };
  const dEnd = { x: x * (1 - state.progress / 200), y: y - (slopeD * x * state.progress) / 200 };
  const bMiddle = { x: x / 2, y: (slopeB * x) / 2 },
    dMiddle = { x: x / 2, y: y - (slopeD * x) / 2 };
  return {
    state,
    stations,
    legs,
    east,
    west,
    north,
    south,
    x,
    y,
    routeLength: legs.reduce((n, l) => n + l.length, 0),
    tunnelLength: Math.hypot(x, y),
    correctAim,
    targetPegRise,
    chosenPegRise: state.baseline * state.aim,
    bPeg: { x: -state.baseline, y: -state.baseline * state.aim - errorB },
    dPeg: { x: x + state.baseline, y: y + state.baseline * state.aim + errorD },
    bEnd,
    dEnd,
    bMiddle,
    dMiddle,
    gap: bMiddle.y - dMiddle.y,
    angle: (Math.atan2(y, x) * 180) / Math.PI,
    farOffset: slopeB * x - y,
    amplification: x / (2 * state.baseline),
  };
}
export function query(s: SurveyState): string {
  return `?${new URLSearchParams(Object.entries(normalize(s)).map(([key, value]) => [key, String(value)]))}`;
}
export function parse(search: string): { state: SurveyState; adjusted: boolean } {
  const p = new URLSearchParams(search),
    input: Record<string, unknown> = {};
  let adjusted = false;
  for (const [key, defaultValue] of Object.entries(DEFAULT)) {
    if (!p.has(key)) continue;
    const raw = p.get(key) ?? "";
    input[key] =
      typeof defaultValue === "number" ? (raw.trim() === "" ? Number.NaN : Number(raw)) : raw;
    if (p.getAll(key).length > 1) adjusted = true;
  }
  const state = normalize(input);
  for (const [key, value] of Object.entries(input))
    if (state[key as keyof SurveyState] !== value) adjusted = true;
  return { state, adjusted };
}
