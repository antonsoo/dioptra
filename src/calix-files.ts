import license from "../LICENSE?raw";
import { CALIX_ASSETS } from "./calix-assets";
import {
  CALIX_LIMITS,
  CALIX_PHYSICS,
  calixPages,
  calixPassages,
  FRONTINUS_ENGLISH,
  FRONTINUS_LATIN,
  FRONTINUS_SOURCE,
} from "./calix-content";
import { CALIX_INK, calixBores, calixRig, calixTable, decimal, html } from "./calix-drawing";
import { type CalixState, calixCSV, calixModel, calixQuery, exactText } from "./calix-model";

export async function verifiedCalix(path: string): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(`${import.meta.env.BASE_URL}${path}`);
  if (!response.ok)
    throw Error(
      "A source or font is unavailable. Reconnect or wait for the complete offline edition, then try again.",
    );
  const bytes = new Uint8Array(await response.arrayBuffer());
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
  if (!CALIX_ASSETS[path] || digest !== CALIX_ASSETS[path])
    throw Error(
      "A source or font does not match this edition. No substituted reading has been saved. Reload online and try again.",
    );
  return bytes;
}
export function base64Calix(bytes: Uint8Array): string {
  let value = "";
  for (let i = 0; i < bytes.length; i += 16384)
    value += String.fromCharCode(...bytes.subarray(i, i + 16384));
  return btoa(value);
}
export async function calixStudy(s: CalixState): Promise<string> {
  const files = new Map(
    await Promise.all(
      Object.keys(CALIX_ASSETS).map(async (p) => [p, await verifiedCalix(p)] as const),
    ),
  );
  const bytes = (p: string): Uint8Array => {
    const b = files.get(p);
    if (!b) throw Error(`Missing ${p}`);
    return b;
  };
  const data = (p: string, t: string): string => `data:${t};base64,${base64Calix(bytes(p))}`;
  const m = calixModel(s);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'"><title>Dioptra · Double the bore, four times the opening</title><style>
@font-face{font-family:SurveySerif;src:url('${data("fonts/NotoSerif-Regular.ttf", "font/ttf")}')}@font-face{font-family:Plex;src:url('${data("fonts/IBMPlexSans-Regular.woff2", "font/woff2")}');font-weight:400}@font-face{font-family:Plex;src:url('${data("fonts/IBMPlexSans-SemiBold.woff2", "font/woff2")}');font-weight:600}
*{box-sizing:border-box}body{max-width:1040px;margin:auto;padding:35px;color:#223e4b;background:#f2f6f5;font:16px/1.65 Plex,sans-serif}h1,h2,h3,[lang=la]{font-family:SurveySerif,Georgia,serif;font-weight:400}h1{font-size:44px;line-height:1.15}h2{font-size:29px;line-height:1.35}h3{font-size:22px}a{color:inherit}section,figure{margin:36px 0}svg{width:100%;display:block}img{max-width:100%;height:auto;display:block;margin:auto}.plates{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:30px}.latin{font-size:23px}.reading{border-top:1px solid #a9bdc3;padding:20px 0}.meta,figcaption{font-size:13px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid #a9bdc3;text-align:left;padding:8px}caption{text-align:left}.table-scroll{overflow:auto}.identity{font-size:10px;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px}.source{margin-top:45px}${CALIX_INK}
@media(max-width:650px){body{padding:20px}h1{font-size:34px}.plates{display:block}.latin{font-size:21px}}@page{size:A4;margin:14mm}@media print{body{padding:0;background:white;font-size:10pt}h1{font-size:29pt}h2{font-size:19pt}h3{font-size:14pt}.plates{display:grid;break-inside:avoid}.plates svg{max-height:110mm}.reading{break-inside:avoid}.latin{font-size:12pt}.source{break-before:page;margin:0}.source img{max-height:205mm;width:auto}.source h2{font-size:15pt}.source p{font-size:9pt}.licenses,.downloads{display:none}.table-scroll{overflow:visible}table{font-size:8pt}th,td{padding:5px}h2,h3{break-after:avoid}p{orphans:3;widows:3}}
</style></head><body><header><p class="meta">DIOPTRA / FRONTINUS, DE AQUIS I.25–28, 35–36, 43</p><h1>Double the bore.<br>Four times the opening.</h1><p>A Roman diameter name, a circular area, and a separate question about delivery.</p><p class="meta"><a href="https://antonsoo.github.io/dioptra/calix.html?${html(calixQuery(s))}#cx-workshop">Reopen these settings and the trial book</a>. This script-free file embeds six full source pages, nine readings, diagrams, your trial book, three fonts and complete licenses. It makes no external subresource requests.</p></header><main>
<section><h2>Your ideal-opening comparison</h2><p>One reference opening has diameter 5/4 source digits and head 16 chosen units. Your ${s.count} opening${s.count === 1 ? "" : "s"} each have diameter ${exactText(m.diameter)} source digits and head ${s.head}. Area ratio ${exactText(m.areaRatio)}; head ratio ${exactText(m.headRatio)}; relative delivery ${decimal(m.flowRatio)}. Over ${s.duration} chosen time units the relative volumes are ${decimal(m.referenceVolume)} and ${decimal(m.comparisonVolume)}.</p><div class="plates"><figure>${calixBores(s, "study-bores")}<figcaption>Common length scale. Separate circles compare areas; they do not show circle packing.</figcaption></figure><figure>${calixRig(s, 1, "study-rig")}<figcaption>Constant heads, common coefficient, no pipe losses. The two collection bars use a shared linear scale. The visible reservoir widths do not define those heads or volumes.</figcaption></figure></div><p>For circular openings A/A₀ = count × (D/D₀)². The modern ideal-orifice relation Q = C A √(2gh) gives Q/Q₀ = (A/A₀) √(h/h₀) when C and g are common. Squared flow ratio: ${exactText(m.flowSquared)} exactly. Displayed square roots are rounded.</p><p>${html(CALIX_LIMITS)}</p><p><a href="${CALIX_PHYSICS}">Modern physical derivation: OpenStax, Bernoulli’s equation</a>.</p></section>
<section><h2>The recorded trial book</h2>${s.trials.length ? `<div class="table-scroll" role="region" tabindex="0" aria-label="Recorded predictions; scroll if needed">${calixTable(s.trials)}</div>` : "<p>No trials were recorded. The current setup is retained above.</p>"}<p>These are computed predictions, not observations of ancient equipment. Time and relative-volume units are chosen and have no conversion to seconds or litres.</p><p class="downloads"><a download="dioptra-calix-trials.csv" href="data:text/csv;charset=utf-8,${html(encodeURIComponent(calixCSV(s)))}">Save the trial book CSV</a></p></section>
<section><h2>Nine selected Latin readings</h2><p>Latin follows Bücheler’s 1858 printed edition, with joined line endings, editorial apparatus omitted from the excerpt, and u/v spelling retained. I.43 explicitly omits circumference figures with an ellipsis. English translations and language notes are new teaching aids. These are selections, not a complete transcription. Full printed pages preserve the apparatus and context.</p>${calixPassages.map((p, i) => `<article class="reading"><p class="meta">Frontinus ${p.ref} · printed p. ${p.page}</p><h3>${i + 1}. ${html(p.title)}</h3><p class="latin" lang="la">${html(p.latin)}</p><p>${html(p.english)}</p>${p.words.map((w) => `<p><b lang="la">${html(w.word)}</b> · ${html(w.gloss)}. ${html(w.note)}</p>`).join("")}<p>${html(p.note)}</p></article>`).join("")}</section>
<section><h2>Read the qualification beside the number</h2><p>The ten-pipe in I.43 has a diameter twice that of the quinaria and a reported capacity of four quinariae. Equal circular area does not establish equal real delivery at different pressures, lengths or intake arrangements. Frontinus himself discusses height, pressure and route in I.35 and a bronze calix at least twelve digits long in I.36. Our ideal opening has no modeled tube length.</p><p>For the separate four-opening example, four equal small areas sum to one area four times as large. That is an area equality, not a claim that four circles fit inside a circle twice their diameter. The name-to-diameter series is limited here to five through ten quarter-digits; the source uses another naming scheme for larger pipes. The capacity table contains editorially disputed fractions. This experiment does not silently repair them or make every edited figure conform to modern geometry.</p><p><a href="${FRONTINUS_LATIN}">Compare the Latin Library transcription</a> and <a href="${FRONTINUS_ENGLISH}">Bennett’s 1925 English translation</a>. Our retained printed witness is <a href="${FRONTINUS_SOURCE}">Bücheler, Leipzig: B. G. Teubner, 1858</a>.</p><p>Continue with <a href="https://antonsoo.github.io/dioptra/flow.html#fl-reading">Hero’s Greek argument about collecting water and observing time</a>. This is a comparison of two texts, not a claim that one formula appears in either ancient source.</p></section>
${calixPages.map((p) => `<figure class="source"><figcaption><h2>${p.page === "title" ? "Title page" : `Printed p. ${p.page}`} · ${html(p.title)}</h2><p>Complete uncropped page · PDF page ${p.pdf}, archive leaf ${p.leaf}. <a href="${FRONTINUS_SOURCE}/page/n${p.leaf}/mode/1up">Source volume at this leaf</a>.</p></figcaption><img src="${data(`sources/frontinus/${p.file}`, "image/jpeg")}" alt="Bücheler 1858, ${p.page}: ${html(p.title)}"><p class="identity">SHA-256 ${CALIX_ASSETS[`sources/frontinus/${p.file}`]}</p></figure>`).join("")}
</main><footer><p>Frontinus Latin and historical scans: public domain. New English translation and teaching text: Anton Soloviev, 2026, CC BY-SA 4.0. Code and new diagrams: MIT. Fonts: SIL Open Font License 1.1.</p><details class="licenses"><summary>Complete licenses and source identities</summary><h3>MIT</h3><pre>${html(license)}</pre>${["sources/frontinus/NOTICES.txt", "sources/frontinus/manifest.json", "sources/CC-BY-SA-4.0.txt", "fonts/NotoSerif-OFL.txt", "fonts/IBMPlex-OFL.txt"].map((p) => `<h3>${html(p)}</h3><pre>${html(new TextDecoder().decode(bytes(p)))}</pre>`).join("")}</details></footer></body></html>`;
}
