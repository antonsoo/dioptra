/** A ratio experiment, not a proposed tooth profile or mechanical reconstruction. */
export type Trial = 20 | 24 | 30;
export interface CounterState {
  turns: number;
  trial: Trial;
  probe: number;
  calibrated: boolean;
  reading: number;
  page: number;
}
export const COUNTER_DEFAULT: CounterState = {
  turns: 80,
  trial: 20,
  probe: 0,
  calibrated: false,
  reading: 0,
  page: 298,
};
export const COUNTER_PAGES = Array.from({ length: 12 }, (_, i) => 292 + i);
export function normalizeCounter(s: Partial<CounterState>): CounterState {
  const integer = (n: number | undefined, fallback: number, min: number, max: number) =>
    Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n as number))) : fallback;
  const trial = s.trial === 24 || s.trial === 30 ? s.trial : 20;
  return {
    turns: integer(s.turns, 80, 0, 7200),
    trial,
    probe: integer(s.probe, 0, 0, trial),
    // A shared link must retain a completed observation to apply its graduation.
    calibrated: s.calibrated === true && s.probe === trial,
    reading: integer(s.reading, 0, 0, 13),
    page: integer(s.page, 298, 292, 303),
  };
}
export function parseCounter(search: string): { state: CounterState; adjusted: boolean } {
  const p = new URLSearchParams(search);
  const n = (key: string, fallback: number) => (p.has(key) ? Number(p.get(key)) : fallback);
  const raw = {
    turns: n("w", 80),
    trial: n("trial", 20) as Trial,
    probe: n("probe", 0),
    calibrated: p.get("scale") === "measured",
    reading: n("r", 0),
    page: n("page", 298),
  };
  const state = normalizeCounter(raw);
  return {
    state,
    adjusted:
      Object.keys(raw).some(
        (k) => raw[k as keyof CounterState] !== state[k as keyof CounterState],
      ) ||
      (p.has("scale") && !["measured", "theory"].includes(p.get("scale") ?? "")),
  };
}
export function counterQuery(s: CounterState): string {
  const p = new URLSearchParams({
    w: String(s.turns),
    trial: String(s.trial),
    probe: String(s.probe),
    scale: s.calibrated ? "measured" : "theory",
    r: String(s.reading),
    page: String(s.page),
  });
  return `?${p}`;
}
export function counter(s: CounterState) {
  const firstPeriod = 8 * s.trial;
  const period = firstPeriod * 30;
  const remainder = s.turns % period;
  const coarse = Math.floor(remainder / firstPeriod);
  const firstNumerator = (s.turns % firstPeriod) * 30;
  const firstTick = firstNumerator / firstPeriod;
  const graduation = s.calibrated ? firstPeriod / 3 : 80;
  const indicated = ((coarse * 30 * firstPeriod + firstNumerator) * graduation) / firstPeriod;
  return {
    firstPeriod,
    period,
    wraps: Math.floor(s.turns / period),
    remainder,
    peg: s.turns % 8,
    firstTick,
    firstAngle: (firstNumerator / firstPeriod) * 12,
    secondTick: remainder / firstPeriod,
    secondAngle: (remainder / period) * 360,
    coarse,
    graduation,
    measuredGraduation: firstPeriod / 3,
    indicated,
    actualRemainder: remainder * 10,
    ledger: s.turns * 10,
    error: indicated - remainder * 10,
    errorPercent: ((s.calibrated ? 1 : 30 / s.trial) - 1) * 100,
    probeTick: (s.probe * 30) / s.trial,
    probeAngle: (s.probe * 360) / s.trial,
  };
}
export const counterNumber = (n: number, places = 3) =>
  new Intl.NumberFormat("en", { maximumFractionDigits: places }).format(n);
export function counterFraction(n: number, d: number): string {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = gcd(n, d);
  n /= g;
  d /= g;
  if (d === 1) return String(n);
  const whole = Math.floor(n / d);
  return `${whole ? `${whole} ` : ""}${n % d}/${d}`;
}
export function counterCsv(s: CounterState): string {
  const m = counter(s);
  const rows: (string | number)[][] = [
    [
      "record",
      "wheel_turns",
      "first_divisions",
      "second_divisions",
      "dial_cubits",
      "ledger_cubits",
      "complete_circuits",
    ],
  ];
  const checkpoints = [
    ...new Set([0, 7, 8, 80, m.firstPeriod - 1, m.firstPeriod, m.period - 1, m.period, s.turns]),
  ].sort((a, b) => a - b);
  for (const turns of checkpoints) {
    const r = counter({ ...s, turns });
    rows.push(["checkpoint", turns, r.firstTick, r.secondTick, r.indicated, r.ledger, r.wraps]);
  }
  rows.push(
    ["assumption", "wheel circumference", 10, "cubits; source numerical example"],
    ["assumption", "cubits per stadion", 400, "source numerical equivalence"],
    [
      "assumption",
      "first worm turns per revolution",
      s.trial,
      s.trial === 24 ? "modern extra trial" : "source worked example",
    ],
    [
      "assumption",
      "second worm turns per revolution",
      30,
      "theoretical assumption; not tested here",
    ],
    [
      "graduation",
      "cubits per first division",
      m.graduation,
      s.calibrated ? "measured first-stage ratio" : "one-tooth-per-turn theory",
    ],
  );
  return `${rows.map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\r\n")}\r\n`;
}
