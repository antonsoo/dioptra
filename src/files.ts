import license from "../LICENSE?raw";
import { ASSETS } from "./assets";
import { LIMITS, passages, SOURCE, sources, TEI_SOURCE } from "./content";
import { esc, gapDrawing, mapDrawing, measure, num } from "./drawing";
import ink from "./ink.css?inline";
import { query, type SurveyState, survey } from "./survey";

export function download(text: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export function surveySvg(s: SurveyState, narrow = false) {
  return mapDrawing(s, narrow, "saved-survey").replace(
    "<title",
    `<metadata>${esc(license)}</metadata><style>${esc(ink)}</style><title`,
  );
}
export function surveyCsv(s: SurveyState): string {
  const m = survey(s),
    rows: (number | string)[][] = [
      [
        "record",
        "id",
        "from",
        "to",
        "x_m",
        "y_m",
        "dx_m",
        "dy_m",
        "distance_m",
        "metric",
        "value",
        "unit",
      ],
    ];
  for (const p of m.stations)
    rows.push(["station", p.id, "", "", p.x, p.y, "", "", "", "", "", ""]);
  for (const [i, l] of m.legs.entries())
    rows.push(["leg", i + 1, l.from.id, l.to.id, "", "", l.dx, l.dy, l.length, "", "", ""]);
  for (const [key, value, unit] of [
    ["net_x", m.x, "m"],
    ["net_y", m.y, "m"],
    ["outside_walk", m.routeLength, "m"],
    ["ideal_tunnel_length", m.tunnelLength, "m"],
    ["outside_baseline", s.baseline, "m"],
    ["ideal_peg_rise", m.targetPegRise, "m"],
    ["chosen_peg_rise", m.chosenPegRise, "m"],
    ["chosen_aim_ratio", s.aim, "ratio"],
    ["peg_error", s.error, "mm"],
    ["affected_entrances", s.affected, "label"],
    ["middle_vertical_gap", m.gap, "m"],
    ["B_line_at_middle", m.bMiddle.y, "m"],
    ["D_line_at_middle", m.dMiddle.y, "m"],
    ["B_front_x", m.bEnd.x, "m"],
    ["B_front_y", m.bEnd.y, "m"],
    ["D_front_x", m.dEnd.x, "m"],
    ["D_front_y", m.dEnd.y, "m"],
    ["half_horizontal_span_extended", s.progress, "percent"],
  ] as const)
    rows.push(["measurement", "", "", "", "", "", "", "", "", key, value, unit]);
  return `${rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\r\n")}\r\n`;
}
async function verified(path: string) {
  const r = await fetch(`${import.meta.env.BASE_URL}${path}`);
  if (!r.ok)
    throw new Error(
      "A source or font is unavailable. Reconnect and try saving after the offline edition is complete.",
    );
  const b = new Uint8Array(await r.arrayBuffer()),
    hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", b)), (v) =>
      v.toString(16).padStart(2, "0"),
    ).join("");
  if (hash !== ASSETS[path])
    throw new Error(
      "A bundled source does not match this edition. Reload online before saving the reading.",
    );
  return b;
}
function base64(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 16384)
    s += String.fromCharCode(...bytes.subarray(i, i + 16384));
  return btoa(s);
}
export async function studyHtml(s: SurveyState) {
  const m = survey(s),
    files = new Map(
      await Promise.all(Object.keys(ASSETS).map(async (p) => [p, await verified(p)] as const)),
    );
  const bytes = (p: string) => {
    const b = files.get(p);
    if (!b) throw new Error(`Missing ${p}`);
    return b;
  };
  const data = (p: string, type: string) => `data:${type};base64,${base64(bytes(p))}`;
  const diagrams = [
    { title: "Your saved survey", state: s },
    {
      title: "The exact construction",
      state: { ...s, stage: 3, aim: m.correctAim, error: 0, progress: 100 },
    },
    { title: "Your sight lines at the middle station", state: { ...s, stage: 3, progress: 100 } },
  ];
  const notices = [
    "sources/NOTICES.txt",
    "sources/CC-BY-SA-4.0.txt",
    "fonts/NotoSerif-OFL.txt",
    "fonts/IBMPlex-OFL.txt",
  ]
    .map((p) => `<h3>${p}</h3><pre>${esc(new TextDecoder().decode(bytes(p)))}</pre>`)
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'"><title>Dioptra · Meet beneath the mountain</title><style>
@font-face{font-family:Noto;src:url('${data("fonts/NotoSerif-Regular.ttf", "font/ttf")}')}@font-face{font-family:Plex;src:url('${data("fonts/IBMPlexSans-Regular.woff2", "font/woff2")}');font-weight:400}@font-face{font-family:Plex;src:url('${data("fonts/IBMPlexSans-SemiBold.woff2", "font/woff2")}');font-weight:600}
*{box-sizing:border-box}body{max-width:1000px;margin:auto;padding:35px;font:16px/1.7 Plex,sans-serif;color:#223e4b;background:#edf3f3}h1,h2,h3,[lang=grc]{font-family:Noto,Georgia,serif;font-weight:400}h1{font-size:47px;line-height:1.15}h2{font-size:29px;line-height:1.35}h3{font-size:22px}a{color:#244e61}.meta,figcaption{font-size:13px}figure{margin:35px 0}svg{width:100%;display:block}img{display:block;max-width:100%;height:auto;margin:auto}.source{margin-top:45px}.source img{width:100%}.identity{font-size:11px;overflow-wrap:anywhere}section{margin:40px 0}table{width:100%;border-collapse:collapse;font-size:14px}th,td{border-bottom:1px solid #afc2c6;padding:10px;text-align:left}caption{text-align:left;font-size:13px;padding-bottom:12px}th{font-weight:600}.passage{padding:20px 0;border-top:1px solid #afc2c6}.greek{font-size:23px}.narrow{display:none}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px}.gap{max-width:400px;margin:auto}.table-scroll{overflow:auto}details{margin-top:25px}${ink}
@media(max-width:650px){body{padding:20px}h1{font-size:35px}.wide{display:none}.narrow{display:block}.greek{font-size:21px}th,td{font-size:12px;padding:8px 4px}}
@page{size:A4;margin:14mm}@media print{body{padding:0;font-size:10pt;background:white}h1{font-size:28pt}h2{font-size:19pt}h3{font-size:14pt}h2,h3{break-after:avoid}p{break-inside:avoid;orphans:3;widows:3}footer{break-inside:avoid}.wide{display:block}.narrow{display:none}.plan{break-inside:avoid}.plan svg{max-height:140mm}.passage{break-inside:avoid}.greek{font-size:12pt}.source{break-before:page;margin:0}.source img{max-height:200mm;width:auto}.source h2{font-size:15pt}.source figcaption{font-size:9pt}.licenses,.downloads{display:none}table{break-inside:avoid}.table-scroll{overflow:visible}}
</style></head><body><header><p class="meta">DIOPTRA / HERO OF ALEXANDRIA, CHAPTER 15</p><h1>Meet beneath<br>the mountain.</h1><p>Fixed portals, a chosen circuit, and two outside aiming triangles.</p><p class="meta"><a href="https://antonsoo.github.io/dioptra/${esc(query(s))}#field-book">Reopen these settings</a>. This file embeds its diagrams, fonts, eight readings and four source pages. Opening it makes no external requests.</p></header><main>
${diagrams.map((d, i) => `<figure class="plan"><figcaption><h2>${d.title}</h2></figcaption><div class="wide">${mapDrawing(d.state, false, `saved-wide-${i}`)}</div><div class="narrow">${mapDrawing(d.state, true, `saved-narrow-${i}`)}</div></figure>`).join("")}
<section><h2>The signed field book</h2><p>These are chosen modern metre lengths, not measurements from an ancient tunnel. The source's five-to-one ratio is an example; the two- and seven-to-one settings are modern exercises.</p><div class="table-scroll" role="region" aria-label="Measured circuit table" tabindex="0"><table><caption>Each measured leg, with its signed displacement</caption><thead><tr><th scope="col">Leg</th><th scope="col">Distance / m</th><th scope="col">x contribution / m</th><th scope="col">y contribution / m</th></tr></thead><tbody>${m.legs.map((l) => `<tr><th scope="row">${l.from.label}${l.to.label}</th><td>${num(l.length, 4)}</td><td>${num(l.dx, 4)}</td><td>${num(l.dy, 4)}</td></tr>`).join("")}<tr><th scope="row">Total</th><td>${num(m.routeLength)}</td><td>${num(m.x)}</td><td>${num(m.y)}</td></tr></tbody></table></div><p>Rightward ${num(m.east)} − leftward ${num(m.west)} = ${num(m.x)} m. Perpendicular net displacement: ${num(m.y)} m. These are plan directions, not elevation changes. The ideal hidden line has length ${num(m.tunnelLength, 4)} m.</p><p class="downloads"><a download="dioptra-survey.csv" href="data:text/csv;charset=utf-8,${esc(encodeURIComponent(surveyCsv(s)))}">Save the full coordinate and measurement CSV</a></p></section>
<section><h2>The aiming triangle</h2><p>ΒΝ : ΔΝ = ${num(m.x)} : ${num(m.y)} = ${num(m.x / m.y)} : 1. With an outside baseline of ${s.baseline} m, the ideal perpendicular is ${num(m.targetPegRise, 6)} m. Your chosen perpendicular is ${num(m.chosenPegRise, 6)} m.</p><p>The chosen error is ${s.error} mm at ${s.affected === "both" ? "both entrances" : `entrance ${s.affected === "B" ? "Β" : "Δ"}`}. Positive error moves a peg farther from its own baseline. At the middle cross-section, the Β line is at y = ${num(m.bMiddle.y, 6)} m and the Δ line at y = ${num(m.dMiddle.y, 6)} m; their vertical gap is ${measure(Math.abs(m.gap))}.</p><div class="gap">${gapDrawing(s, "saved-gap")}</div><p>The original proof assumes exact alignments. The peg displacement is a modern deterministic experiment, not an estimate of ancient accuracy. It changes only the aiming pegs, leaving the traverse exact. The separate gap detail has its own scale.</p></section>
<section><h2>Read the Greek</h2><p>Selected excerpts from Schöne's 1903 edition, adapted from the <a href="${TEI_SOURCE}">Harvard College Library / Open Greek and Latin digital transcription</a>. New English translation and grammar. Line-end hyphens and whitespace are joined, standard Δ replaces ∠, apostrophes are normalized, and line numbers and apparatus are omitted here. Angle brackets preserve editorial supplements. Greek selections and new teaching text: <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.</p>${passages.map((p, i) => `<article class="passage"><p class="meta">${p.ref}</p><h3>${i + 1}. ${p.title}</h3><p lang="grc" class="greek">${esc(p.greek)}</p><p>${esc(p.english)}</p><p><span lang="grc">${esc(p.word)}</span> · ${esc(p.gloss)}</p><p>${esc(p.grammar)}</p><p>${esc(p.action)}</p></article>`).join("")}</section>
<section><h2>Source decisions and limits</h2><p>${LIMITS} No claim is made that Eupalinos used this later-described method at Samos.</p><p>The printed construction establishes Μ as the closing perpendicular sight station on ΚΛ. Subsequent printed summation lists use ΚΛ and ΛΔ. The model sums the measured ΚΜ and ΜΔ, retaining the full printed pages so that the reading decision is inspectable. The figure places Ο outside Β, on the extended line ΒΕ; the model follows that exterior placement.</p><p>The mountain is a synthetic outline. Contour-like lines are decorative, not measured elevations. The extension control describes a fraction of each half's horizontal span, not elapsed time or equal drilling distances. The middle gap is vertical at that station, not the shortest separation of two infinite lines.</p></section>
${sources.map((p) => `<figure class="source"><figcaption><h2>${p.page} · ${p.title}</h2><p>${p.note} <a href="${SOURCE}/page/${p.page}/mode/1up">Source volume</a>.</p></figcaption><img src="${data(`sources/${p.file}`, "image/jpeg")}" alt="Schöne’s complete printed page ${p.page}: ${p.title}"><p class="identity">SHA-256 ${ASSETS[`sources/${p.file}`]}</p></figure>`).join("")}
</main><footer><p>Historical source pages: public domain. Greek transcription: Harvard College Library / Open Greek and Latin (2018), CC BY-SA 4.0. New translation and teaching text: Anton Soloviev, 2026, CC BY-SA 4.0. Code and new diagrams: MIT. Teaching-text license: <a href="https://creativecommons.org/licenses/by-sa/4.0/">creativecommons.org/licenses/by-sa/4.0/</a>.</p><details class="licenses"><summary>Complete licenses and redistribution notices</summary><h3>Code and new diagrams: MIT</h3><pre>${esc(license)}</pre>${notices}</details></footer></body></html>`;
}
