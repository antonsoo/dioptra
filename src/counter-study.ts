import license from "../LICENSE?raw";
import { SOURCE, TEI_SOURCE } from "./content";
import { COUNTER_ASSETS } from "./counter-assets";
import { COUNTER_BOUNDARY, counterPassages, counterSources } from "./counter-content";
import { counterDrawing, probeDrawing } from "./counter-drawing";
import ink from "./counter-ink.css?raw";
import {
  type CounterState,
  counter,
  counterCsv,
  counterFraction,
  counterQuery,
  counterNumber as f,
  normalizeCounter,
} from "./counter-model";
import { esc } from "./drawing";

export function counterSvg(s: CounterState): string {
  return counterDrawing(s, false, "saved-counter").replace(
    "<title",
    `<metadata>${esc(license)} ${esc(COUNTER_BOUNDARY)}</metadata><style>${esc(ink)}</style><title`,
  );
}
export function counterFullReading() {
  return counterPassages
    .map(
      (p, i) =>
        `<article class="ct-full-passage"><p class="meta">Dioptra 34 · ${p.ref}</p><h3>${i + 1}. ${p.title}</h3><p class="greek" lang="grc">${esc(p.greek)}</p><p>${esc(p.english)}</p><p><span lang="grc">${esc(p.word)}</span> · ${esc(p.gloss)}</p><p>${esc(p.note)}</p></article>`,
    )
    .join("");
}
export async function counterStudy(s: CounterState): Promise<string> {
  const frozen = normalizeCounter({ ...s });
  const m = counter(frozen);
  const observed = frozen.probe === frozen.trial;
  const files = new Map(
    await Promise.all(
      Object.entries(COUNTER_ASSETS).map(async ([p, expected]) => {
        const response = await fetch(`${import.meta.env.BASE_URL}${p}`);
        if (!response.ok)
          throw new Error("A source page or font is unavailable. Reconnect and try saving again.");
        const bytes = new Uint8Array(await response.arrayBuffer());
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (n) =>
          n.toString(16).padStart(2, "0"),
        ).join("");
        if (hash !== expected)
          throw new Error(
            "A source page or font does not match this edition. Reload online before saving the reading.",
          );
        return [p, bytes] as const;
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
  const checkpoints = [
    ...new Set([
      0,
      7,
      8,
      80,
      m.firstPeriod - 1,
      m.firstPeriod,
      m.period - 1,
      m.period,
      frozen.turns,
    ]),
  ].sort((a, b) => a - b);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; form-action 'none'"><title>Dioptra 34 · Count the teeth. Then measure.</title><style>
@font-face{font-family:"Survey Serif";src:url('${data("fonts/NotoSerif-Regular.ttf", "font/ttf")}')}@font-face{font-family:"Survey Sans";src:url('${data("fonts/IBMPlexSans-Regular.woff2", "font/woff2")}');font-weight:400}@font-face{font-family:"Survey Sans";src:url('${data("fonts/IBMPlexSans-SemiBold.woff2", "font/woff2")}');font-weight:600}
*{box-sizing:border-box}body{max-width:1000px;margin:auto;padding:35px;background:#f2f6f5;color:#223e4b;font:16px/1.7 "Survey Sans",sans-serif}h1,h2,h3,[lang=grc]{font-family:"Survey Serif",serif;font-weight:400}h1{font-size:54px;line-height:1.15}h2{font-size:32px;line-height:1.3}h3{font-size:24px;line-height:1.4}a{color:inherit;text-underline-offset:3px}.meta{font-size:12px}.greek{font-size:23px;line-height:1.9}section{margin:42px 0}.ct-full-passage{border-top:1px solid #a9bdc3;padding:18px 0}.plates{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center}.probe{max-width:310px;margin:auto}.table-scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;border-bottom:1px solid #a9bdc3;padding:11px 12px 11px 0}caption{text-align:left;margin-bottom:15px}img{display:block;max-width:100%;height:auto}.source{margin:40px 0}figcaption{font-size:13px}.identity,pre{font-size:11px;overflow-wrap:anywhere}pre{white-space:pre-wrap}.wide{display:block}.narrow{display:none}${ink}
@media(max-width:650px){body{padding:20px}h1{font-size:38px}.plates{grid-template-columns:1fr}.greek{font-size:21px}.wide{display:none}.narrow{display:block;max-width:340px;margin:auto}th,td{font-size:12px;padding:8px 10px 8px 0}}
@page{size:A4;margin:14mm}@media print{body{padding:0;background:white;font-size:10pt}h1{font-size:31pt}h2{font-size:20pt}h3{font-size:14pt}h2,h3{break-after:avoid}.greek{font-size:12pt}.wide{display:block}.narrow{display:none}.plates{grid-template-columns:1fr 1fr;break-inside:avoid}.probe{width:60mm}.ct-full-passage{break-inside:avoid}.table-scroll{overflow:visible}table{font-size:9pt}p{orphans:3;widows:3}.source{break-before:page;margin:0}.source img{max-height:212mm;width:auto;margin:auto}.source h2{font-size:15pt}.source figcaption{font-size:9pt}.download,.licenses{display:none}}
</style></head><body><header><p class="meta">DIOPTRA / HERO OF ALEXANDRIA / CHAPTER 34</p><h1>Count the teeth.<br>Then measure.</h1><p lang="grc" class="greek">ἡμεῖς τῇ πείρᾳ ἐπιστρέφομεν</p><p>“We turn it by trial.” A theoretical tooth count is not yet a calibrated distance scale.</p><p class="meta"><a href="https://antonsoo.github.io/dioptra/counter.html${esc(counterQuery(frozen))}#ct-workshop">Reopen this experiment</a>. The file contains its diagrams, fourteen Greek-and-English readings, twelve complete source pages, fonts and licenses. No scripts or automatic remote requests.</p></header><main>
<section><h2>Your saved instrument reading</h2><p>Road-wheel turns: <strong>${f(frozen.turns)}</strong>. First reduction: ${frozen.trial} shaft turns per output revolution (${frozen.trial === 24 ? "modern additional trial" : frozen.trial === 20 ? "the source’s worked trial" : "the source’s ideal theoretical case"}). First-stage graduation: <strong>${frozen.calibrated ? "measured" : "theoretical"}</strong>. The second reduction stays at its assumed thirty-to-one ratio.</p><div class="wide">${counterDrawing(frozen, false, "study-wide")}</div><div class="narrow">${counterDrawing(frozen, true, "study-narrow")}</div><p>Read ${m.coarse} completed first-dial revolutions from the second dial, then ${f(m.firstTick)} fine divisions from the first. Each fine division is labelled ${counterFraction(frozen.calibrated ? frozen.trial * 8 : 240, 3)} cubits. The dials indicate <strong>${f(m.indicated)} cubits (${f(m.indicated / 400)} stadia)</strong> within the current circuit.</p><p>The outside ledger contains <strong>${f(m.ledger)} cubits</strong>, including ${m.wraps} complete instrument ${m.wraps === 1 ? "circuit" : "circuits"} of ${f(m.period * 10)} cubits each, plus ${f(m.actualRemainder)} cubits. The ledger is a modern observer’s record. Both pointers return to zero after a complete circuit; the instrument cannot recover that lost count from their positions.</p><p>${esc(COUNTER_BOUNDARY)}</p></section>
<section><h2>Your calibration record</h2><div class="plates"><div class="probe">${probeDrawing(frozen, "study-probe")}</div><div><p>The first worm has been turned <strong>${frozen.probe} times</strong> in this trial.</p>${observed ? `<p>One complete output revolution was reached after ${frozen.probe} shaft turns. These represent ${frozen.probe} × 8 = ${frozen.probe * 8} wheel turns, or ${frozen.probe * 80} source cubits.</p><p>Divide by the thirty output divisions: <strong>${counterFraction(frozen.probe * 80, 30)} cubits per division</strong>.</p>` : "<p>The trial is unfinished. No measured graduation has been applied. A complete output revolution is the stopping condition; counting only part of it does not complete Hero’s procedure.</p>"}</div></div><div class="table-scroll"><table><caption>The same fifteen fine divisions, without a completed circuit</caption><thead><tr><th scope="col">Basis</th><th scope="col">Cubits per division</th><th scope="col">Journey</th></tr></thead><tbody><tr><th scope="row">Theoretical thirty turns</th><td>80</td><td>1,200 cubits · 3 stadia</td></tr><tr><th scope="row">${observed ? `Observed ${frozen.probe} turns` : "Trial not completed"}</th><td>${observed ? counterFraction(frozen.probe * 80, 30) : "Not established"}</td><td>${observed ? `${frozen.probe * 40} cubits · ${f(frozen.probe / 10)} stadia` : "Not established"}</td></tr></tbody></table></div><p>At Hero’s worked twenty-turn trial, the old scale overreads by fifty percent. The pointer has not changed when the correct 53 1/3-cubit graduation replaces the theoretical 80-cubit graduation. The text asks the operator to perform the corresponding calculation for the other wheels as well. Only the first reduction is tested here.</p></section>
<section><h2>Follow the carries</h2><div class="table-scroll"><table><caption>Selected events for this trial; indicated distance uses the saved graduation</caption><thead><tr><th scope="col">Wheel turns</th><th scope="col">Fine divisions</th><th scope="col">Coarse divisions</th><th scope="col">Dial cubits</th><th scope="col">Ledger cubits</th><th scope="col">Full circuits</th></tr></thead><tbody>${checkpoints
    .map((turns) => {
      const r = counter({ ...frozen, turns });
      return `<tr><th scope="row">${f(turns)}</th><td>${f(r.firstTick)}</td><td>${f(r.secondTick)}</td><td>${f(r.indicated)}</td><td>${f(r.ledger)}</td><td>${r.wraps}</td></tr>`;
    })
    .join(
      "",
    )}</tbody></table></div><p>The second pointer moves through the first dial’s revolution count. Only its completed divisions supply the coarse count; adding both fractional readings would count the fine portion twice. At the complete circuit, both pointers return to zero while the outside ledger continues.</p><p class="download"><a download="dioptra-counter.csv" href="data:text/csv;charset=utf-8,${esc(encodeURIComponent(counterCsv(frozen)))}">Save the included checkpoint CSV</a></p></section>
<section><h2>Read the argument in fourteen selections</h2><p>Greek adapted from the <a href="${TEI_SOURCE}">Harvard College Library / Open Greek and Latin digital transcription</a>, with new English and contextual language notes. These selections are not a transcription of the entire chapter. The complete Greek and facing German remain in the twelve source pages below.</p>${counterFullReading()}</section>
<section><h2>Keep the assumptions visible</h2><p>The source supplies the eight-to-one input, theoretical thirty-to-one worm reductions, ten-cubit wheel circumference, twenty-turn calibration example, 53 1/3-cubit graduation and fifteen-tooth / two-stadia reading. Its 800-cubits / two-stadia equivalence gives the 400-cubits-per-stadion convention used here. No modern unit conversion is assumed.</p><p>The source’s εἰ τύχοι marks a supposed worked example, not an authenticated measurement from an excavated device. The twenty-turn ratio is modelled by a uniform average motion; the text supplies no tooth profile or physical diagnosis for it. The modern 24-turn trial demonstrates the same method on another ratio. No friction, backlash, slip, reversing motion, manufacturing precision or mechanism durability is simulated.</p><p>The source has a gap in its initial box construction on p. 292. We do not fill it with a supposed ancient drawing. The unfolded diagram makes the later stated ratios visible. The edition’s explanatory cutaway (figure 114, p. 295) has more reduction stages and is retained in full; it is not an archaeological drawing. The text places some pointers on the sides and some on the lid; this flat arrangement is a teaching view. A larger dial separates its marks without proving greater accuracy. Between-division pointer values are model interpolation.</p><p>Selections join whitespace and line endings and omit apparatus, line numbers and intervening text. Digital τύμπανυν at p. 298 remains visible beside the note identifying printed τύμπανον. Greek numerals are interpreted in their context, including the final unit-fraction gamma. Marginal page 312 belongs to an earlier edition; the calibration’s Schöne printed page is 298. Full-page scans preserve all apparatus and editorial marks.</p></section>
${counterSources.map((p) => `<figure class="source"><figcaption><h2>${p.page} · ${esc(p.title)}</h2><p>Hermann Schöne, <cite>Herons von Alexandria Vermessungslehre und Dioptra</cite> (Teubner, Leipzig, 1903). <a href="${SOURCE}/page/n${p.page + 15}/mode/1up">Original scan leaf</a>.</p></figcaption><img src="${data(`sources/${p.file}`, "image/jpeg")}" alt="Complete Schöne printed page ${p.page}"><p class="identity">SHA-256 ${COUNTER_ASSETS[`sources/${p.file}`]}</p></figure>`).join("")}
</main><footer><p>Code and new diagrams: Anton Soloviev, 2026, MIT. Digital Greek: Harvard College Library / Open Greek and Latin, 2018, CC BY-SA 4.0. New English, language notes and teaching text: Anton Soloviev, 2026, CC BY-SA 4.0. Historical pages: public domain.</p><details class="licenses"><summary>Complete licenses and redistribution notices</summary><h3>Code and diagrams</h3><pre>${esc(license)}</pre>${["sources/NOTICES.txt", "sources/CC-BY-SA-4.0.txt", "fonts/NotoSerif-OFL.txt", "fonts/IBMPlex-OFL.txt"].map((p) => `<h3>${p}</h3><pre>${esc(new TextDecoder().decode(bytes(p)))}</pre>`).join("")}</details></footer></body></html>`;
}
