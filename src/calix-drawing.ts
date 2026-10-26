import { type CalixSettings, calixModel, exactText } from "./calix-model";

export const html = (s: string | number): string =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
export const decimal = (n: number): string =>
  Number(n.toFixed(4)).toLocaleString("en", { maximumFractionDigits: 4 });
export const CALIX_INK = `svg{font-family:SurveySans,Plex,sans-serif;color:#223e4b}svg text{fill:currentColor}svg .cx-label{font-size:13px}svg .cx-small{font-size:11px}svg .cx-big{font-size:21px;font-weight:600}svg .cx-rule{stroke:#7c969f;stroke-width:1;fill:none}svg .cx-blue{fill:#39758c}svg .cx-ochre{fill:#9b6327}`;

export function calixBores(s: CalixSettings, id: string): string {
  const m = calixModel(s),
    r = (23 * s.quarters) / 5;
  const centers: [number, number][] =
    s.count === 1
      ? [[296, 145]]
      : s.count === 2
        ? [
            [241, 145],
            [351, 145],
          ]
        : s.count === 3
          ? [
              [241, 93],
              [351, 93],
              [296, 200],
            ]
          : [
              [241, 93],
              [351, 93],
              [241, 200],
              [351, 200],
            ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 300" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">Opening areas at one common length scale</title><desc id="${id}-desc">Reference: one circle, diameter five quarters of a source digit. Comparison: ${s.count} separate circles, each diameter ${exactText(m.diameter)} digits. Total comparison area is ${exactText(m.areaRatio)} times the reference. Circles are separate openings, not a packing diagram.</desc><text x="22" y="27" class="cx-label">REFERENCE</text><text x="209" y="27" class="cx-label">YOUR OPENINGS</text><path d="M173 43V258" class="cx-rule"/><circle cx="80" cy="145" r="23" fill="#39758c" fill-opacity=".16" stroke="#39758c" stroke-width="2"/><path d="M57 145H103M57 140V150M103 140V150" stroke="#39758c"/><text x="80" y="199" text-anchor="middle" class="cx-label">5/4 digits</text>${centers.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9b6327" fill-opacity=".16" stroke="#9b6327" stroke-width="2"/><path d="M${x - r} ${y}H${x + r}" stroke="#9b6327"/>`).join("")}<text x="22" y="283" class="cx-label">Area 1</text><text x="209" y="283" class="cx-label">Total area ${exactText(m.areaRatio)} ×</text></svg>`;
}

export function calixRig(s: CalixSettings, progress: number, id: string): string {
  const m = calixModel(s),
    max = Math.max(m.referenceVolume, m.comparisonVolume),
    base = 229;
  const tanks = [
    { x: 28, head: 16, flow: 1, volume: m.referenceVolume, color: "#39758c", label: "REFERENCE" },
    {
      x: 247,
      head: s.head,
      flow: m.flowRatio,
      volume: m.comparisonVolume,
      color: "#9b6327",
      label: "COMPARISON",
    },
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 440" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">Constant-head ideal outlets and collected amounts</title><desc id="${id}-desc">Heads use the same vertical scale. Reference head is sixteen chosen units; comparison head is ${s.head}. At the end of ${s.duration} chosen time units, reference collection is ${decimal(m.referenceVolume)} and comparison collection is ${decimal(m.comparisonVolume)} relative volume units. Collection bars have a shared linear scale whose maximum is ${decimal(max)}. Playback illustrates this calculation; it is not a measurement.</desc>${tanks.map((t) => `<text x="${t.x}" y="25" class="cx-label">${t.label}</text><path d="M${t.x} 56V${base}H${t.x + 116}V56" fill="none" stroke="#7c969f"/><path d="M${t.x + 1} ${base - t.head * 2.5}H${t.x + 115}V${base - 1}H${t.x + 1}Z" fill="${t.color}" fill-opacity=".18"/><path d="M${t.x} ${base - t.head * 2.5}H${t.x + 116}" stroke="${t.color}" stroke-width="2"/><path d="M${t.x + 131} ${base - t.head * 2.5}V${base}M${t.x + 127} ${base - t.head * 2.5}H${t.x + 135}M${t.x + 127} ${base}H${t.x + 135}" class="cx-rule"/><text x="${t.x + 63}" y="${base - t.head * 2.5 - 12}" text-anchor="middle" class="cx-label">h = ${t.head}</text><circle cx="${t.x + 58}" cy="${base}" r="5" fill="${t.color}"/><path d="M${t.x + 58} ${base + 7}V251" stroke="${t.color}" stroke-width="3" stroke-dasharray="4 6"/><text x="${t.x}" y="269" class="cx-label">Q / Q₀ = ${decimal(t.flow)}</text><path d="M${t.x} 297V402H${t.x + 116}V297" fill="none" stroke="#7c969f"/><path d="M${t.x + 1} ${401 - ((100 * t.volume) / max) * progress}H${t.x + 115}V401H${t.x + 1}Z" fill="${t.color}" fill-opacity=".35"/><text x="${t.x + 58}" y="325" text-anchor="middle" class="cx-big">${decimal(t.volume * progress)}</text><text x="${t.x}" y="426" class="cx-small">relative collected volume</text>`).join("")}<text x="210" y="289" text-anchor="middle" class="cx-small">shared collection scale: 0–${decimal(max)}</text></svg>`;
}

export function calixTable(trials: CalixSettings[]): string {
  return `<table><caption>Recorded predictions · one constant-head trial per row</caption><thead><tr><th scope="col">Trial</th><th scope="col">D / digits</th><th scope="col">Openings</th><th scope="col">Head</th><th scope="col">Area / A₀</th><th scope="col">Q / Q₀</th><th scope="col">Time</th><th scope="col">Volumes A / B</th></tr></thead><tbody>${trials
    .map((t, i) => {
      const m = calixModel(t);
      return `<tr><th scope="row">${i + 1}</th><td>${exactText(m.diameter)}</td><td>${t.count}</td><td>${t.head}</td><td>${exactText(m.areaRatio)}</td><td>${decimal(m.flowRatio)}</td><td>${t.duration}</td><td>${decimal(m.referenceVolume)} / ${decimal(m.comparisonVolume)}</td></tr>`;
    })
    .join("")}</tbody></table>`;
}

export function calixSvg(s: CalixSettings, license: string): string {
  return calixBores(s, "saved-openings").replace(
    "<title",
    `<style>${CALIX_INK}</style><metadata>${html(`Dioptra · Modern opening-area comparison, Frontinus I.25–28, 43. Code and diagram © Anton Soloviev 2026, MIT. No digit-to-metre or quinaria-to-flow conversion.\n${license}`)}</metadata><title`,
  );
}
