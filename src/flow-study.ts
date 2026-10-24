import license from "../LICENSE?raw";
import { SOURCE, TEI_SOURCE } from "./content";
import { esc } from "./drawing";
import { FLOW_ASSETS } from "./flow-assets";
import { FLOW_BOUNDARY, flowPassages, flowSources } from "./flow-content";
import { FLOW_INK, flowCsv, flowPlot, receiverDrawing } from "./flow-drawing";
import {
  type FlowState,
  flowNumber as f,
  flowArea,
  flowQuery,
  flowVolume,
  flowWindow,
} from "./flow-model";

export function flowAccount(s: FlowState) {
  const w = flowWindow(s);
  return `<table><caption>Selected interval: ${w.start}–${w.end} s. Volume divided by elapsed time gives an interval average.</caption><thead><tr><th scope="col">Stream</th><th scope="col">Start / L</th><th scope="col">End / L</th><th scope="col">Collected / L</th><th scope="col">Average / L/s</th></tr></thead><tbody>${w.streams.map((r) => `<tr><th scope="row">${r.stream}</th><td>${f(r.before)}</td><td>${f(r.after)}</td><td>${f(r.volume)}</td><td>${f(r.average)}</td></tr>`).join("")}</tbody></table>`;
}
export function flowFullReading() {
  return flowPassages
    .map(
      (p, i) =>
        `<article class="fl-full-passage"><p class="meta">Dioptra 31 · ${p.ref}</p><h3>${i + 1}. ${p.title}</h3><p lang="grc" class="greek">${esc(p.greek)}</p><p>${esc(p.english)}</p><p><span lang="grc">${esc(p.word)}</span> · ${esc(p.gloss)}</p><p>${esc(p.note)}</p></article>`,
    )
    .join("");
}
export async function flowStudy(s: FlowState) {
  const frozen = { ...s };
  const files = new Map(
    await Promise.all(
      Object.entries(FLOW_ASSETS).map(async ([p, expected]) => {
        const response = await fetch(`${import.meta.env.BASE_URL}${p}`);
        if (!response.ok)
          throw new Error("A bundled source is unavailable. Reconnect and try again.");
        const b = new Uint8Array(await response.arrayBuffer());
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", b)), (n) =>
          n.toString(16).padStart(2, "0"),
        ).join("");
        if (hash !== expected)
          throw new Error(
            "A source or font does not match this edition. Reload online before saving.",
          );
        return [p, b] as const;
      }),
    ),
  );
  const bytes = (p: string) => {
    const b = files.get(p);
    if (!b) throw new Error(`Missing ${p}`);
    return b;
  };
  const data = (p: string, type: string) => {
    const b = bytes(p);
    let binary = "";
    for (let i = 0; i < b.length; i += 16384)
      binary += String.fromCharCode(...b.subarray(i, i + 16384));
    return `data:${type};base64,${btoa(binary)}`;
  };
  const w = flowWindow(frozen),
    b = w.streams[1];
  if (!b) throw new Error("Missing B");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'"><title>Dioptra 31 · Water needs a clock</title><style>
@font-face{font-family:Noto;src:url('${data("fonts/NotoSerif-Regular.ttf", "font/ttf")}')}@font-face{font-family:Plex;src:url('${data("fonts/IBMPlexSans-Regular.woff2", "font/woff2")}');font-weight:400}@font-face{font-family:Plex;src:url('${data("fonts/IBMPlexSans-SemiBold.woff2", "font/woff2")}');font-weight:600}
*{box-sizing:border-box}body{max-width:980px;margin:auto;padding:35px;color:#223e4b;background:#f2f6f5;font:16px/1.65 Plex,sans-serif}h1,h2,h3,[lang=grc]{font-family:Noto,serif;font-weight:400}h1{font-size:50px;line-height:1.15}h2{font-size:30px;line-height:1.3}h3{font-size:23px}.greek{font-size:23px;line-height:1.8}a{color:inherit}.meta,figcaption{font-size:13px}.plates{display:grid;grid-template-columns:1fr 1fr;gap:20px}.plot{max-width:520px;margin:auto}section{margin:40px 0}.fl-full-passage{border-top:1px solid #a9bdc3;padding:20px 0}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:10px 7px;border-bottom:1px solid #a9bdc3}caption{text-align:left;margin-bottom:12px}.table-scroll{overflow:auto}img{display:block;max-width:100%;height:auto;margin:auto}.source{margin:40px 0}.source img{width:100%}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px}.identity{font-size:11px;overflow-wrap:anywhere}${FLOW_INK}
@media(max-width:650px){body{padding:20px}h1{font-size:37px}.plates{grid-template-columns:1fr}.greek{font-size:21px}th,td{font-size:12px;padding:8px 4px}}
@page{size:A4;margin:14mm}@media print{body{padding:0;background:white;font-size:10pt}h1{font-size:29pt}h2{font-size:18pt}h3{font-size:14pt}h2,h3{break-after:avoid}.greek{font-size:12pt}.plates{grid-template-columns:1fr 1fr;break-inside:avoid}.plot{width:100mm}.fl-full-passage,table{break-inside:avoid}.table-scroll{overflow:visible}p{orphans:3;widows:3}.source{break-before:page;margin:0}.source img{max-height:210mm;width:auto}.source h2{font-size:15pt}.source figcaption{font-size:9pt}.licenses,.download{display:none}}
</style></head><body><header><p class="meta">DIOPTRA / HERO OF ALEXANDRIA, CHAPTER 31</p><h1>Water needs<br>a clock.</h1><p>Equal sections can deliver unequal supplies. A short observation can misrepresent a changing flow.</p><p class="meta"><a href="https://antonsoo.github.io/dioptra/flow.html${esc(flowQuery(frozen))}">Reopen these settings</a>. This file embeds its diagrams, full chapter reading, four printed pages, fonts and licenses. It makes no external subresource requests.</p></header><main><section><h2>The collection experiment</h2><p>Both wetted sections are ${s.width} × ${s.depth} cm, area ${flowArea(s)} cm². A travels at ${s.speedA} cm/s. B ${s.variable ? `travels at ${s.speedB} cm/s for the first ten seconds, then ${s.speedA} cm/s` : `travels at ${s.speedB} cm/s throughout`}. The saved frame is ${f(s.time)} s.</p><div class="plates">${receiverDrawing(frozen, "A", "saved-a")}${receiverDrawing(frozen, "B", "saved-b")}</div><p>${FLOW_BOUNDARY}</p><p>For the uniform mean speeds used here, supply = wetted area × mean speed. A litre is 1,000 cm³. The modern equation explains the experiment; the chapter gives no algebraic discharge formula.</p></section>
<section><h2>Measure an interval</h2><div class="plot">${flowPlot(frozen, "saved-plot")}</div><p>Blue: A. Green: B. Dashed ochre: B’s selected average extended from an empty receiver to twenty seconds. Shading marks the measured window; the dotted vertical line marks the saved replay frame.</p><div class="table-scroll">${flowAccount(frozen)}</div><p>The selected B average is ${f(b.volume)} L ÷ ${w.duration} s = ${f(b.average)} L/s. Applied to the whole twenty seconds, it predicts ${f(b.extrapolated)} L. The complete record contains ${f(b.actual)} L. Difference: ${f(b.extrapolated - b.actual)} L.</p><p>A short interval measures its own average. Extending it requires the flow to remain representative. The whole record’s average remains valid even when the instantaneous speed changes. At the exact ten-second switch, the displayed current speed is the speed after the change; cumulative volume remains continuous.</p><p class="download"><a download="dioptra-flow.csv" href="data:text/csv;charset=utf-8,${esc(encodeURIComponent(flowCsv(frozen)))}">Save the complete one-second record and interval CSV</a></p><table><caption>Five checkpoints from the full twenty-second record</caption><thead><tr><th scope="col">Time / s</th><th scope="col">A / L</th><th scope="col">B / L</th></tr></thead><tbody>${[0, 5, 10, 15, 20].map((t) => `<tr><th scope="row">${t}</th><td>${f(flowVolume(frozen, "A", t))}</td><td>${f(flowVolume(frozen, "B", t))}</td></tr>`).join("")}</tbody></table></section>
<section><h2>Read the complete chapter</h2><p>Eleven units from Schöne’s edited chapter 31; Greek adapted from the <a href="${TEI_SOURCE}">Harvard College Library / Open Greek and Latin transcription</a>, with a new English translation and language notes. Greek and new teaching text: CC BY-SA 4.0. The 1903 German translation is retained in the facing scans.</p>${flowFullReading()}</section>
<section><h2>What the evidence does and does not say</h2><p>The source example multiplies two finger-widths by six. It then calls the result twelve fingers. The product is a section, not a supply per time. No fixed finger-to-centimetre conversion is used here. The source names a sundial and an interval, without a numerical duration; our modern seconds do not reconstruct its hours.</p><p>The printed text reads τάχος, speed, while the apparatus records τὸ πάχος, thickness, at p. 286, lines 9–10. The model follows the edited text and its faster/slower comparison. Schöne relocates the twelve-finger conclusion into angle brackets and deletes its duplicate at the end. These are editorial decisions, not invisible repairs.</p><p>Line-end hyphens and whitespace are joined; apparatus, line numbers and deleted letters are omitted in the reading. The digital duplicate “μενον” after στοχασάμενον is removed following the page; ὀρῶν follows the printed mountain word. The full scans retain all editorial marks. The language notes distinguish interpretation from literal wording.</p><p>Collection is exact and complete in the model. Receiver shape, scale and centimetre dimensions are teaching choices. There is no pressure, friction, rainfall, leakage or instrument-error simulation. The chapter’s rain discussion motivates asking whether supply changes; it supplies no ten-second switching schedule.</p></section>
${flowSources.map((p) => `<figure class="source"><figcaption><h2>${p.page} · ${p.title}</h2><p>${p.note} <a href="${SOURCE}/page/${p.page}/mode/1up">Source volume</a>.</p></figcaption><img src="${data(`sources/schone-${p.page}.jpg`, "image/jpeg")}" alt="Complete Schöne printed page ${p.page}"><p class="identity">SHA-256 ${FLOW_ASSETS[`sources/schone-${p.page}.jpg`]}</p></figure>`).join("")}
</main><footer><p>Historical pages: public domain. Digital Greek: Harvard College Library / Open Greek and Latin, 2018, CC BY-SA 4.0. New English and teaching text: Anton Soloviev, 2026, CC BY-SA 4.0. Code and new diagrams: MIT.</p><details class="licenses"><summary>Complete licenses and credits</summary><h3>Code and diagrams</h3><pre>${esc(license)}</pre>${["sources/NOTICES.txt", "sources/CC-BY-SA-4.0.txt", "fonts/NotoSerif-OFL.txt", "fonts/IBMPlex-OFL.txt"].map((p) => `<h3>${p}</h3><pre>${esc(new TextDecoder().decode(bytes(p)))}</pre>`).join("")}</details></footer></body></html>`;
}
