export interface CalixSettings {
  quarters: number;
  count: number;
  head: number;
  duration: number;
}
export interface CalixState extends CalixSettings {
  reading: number;
  trials: CalixSettings[];
}
export type Exact = readonly [number, number];
export const CALIX_INITIAL: Readonly<CalixState> = {
  quarters: 10,
  count: 1,
  head: 16,
  duration: 1,
  reading: 0,
  trials: [],
};
export const CALIX_BOUNDS = {
  quarters: [5, 10],
  count: [1, 4],
  head: [1, 64],
  duration: [1, 4],
} as const;
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
export function exact(n: number, d: number): Exact {
  const g = gcd(n, d);
  return [n / g, d / g];
}
export const exactText = (r: Exact): string => (r[1] === 1 ? String(r[0]) : `${r[0]}/${r[1]}`);
export function calixModel(s: CalixSettings) {
  const diameter = exact(s.quarters, 4);
  const diameterRatio = exact(s.quarters, 5);
  const areaRatio = exact(s.count * s.quarters ** 2, 25);
  const headRatio = exact(s.head, 16);
  const flowSquared = exact(s.count ** 2 * s.quarters ** 4 * s.head, 10000);
  const flowRatio = Math.sqrt(flowSquared[0] / flowSquared[1]);
  return {
    diameter,
    diameterRatio,
    areaRatio,
    headRatio,
    flowSquared,
    flowRatio,
    openingRatio: areaRatio[0] / areaRatio[1],
    referenceVolume: s.duration,
    comparisonVolume: s.duration * flowRatio,
    // Q/Q0 = A/A0 * sqrt(h/h0). This is a modern ideal-orifice
    // comparison with a common coefficient, not a Roman flow conversion.
  };
}
export function calixSettings(s: CalixSettings): CalixSettings {
  return { quarters: s.quarters, count: s.count, head: s.head, duration: s.duration };
}
function parseSettings(text: string): CalixSettings {
  const values = text.split(".");
  const keys = ["quarters", "count", "head", "duration"] as const;
  if (values.length !== keys.length) throw Error("A trial needs four settings.");
  const settings = {} as CalixSettings;
  keys.forEach((key, i) => {
    const value = values[i] ?? "";
    const number = Number(value);
    if (!/^\d{1,2}$/.test(value) || number < CALIX_BOUNDS[key][0] || number > CALIX_BOUNDS[key][1])
      throw Error("A saved trial has invalid or out-of-range settings.");
    settings[key] = number;
  });
  return settings;
}
const settingsText = (s: CalixSettings): string =>
  `${s.quarters}.${s.count}.${s.head}.${s.duration}`;
export function calixQuery(s: CalixState): string {
  return new URLSearchParams({
    rig: settingsText(s),
    read: String(s.reading),
    trials: s.trials.map(settingsText).join(";"),
  }).toString();
}
export function readCalix(search: string): { state: CalixState; error: string } {
  const p = new URLSearchParams(search);
  try {
    for (const key of ["rig", "read", "trials"])
      if (p.getAll(key).length > 1) throw Error("Repeated saved settings are ambiguous.");
    const settings = p.has("rig")
      ? parseSettings(p.get("rig") ?? "")
      : calixSettings(CALIX_INITIAL);
    const reading = p.has("read") ? Number(p.get("read")) : 0;
    if (!/^[0-9]$/.test(p.get("read") ?? "0") || reading > 8)
      throw Error("Choose one of the nine readings.");
    const text = p.get("trials") ?? "";
    if (text.length > 240) throw Error("A shared field book can retain at most twelve trials.");
    const trials = text ? text.split(";").map(parseSettings) : [];
    if (trials.length > 12) throw Error("A shared field book can retain at most twelve trials.");
    return { state: { ...settings, reading, trials }, error: "" };
  } catch (error) {
    return {
      state: { ...CALIX_INITIAL, trials: [] },
      error: `${error instanceof Error ? error.message : "Invalid saved experiment."} The complete starting experiment has been restored.`,
    };
  }
}
export function calixCSV(s: CalixState): string {
  const rows: (string | number)[][] = [
    [
      "Dioptra Frontinus comparison",
      "Modern ideal-orifice ratio experiment; not measured Roman supply",
    ],
    [
      "reference",
      "one quinaria opening; diameter 5/4 source digits; head 16 chosen units; reference volume 1 per chosen time unit",
    ],
    [
      "assumptions",
      "steady constant heads; common outlet coefficient; negligible approach velocity and pipe losses; no absolute unit conversion",
    ],
    [
      "trial",
      "diameter_quarter_digits",
      "outlets",
      "head_chosen_units",
      "chosen_time_units",
      "diameter_source_digits",
      "opening_ratio_exact",
      "head_ratio_exact",
      "squared_flow_ratio_exact",
      "flow_ratio",
      "reference_volume_relative",
      "comparison_volume_relative",
    ],
    ...s.trials.map((t, i) => {
      const m = calixModel(t);
      return [
        i + 1,
        t.quarters,
        t.count,
        t.head,
        t.duration,
        exactText(m.diameter),
        exactText(m.areaRatio),
        exactText(m.headRatio),
        exactText(m.flowSquared),
        m.flowRatio.toPrecision(15),
        m.referenceVolume,
        m.comparisonVolume.toPrecision(15),
      ];
    }),
  ];
  return `${rows.map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n")}\n`;
}
