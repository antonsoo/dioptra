import { type Point, type SurveyState, survey } from "./survey";

export const esc = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
export const num = (n: number, places = 2) => {
  const fixed = (Math.abs(n) < 1e-9 ? 0 : n).toFixed(places);
  return places === 0 ? fixed : fixed.replace(/\.?0+$/, "");
};
export const measure = (m: number) =>
  Math.abs(m) < 1 ? `${num(m * 1000, 2)} mm` : `${num(m, 3)} m`;

export function mapDrawing(input: SurveyState, narrow = false, id = "survey-map"): string {
  const m = survey(input),
    s = m.state,
    w = narrow ? 390 : 900,
    h = narrow ? 640 : 590;
  const left = -s.baseline - 32,
    right = m.x + 100 + s.detour + 38;
  const bottom = -s.baseline - 32,
    top = Math.max(m.y * 2.25, m.y + s.baseline) + 20;
  const mx = (left + right) / 2,
    my = (top + bottom) / 2;
  const u = Math.min(
    (w - 84) / (narrow ? top - bottom : right - left),
    (h - 100) / (narrow ? right - left : top - bottom),
  );
  const point = ({ x, y }: Point) =>
    narrow
      ? { x: w / 2 + (y - my) * u, y: h / 2 + (x - mx) * u }
      : { x: w / 2 + (x - mx) * u, y: h / 2 - (y - my) * u };
  const xy = (x: number, y: number) => {
    const p = point({ x, y });
    return `${p.x} ${p.y}`;
  };
  const line = (a: Point, b: Point, cls: string, data = "") => {
    const p = point(a),
      q = point(b);
    return `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" class="${cls}" ${data}/>`;
  };
  const label = (at: Point, text: string, dx = 0, dy = -10, cls = "map-label") => {
    const p = point(at);
    return `<text x="${p.x + dx}" y="${p.y + dy}" class="${cls}" text-anchor="middle">${esc(text)}</text>`;
  };
  const dot = (at: Point, cls = "station", r = 3.5, data = "") => {
    const p = point(at);
    return `<circle cx="${p.x}" cy="${p.y}" r="${r}" class="${cls}" ${data}/>`;
  };
  const B = { x: 0, y: 0 },
    D = { x: m.x, y: m.y },
    N = { x: m.x, y: 0 };
  const mountain = `M${xy(0, 0)} Q${xy(0.08 * m.x, 0.15 * m.y)} ${xy(0.22 * m.x, 0.32 * m.y)} T${xy(0.7 * m.x, 0.4 * m.y)} Q${xy(0.94 * m.x, 0.45 * m.y)} ${xy(m.x, m.y)} C${xy(0.9 * m.x, 2 * m.y)} ${xy(0.25 * m.x, 2.15 * m.y)} ${xy(0.08 * m.x, 1.55 * m.y)} Q${xy(-0.12 * m.x, 0.75 * m.y)} ${xy(0, 0)}Z`;
  let ink = `<path d="${mountain}" class="mountain"/>`;
  // Nested outlines are decorative contours, never elevations or measured ground.
  const centre = point({ x: 0.48 * m.x, y: 0.95 * m.y });
  for (const k of [0.8, 0.6, 0.4])
    ink += `<path d="${mountain}" class="mountain-contour" transform="translate(${centre.x * (1 - k)} ${centre.y * (1 - k)}) scale(${k})"/>`;
  if (!narrow) {
    ink += label({ x: 0.46 * m.x, y: 1.03 * m.y }, "MOUNTAIN", 0, -3, "map-caption");
    ink += label({ x: 0.46 * m.x, y: 1.03 * m.y }, "schematic ground outline", 0, 14, "map-small");
  }
  for (const [i, l] of m.legs.entries()) {
    ink += line(
      l.from,
      l.to,
      `walk${i === s.leg ? " active-leg" : ""}`,
      `data-leg="${i}" data-dx="${l.dx}" data-dy="${l.dy}"`,
    );
    if (i > 0) {
      const previous = m.legs[i - 1];
      if (previous) {
        const q = 6 / u,
          signx = Math.sign(previous.dx || l.dx),
          signy = Math.sign(previous.dy || l.dy);
        const a = {
          x: l.from.x - (previous.axis === "x" ? signx * q : 0),
          y: l.from.y - (previous.axis === "y" ? signy * q : 0),
        };
        const b = {
          x: a.x + (l.axis === "x" ? Math.sign(l.dx) * q : 0),
          y: a.y + (l.axis === "y" ? Math.sign(l.dy) * q : 0),
        };
        const c = {
          x: l.from.x + (l.axis === "x" ? Math.sign(l.dx) * q : 0),
          y: l.from.y + (l.axis === "y" ? Math.sign(l.dy) * q : 0),
        };
        ink += `<path d="M${xy(a.x, a.y)} L${xy(b.x, b.y)} L${xy(c.x, c.y)}" class="right-mark"/>`;
      }
    }
  }
  const closing = m.stations[6];
  if (closing) {
    const lambda = { x: closing.x, y: m.y * 1.42 };
    ink += line(closing, lambda, "sight") + label(lambda, "Λ", narrow ? 12 : 0, narrow ? 5 : -8);
  }
  if (s.stage >= 1) {
    ink += `<path d="M${xy(0, 0)} L${xy(m.x, 0)} L${xy(m.x, m.y)} Z" class="hidden-triangle"/>`;
    ink +=
      line(B, N, "component", 'data-component="x"') + line(N, D, "component", 'data-component="y"');
    ink += line(B, D, "ideal", 'data-ideal="true"');
    ink += dot(N, "imagined") + label(N, "Ν", narrow ? -15 : 0, narrow ? 0 : 20);
    if (!narrow)
      ink += label(
        { x: 0.55 * m.x, y: 0 },
        `ΒΝ = ${num(m.x)} m`,
        narrow ? -28 : 0,
        narrow ? 0 : 30,
        "map-measure",
      );
    if (!narrow)
      ink += label(
        { x: m.x, y: 0.5 * m.y },
        `ΔΝ = ${num(m.y)} m`,
        narrow ? 0 : 55,
        narrow ? 24 : 0,
        "map-measure",
      );
  }
  if (s.stage >= 2) {
    const O = { x: -s.baseline, y: 0 },
      P = { x: m.x + s.baseline, y: m.y };
    ink += line(B, O, "peg-base") + line(O, m.bPeg, "peg-offset") + line(m.bPeg, B, "sight");
    ink += line(D, P, "peg-base") + line(P, m.dPeg, "peg-offset") + line(m.dPeg, D, "sight");
    for (const [p, l] of [
      [O, "Ο"],
      [m.bPeg, "Ξ"],
      [P, "Ρ"],
      [m.dPeg, "Π"],
    ] as const)
      ink +=
        dot(p, "peg", 4) +
        label(
          p,
          l,
          narrow ? (l === "Ξ" || l === "Ρ" ? -14 : 14) : 0,
          narrow ? (l === "Ξ" || l === "Ο" ? -20 : 28) : l === "Ξ" || l === "Ρ" ? 23 : -12,
        );
    ink += label(
      { x: -s.baseline / 2, y: 0 },
      `${num(s.baseline)} m`,
      narrow ? -20 : 0,
      narrow ? 0 : -13,
      "map-small",
    );
  }
  if (s.stage === 3) {
    ink += line(
      B,
      m.bEnd,
      "bore-b",
      `data-bore="B" data-world-x="${m.bEnd.x}" data-world-y="${m.bEnd.y}"`,
    );
    ink += line(
      D,
      m.dEnd,
      "bore-d",
      `data-bore="D" data-world-x="${m.dEnd.x}" data-world-y="${m.dEnd.y}"`,
    );
    ink += dot(m.bEnd, "front-b", 5) + dot(m.dEnd, "front-d", 5);
    ink += line({ x: m.x / 2, y: -0.12 * m.y }, { x: m.x / 2, y: 1.55 * m.y }, "middle-station");
    if (!narrow) ink += label({ x: m.x / 2, y: 1.6 * m.y }, "MIDDLE STATION", 0, -8, "map-small");
  }
  for (const station of m.stations) {
    ink += dot(
      station,
      station.id === "B" || station.id === "D" ? "portal" : "station",
      station.id === "B" || station.id === "D" ? 5 : 3.5,
      `data-station="${station.id}" data-x="${station.x}" data-y="${station.y}"`,
    );
    const offsets: Record<string, [number, number]> = narrow
      ? {
          B: [-18, 0],
          E: [-17, -8],
          Z: [14, 0],
          H: [-14, 16],
          T: [12, 16],
          K: [-15, 8],
          M: [12, 0],
          D: [15, -8],
        }
      : {
          B: [-10, 20],
          E: [0, 21],
          Z: [0, -12],
          H: [12, 18],
          T: [13, -6],
          K: [-12, -10],
          M: [14, -10],
          D: [-10, -12],
        };
    const [dx, dy] = offsets[station.id] ?? [0, -10];
    ink += label(station, station.label, dx, dy);
  }
  const scaleLength = m.x >= 400 ? 100 : 50,
    px = scaleLength * u;
  const scale = `<path d="M30 ${h - 35} v5 h${px} v-5" class="scale-bar"/><text x="30" y="${h - 45}" class="map-small">${scaleLength} chosen metres</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc" data-scale="${u}" data-rotated="${narrow}" data-stage="${s.stage}"><title id="${id}-title">Hero’s circuit around a mountain, stage ${s.stage + 1}</title><desc id="${id}-desc">${esc(`The circuit joins Β to Δ through seven perpendicular measured legs. Net displacement ${m.x} by ${m.y} chosen metres. The mountain is schematic. ${narrow ? "The phone view rotates the plan clockwise by 90 degrees, retaining equal scales." : "Equal x and y scales."}`)}</desc><defs><clipPath id="${id}-clip"><rect x="5" y="32" width="${w - 10}" height="${h - 100}"/></clipPath></defs><text x="24" y="23" class="map-small">${narrow ? "PLAN ROTATED 90° · EQUAL SCALES" : "PLAN / LOOKING DOWN · EQUAL SCALES"}</text><g clip-path="url(#${id}-clip)">${ink}</g>${scale}</svg>`;
}

export function gapDrawing(s: SurveyState, id = "gap"): string {
  const m = survey(s),
    gap = Math.abs(m.gap) < 1e-9 ? 0 : m.gap,
    extent = Math.max(Math.abs(gap), 0.02),
    u = 100 / extent;
  const by = 105 - (gap * u) / 2,
    dy = 105 + (gap * u) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" role="img" aria-labelledby="${id}-title" data-gap="${m.gap}" data-magnification="${u}"><title id="${id}-title">Vertical gap at the middle station: ${measure(gap)}</title><text x="18" y="22" class="map-small">MIDDLE CROSS-SECTION / SEPARATE SCALE</text><line x1="175" y1="42" x2="175" y2="170" class="middle-station"/><path d="M30 ${by} H175" class="bore-b"/><path d="M175 ${dy} H330" class="bore-d"/><circle cx="175" cy="${by}" r="5" class="front-b"/><circle cx="175" cy="${dy}" r="3.5" class="front-d"/><text x="25" y="${by - 12}" class="map-label">From Β</text><text x="250" y="${dy + 24}" class="map-label">From Δ</text><text x="180" y="202" text-anchor="middle" class="map-measure">${gap === 0 ? "The two lines coincide" : `${measure(Math.abs(gap))} vertical gap`}</text></svg>`;
}
