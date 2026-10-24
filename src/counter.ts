import { SOURCE, TEI_SOURCE } from "./content";
import { COUNTER_BOUNDARY, counterPassages, counterSources } from "./counter-content";
import { counterDrawing, probeDrawing } from "./counter-drawing";
import {
  type CounterState,
  counter,
  counterCsv,
  counterFraction,
  counterQuery,
  counterNumber as f,
  normalizeCounter,
  parseCounter,
  type Trial,
} from "./counter-model";
import { counterStudy, counterSvg } from "./counter-study";
import { download } from "./files";
import { offlineStatus } from "./offline";

const app = document.getElementById("app");
if (!app) throw new Error("Missing app");
let parsed = parseCounter(location.search);
let state = parsed.state;
const compact = matchMedia("(max-width:650px)");
let playing = false;
let frame = 0;
let sourcePage = 0;
app.innerHTML = `<a class="skip" href="#ct-workshop">Skip to the instrument</a>
<header class="masthead"><a class="wordmark" href="./">Dioptra <span lang="grc">διόπτρα</span></a><nav aria-label="Main"><a href="./">15 · Tunnel</a><a href="./flow.html">31 · Water</a><a href="#ct-calibration">Make the trial</a><a href="#ct-reading">Read the Greek</a><a href="#ct-save">Keep the study</a></nav></header>
<main><section class="opening ct-opening"><div><p class="eyebrow">HERO OF ALEXANDRIA / DIOPTRA 34 / A DISTANCE COUNTER</p><h1>Count the teeth.<br>Then measure.</h1></div><div class="opening-note ct-quote"><p lang="grc">ἡμεῖς τῇ πείρᾳ ἐπιστρέφομεν</p><p>“We turn it by trial.” Hero describes a ratio, then asks the reader to measure it. A thirty-tooth wheel need not take thirty turns of its driving worm to go round.</p><a href="#ct-calibration">Turn the shaft. Write a better scale. ↓</a></div></section>
<section id="ct-workshop" aria-labelledby="ct-workshop-title"><div class="section-head"><div><p class="eyebrow">01 / Two pointers, one journey</p><h2 id="ct-workshop-title">The position is observable.<br>The distance needs a scale.</h2></div><p>One road-wheel turn advances the eight-pin drum by one position. Its shaft drives the first worm. A second reduction extends the range. Read the pointers, then test the graduation they have been given.</p></div><p id="ct-adjusted" class="ct-adjusted" role="status" hidden>Some shared settings were outside this experiment. Bounded values are shown; an uncompleted trial cannot apply a measured scale.</p>
<div class="ct-board"><div class="ct-board-heading"><strong id="ct-mode"></strong><span>Unfolded ratio diagram · arrows are transmission, not tooth geometry</span></div><div id="ct-mechanism" class="ct-drawing"></div><div class="ct-control-row"><div><label for="ct-turns">Completed road-wheel turns <output id="ct-turns-value" for="ct-turns"></output></label><input id="ct-turns" type="range" min="0" max="7200" step="1"><div class="ct-actions"><button id="ct-back" type="button">−1 wheel turn</button><button id="ct-forward" type="button">+1 wheel turn</button><button id="ct-eight" type="button">+8 wheel turns</button></div></div><div><p class="small">The road wheel’s circumference is ten source cubits. Rolling is exact in this model. The fine pointer is interpolated between divisions; the source does not establish that reading precision.</p><button id="ct-to-trial" type="button" class="text-button">The first scale looks plausible. Test it ↓</button><div><button id="ct-cutaway" type="button" class="text-button">See the edition’s cutaway · p. 295 ↓</button></div></div></div>
<div class="ct-tally ct-number"><div><h3>Read the instrument</h3><p class="ct-distance" id="ct-indicated"></p><p id="ct-combination"></p><p id="ct-error" class="small"></p></div><div><h3>Keep an outside ledger</h3><p class="ct-distance" id="ct-ledger"></p><p id="ct-wraps"></p><p class="small">This ledger is an observer’s record, not a hidden part of the instrument. After a complete circuit the dials cannot distinguish the new journey from zero.</p></div></div>
<div class="ct-presets"><span class="eyebrow">Inspect an event</span><div class="ct-actions"><button type="button" data-scene="example">Fifteen divisions</button><button type="button" data-scene="before">Before the first carry</button><button type="button" data-scene="carry">At the first carry</button><button type="button" data-scene="wrap">A complete instrument circuit</button><button type="button" data-scene="theory">Hero’s ideal 180 stadia</button></div></div></div><p class="small ct-boundary">${COUNTER_BOUNDARY}</p></section>
<section id="ct-calibration" aria-labelledby="ct-calibration-title"><div class="section-head"><div><p class="eyebrow">02 / Observe one complete output revolution</p><h2 id="ct-calibration-title">A tooth count is<br>not a calibration.</h2></div><p>The text’s worked trial takes twenty shaft turns to traverse thirty output divisions. Repeat the operation before writing the distance on the dial. A different trial tests whether the method travels beyond that one example.</p></div>
<div class="ct-calibration"><div id="ct-probe-drawing"></div><div class="ct-controls"><label for="ct-trial">Choose the first reduction</label><select id="ct-trial"><option value="20">The source’s worked trial</option><option value="30">The ideal one-tooth-per-turn case</option><option value="24">Another trial · a modern choice</option></select><p class="small" id="ct-trial-note"></p><p class="eyebrow">First worm turns since the trial began</p><output id="ct-probe-count" class="ct-counter ct-number" aria-live="off"></output><div class="ct-actions"><button id="ct-probe-step" type="button" class="primary">Turn the shaft once</button><button id="ct-probe-play" type="button">Run the trial</button><button id="ct-probe-reset" type="button">Start trial again</button></div><p id="ct-probe-message" role="status"></p><p class="small">This bench turns the first worm directly. Each shaft turn corresponds to eight road-wheel turns. The trial stops at the first complete output revolution.</p></div>
<div class="ct-observation"><p class="eyebrow">An inscription you can justify</p><h3>Keep the pointer.<br>Change its meaning.</h3><div id="ct-observation"></div><button id="ct-apply" type="button" class="primary" disabled>Use the measured graduation</button><div class="ct-actions"><button id="ct-theory-scale" type="button">Use the theoretical graduation</button></div><p id="ct-apply-status" role="status"></p><p class="small">The second reduction still assumes thirty input revolutions per output revolution. Hero says to make the same calculation for the other wheels. A trial of one stage is not verification of them all.</p></div></div>
<div class="ct-account"><div id="ct-comparison" class="ct-table" tabindex="0" role="region" aria-label="Theoretical and measured graduations; scroll if needed"></div><p class="ct-equation" id="ct-equation"></p><button type="button" data-read="6" class="text-button">Read the instruction that asks for this trial ↓</button></div></section>
<section id="ct-reading" aria-labelledby="ct-reading-title"><div class="section-head"><div><p class="eyebrow">03 / Fourteen selected readings</p><h2 id="ct-reading-title">Trial, turns, teeth.<br>Read the argument.</h2></div><div><label for="ct-reading-select">Choose a passage</label><select id="ct-reading-select">${counterPassages.map((p, i) => `<option value="${i}">${i + 1}. ${p.title}</option>`).join("")}</select><p class="small">Edited Greek, new English and contextual language notes. These are selections from chapter 34. The twelve full pages retain the complete chapter and its facing German.</p></div></div>
<article><p id="ct-reference" class="eyebrow"></p><h3 id="ct-reading-heading"></h3><div class="ct-reading-grid"><div><p class="eyebrow">Greek / adapted digital transcription</p><p id="ct-greek" class="ct-greek" lang="grc"></p></div><div><p class="eyebrow">English / new translation</p><p id="ct-english"></p><details open><summary><span id="ct-word" lang="grc"></span> · <span id="ct-gloss"></span></summary><p id="ct-note"></p></details></div></div><div class="ct-actions ct-reading-nav"><div class="ct-actions"><button id="ct-previous" type="button">Previous passage</button><button id="ct-next" type="button">Next passage</button></div><button id="ct-inspect" type="button">Inspect this printed page ↓</button></div></article></section>
<section id="ct-printed" aria-labelledby="ct-printed-title"><div class="section-head"><div><p class="eyebrow">04 / Twelve complete source pages</p><h2 id="ct-printed-title">The trial survives.<br>Part of the box does not.</h2></div><p>Schöne’s 1903 edition, printed pp. 292–303. A gap interrupts the initial construction at p. 292. Later instructions specify the eight-to-one result, worm reductions, calibration and external pointers. Our drawing is an unfolded ratio model, not a repair of the missing description. Figure 114 on p. 295 is the edition’s explanatory cutaway, with more stages than this experiment; it is not an archaeological drawing.</p></div><div class="ct-source-layout"><div><label for="ct-source-select">Printed page</label><select id="ct-source-select">${counterSources.map((p) => `<option value="${p.page}">${p.page} · ${p.title}</option>`).join("")}</select><h3 id="ct-source-title"></h3><button id="ct-zoom" type="button" aria-pressed="false">Enlarge the page</button><a id="ct-image-link" target="_blank" rel="noopener">Full-size image ↗</a><a id="ct-source-link" target="_blank" rel="noopener">Source volume at this image ↗</a><a href="./sources/manifest.json">Page identities and PDF mapping</a><p id="ct-source-status" role="status"></p></div><div class="ct-pan" id="ct-pan" tabindex="0" role="region" aria-label="Printed page; scroll to inspect enlarged details"><img id="ct-source-image" width="1079" height="1550" loading="lazy" alt=""></div></div>
<details class="ct-editorial"><summary>Text, numerical notation and the limits of this experiment</summary><p>Greek adapted from the <a href="${TEI_SOURCE}">Harvard College Library / Open Greek and Latin transcription</a> (2018, CC BY-SA 4.0), pinned to its included <a href="./sources/dioptra-grc.xml">complete TEI file</a>. New English, language notes and teaching text carry the same license. Historical page images are public domain.</p><p>Selections join whitespace and line endings and omit intervening material, line numbers and apparatus. The digital τύμπανυν in the twenty-turn passage is retained and identified against the printed τύμπανον. Greek number letters remain visible; their values are explained in the notes. Marginal page 312 is from an earlier edition; the calibration’s printed Schöne page is 298.</p><p>The text supplies eight wheel turns per input-shaft turn, two theoretical thirty-to-one reductions, a ten-cubit circumference, and a worked first-stage observation of twenty turns per output revolution. The 24-turn trial, the open-plan layout, event controls and outside ledger are modern teaching choices. A uniform average ratio supplies between-division motion. No tooth shape, friction, backlash, slip, manufacturing tolerance or archaeological performance is inferred. No claim about the physical cause of the twenty-turn ratio is made.</p><p>Thirty equal dial divisions are not thirty independent distance measurements. A larger dial spreads them apart without proving finer accuracy. Only the first worm is calibrated here; all results involving the second remain conditional on its stated thirty-to-one assumption. Wheel circumference and the source’s 400-cubits-per-stadion equivalence are retained without conversion to modern units.</p></details></section>
<section id="ct-save" class="ct-save" aria-labelledby="ct-save-title"><div class="section-head"><div><p class="eyebrow">05 / Keep a complete measured reading</p><h2 id="ct-save-title">Take the trial<br>and its evidence.</h2></div><p>Save the dials, your calibration, the theoretical comparison, all fourteen readings, twelve full source pages and fonts. The single HTML file opens from disk, makes no external subresource requests, and can be printed.</p></div><div class="ct-save-content"><div><div class="ct-actions"><button id="ct-save-reading" type="button" class="primary">Save illustrated reading</button><button id="ct-save-svg" type="button">Save dials SVG</button><button id="ct-save-csv" type="button">Save checkpoints CSV</button><button id="ct-share" type="button">Share this experiment</button></div><p id="ct-save-status" class="ct-save-status" role="status"></p><label id="ct-share-label" for="ct-share-url" hidden>Copy this experiment link</label><input id="ct-share-url" readonly hidden></div><div><h3>What else is hidden in a measurement?</h3><p>A tunnel’s outside route is not its direct length. A stream’s cross-section is not its supply per time. Try Hero’s other measured arguments.</p><p><a href="./">15 · Meet beneath the mountain →</a></p><p><a href="./flow.html">31 · Water needs a clock →</a></p></div></div></section></main>
<footer><span>Dioptra · a measured reading of Hero</span><span id="ct-offline" role="status">Checking offline edition…</span><a href="./sources/NOTICES.txt">Licenses and credits</a></footer>`;

function get<T extends HTMLElement = HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`Missing ${id}`);
  return e as T;
}
function show(id: string) {
  const e = get(id);
  e.tabIndex = -1;
  e.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth",
  });
  e.focus({ preventScroll: true });
}
function pause() {
  playing = false;
  cancelAnimationFrame(frame);
  get("ct-probe-play").textContent =
    state.probe >= state.trial ? "Trial complete" : "Run the trial";
}
function commit(patch: Partial<CounterState>, replace = false) {
  state = normalizeCounter({ ...state, ...patch });
  parsed.adjusted = false;
  history[replace ? "replaceState" : "pushState"](
    null,
    "",
    `${location.pathname}${counterQuery(state)}${location.hash}`,
  );
  render();
}
function renderSource() {
  if (state.page === sourcePage) return;
  sourcePage = state.page;
  const p = counterSources.find((p) => p.page === sourcePage);
  if (!p) return;
  const image = get<HTMLImageElement>("ct-source-image");
  image.src = `${import.meta.env.BASE_URL}sources/${p.file}`;
  image.alt = `Schöne’s complete printed page ${p.page}: ${p.title}`;
  get<HTMLSelectElement>("ct-source-select").value = String(sourcePage);
  get("ct-source-title").textContent = p.title;
  get<HTMLAnchorElement>("ct-image-link").href = image.src;
  // Use the scan leaf, not an assumed correspondence with the marginal pagination.
  get<HTMLAnchorElement>("ct-source-link").href = `${SOURCE}/page/n${sourcePage + 15}/mode/1up`;
  get("ct-source-status").textContent = "";
}
function render() {
  const m = counter(state);
  const full = state.probe === state.trial;
  get("ct-adjusted").hidden = !parsed.adjusted;
  get("ct-mode").textContent = state.calibrated
    ? "Measured first-stage graduation"
    : "Theoretical first-stage graduation";
  get("ct-mechanism").innerHTML = counterDrawing(state, compact.matches, "live-counter");
  get<HTMLInputElement>("ct-turns").value = String(state.turns);
  get("ct-turns-value").textContent = `${f(state.turns)} / 7,200 turns`;
  get<HTMLButtonElement>("ct-back").disabled = state.turns === 0;
  get<HTMLButtonElement>("ct-forward").disabled = state.turns === 7200;
  get<HTMLButtonElement>("ct-eight").disabled = state.turns === 7200;
  get("ct-indicated").innerHTML =
    `${f(m.indicated)} <small>cubits · ${f(m.indicated / 400)} stadia</small>`;
  get("ct-combination").textContent =
    `${m.coarse} completed first-dial revolutions + ${f(m.firstTick)} fine divisions. Each fine division is labelled ${counterFraction(state.calibrated ? 8 * state.trial : 240, 3)} cubits.`;
  get("ct-error").textContent = state.calibrated
    ? "The first-stage scale matches this trial. The second-stage ratio and exact rolling remain assumptions."
    : `At this trial ratio, the theoretical scale ${m.errorPercent > 0 ? `overreads by ${f(m.errorPercent)}%` : "agrees with the ideal case"}. The comparison uses the current circuit, before any lost full circuits.`;
  get("ct-to-trial").textContent = state.calibrated
    ? "Inspect the trial behind this scale ↓"
    : "The first scale looks plausible. Test it ↓";
  get("ct-error").classList.toggle("ct-caution", !state.calibrated && m.errorPercent > 0);
  get("ct-ledger").innerHTML = `${f(m.ledger)} <small>cubits · ${f(m.ledger / 400)} stadia</small>`;
  get("ct-wraps").textContent =
    `${m.wraps} complete instrument ${m.wraps === 1 ? "circuit" : "circuits"} + ${f(m.actualRemainder)} cubits within the current circuit. A complete circuit here is ${f(m.period * 10)} cubits.`;
  get<HTMLSelectElement>("ct-trial").value = String(state.trial);
  get("ct-trial-note").textContent =
    state.trial === 20
      ? "The twenty-turn example is a supposition in Hero’s calibration passage, not a surviving record from a built device."
      : state.trial === 30
        ? "The earlier theoretical case: a single worm turn moves one of thirty teeth. Its first complete output turn represents 240 wheel turns."
        : "A chosen additional trial. Its ratio is not attributed to Hero. Use the same observation and calculation to find its graduation.";
  get("ct-probe-drawing").innerHTML = probeDrawing(state, "live-probe");
  get("ct-probe-count").textContent =
    `${state.probe} shaft ${state.probe === 1 ? "turn" : "turns"}`;
  get<HTMLButtonElement>("ct-probe-step").disabled = full;
  get<HTMLButtonElement>("ct-probe-play").disabled = full;
  get("ct-probe-play").textContent = playing
    ? "Pause the trial"
    : full
      ? "Trial complete"
      : "Run the trial";
  get("ct-probe-message").textContent = full
    ? `One complete output revolution observed after ${state.probe} shaft turns. Now divide the corresponding journey by thirty divisions.`
    : `${f(m.probeTick)} divisions traversed. Continue until the output returns to its starting mark once.`;
  get<HTMLButtonElement>("ct-apply").disabled = !full || state.calibrated;
  get<HTMLButtonElement>("ct-theory-scale").disabled = !state.calibrated;
  get("ct-apply-status").textContent = state.calibrated
    ? "Measured first-stage graduation is in use. The pointer positions have not moved."
    : full
      ? "The trial is complete. The theoretical graduation is still in use."
      : "Complete the trial before writing its measured graduation.";
  get("ct-observation").innerHTML = full
    ? `<p class="ct-measured">${state.probe} shaft turns × 8 wheel turns × 10 cubits = <strong>${f(state.probe * 80)} cubits</strong>One output revolution has thirty divisions.<strong>${counterFraction(state.probe * 80, 30)} cubits / division</strong></p>`
    : "<p>The output has not completed its first revolution. The division value remains unwritten.</p><p>Observe the complete turn before using the measured graduation.</p>";
  get("ct-comparison").innerHTML =
    `<table><caption>The same fifteen first-dial divisions, before a full circuit. Writing another graduation does not move the pointer.</caption><thead><tr><th scope="col">Basis</th><th scope="col">Cubits / division</th><th scope="col">Fifteen divisions</th></tr></thead><tbody><tr><th scope="row">Theoretical 30 turns</th><td>80</td><td>1,200 cubits · 3 stadia</td></tr><tr><th scope="row">${full ? `Observed ${state.probe} turns` : "Your unfinished trial"}</th><td>${full ? counterFraction(state.probe * 80, 30) : "Awaiting observation"}</td><td>${full ? `${f(state.probe * 40)} cubits · ${f(state.probe / 10)} stadia` : "Awaiting observation"}</td></tr></tbody></table>`;
  get("ct-equation").textContent = full
    ? `${state.probe} × 8 × 10 ÷ 30 = ${counterFraction(state.probe * 80, 30)} cubits per division`
    : "Count shaft turns → recover wheel turns → multiply circumference → divide by thirty.";
  const p = counterPassages[state.reading];
  if (!p) throw new Error("Missing reading");
  get<HTMLSelectElement>("ct-reading-select").value = String(state.reading);
  for (const [id, value] of Object.entries({
    "ct-reference": `DIOPTRA 34 / ${p.ref}`,
    "ct-reading-heading": `${state.reading + 1}. ${p.title}`,
    "ct-greek": p.greek,
    "ct-english": p.english,
    "ct-word": p.word,
    "ct-gloss": p.gloss,
    "ct-note": p.note,
  }))
    get(id).textContent = value;
  get<HTMLButtonElement>("ct-previous").disabled = state.reading === 0;
  get<HTMLButtonElement>("ct-next").disabled = state.reading === counterPassages.length - 1;
  renderSource();
}
get("ct-turns").addEventListener("input", () => {
  pause();
  commit({ turns: Number(get<HTMLInputElement>("ct-turns").value) }, true);
});
for (const [id, delta] of [
  ["ct-back", -1],
  ["ct-forward", 1],
  ["ct-eight", 8],
] as const)
  get(id).addEventListener("click", () => {
    pause();
    commit({ turns: state.turns + delta });
  });
get("ct-cutaway").addEventListener("click", () => {
  pause();
  commit({ page: 295 });
  show("ct-printed");
});
get("ct-to-trial").addEventListener("click", () => show("ct-calibration"));
get("ct-trial").addEventListener("change", () => {
  pause();
  commit({
    trial: Number(get<HTMLSelectElement>("ct-trial").value) as Trial,
    probe: 0,
    calibrated: false,
  });
  get("ct-apply-status").textContent = "A different trial needs a new observation.";
});
get("ct-probe-step").addEventListener("click", () => {
  pause();
  commit({ probe: state.probe + 1 });
});
get("ct-probe-reset").addEventListener("click", () => {
  pause();
  commit({ probe: 0, calibrated: false });
  get("ct-apply-status").textContent =
    "Trial and graduation reset. The road-wheel count is retained.";
});
get("ct-probe-play").addEventListener("click", () => {
  if (playing) {
    pause();
    return;
  }
  playing = true;
  const start = performance.now(),
    initial = state.probe;
  const tick = (now: number) => {
    const probe = Math.min(state.trial, initial + Math.floor((now - start) / 220));
    if (probe !== state.probe) commit({ probe }, true);
    if (probe >= state.trial) {
      pause();
      render();
    } else frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  render();
});
get("ct-apply").addEventListener("click", () => {
  pause();
  if (state.probe !== state.trial) return;
  commit({ calibrated: true });
  get("ct-apply-status").textContent =
    "Measured first-stage graduation applied. The pointer positions and road-wheel count have not moved.";
});
get("ct-theory-scale").addEventListener("click", () => {
  pause();
  commit({ calibrated: false });
  get("ct-apply-status").textContent =
    "Theoretical graduation restored. The observed trial remains in the record.";
});
for (const b of document.querySelectorAll<HTMLButtonElement>("[data-scene]"))
  b.addEventListener("click", () => {
    pause();
    const m = counter(state);
    const turns =
      b.dataset.scene === "example"
        ? m.firstPeriod / 2
        : b.dataset.scene === "before"
          ? m.firstPeriod - 1
          : b.dataset.scene === "carry"
            ? m.firstPeriod
            : m.period;
    commit(
      b.dataset.scene === "theory"
        ? { turns: 7200, trial: 30, probe: 0, calibrated: false }
        : { turns },
    );
  });
get("ct-reading-select").addEventListener("change", () => {
  pause();
  commit({ reading: Number(get<HTMLSelectElement>("ct-reading-select").value) });
});
for (const [id, delta] of [
  ["ct-previous", -1],
  ["ct-next", 1],
] as const)
  get(id).addEventListener("click", () => {
    pause();
    commit({ reading: state.reading + delta });
  });
for (const b of document.querySelectorAll<HTMLButtonElement>("[data-read]"))
  b.addEventListener("click", () => {
    pause();
    commit({ reading: Number(b.dataset.read) });
    show("ct-reading");
  });
get("ct-inspect").addEventListener("click", () => {
  pause();
  commit({ page: counterPassages[state.reading]?.page ?? 298 });
  show("ct-printed");
});
get("ct-source-select").addEventListener("change", () => {
  pause();
  commit({ page: Number(get<HTMLSelectElement>("ct-source-select").value) });
});
get("ct-zoom").addEventListener("click", () => {
  const zoomed = get("ct-pan").classList.toggle("ct-enlarged");
  get("ct-zoom").setAttribute("aria-pressed", String(zoomed));
  get("ct-zoom").textContent = zoomed ? "Fit the page" : "Enlarge the page";
});
get("ct-source-image").addEventListener("error", () => {
  get("ct-source-status").textContent =
    "The printed page could not load. Reconnect and select another page, or use the full-size image link.";
});
get("ct-share").addEventListener("click", () => {
  const url = new URL(`counter.html${counterQuery(state)}#ct-workshop`, location.href).href;
  get<HTMLTextAreaElement>("ct-share-url").value = url;
  get("ct-share-label").hidden = false;
  get("ct-share-url").hidden = false;
  get<HTMLInputElement>("ct-share-url").select();
  get("ct-save-status").textContent =
    "The link preserves the trial, observation, scale, wheel count, reading and selected page.";
});
get("ct-save-csv").addEventListener("click", () => {
  pause();
  download(counterCsv(state), "dioptra-counter.csv", "text/csv;charset=utf-8");
});
get("ct-save-svg").addEventListener("click", () => {
  pause();
  download(counterSvg(state), "dioptra-counter.svg", "image/svg+xml");
});
get("ct-save-reading").addEventListener("click", async () => {
  pause();
  const button = get<HTMLButtonElement>("ct-save-reading");
  const frozen = { ...state };
  button.disabled = true;
  get("ct-save-status").textContent = "Checking source pages and fonts for the selected trial…";
  try {
    download(await counterStudy(frozen), "dioptra-counter-reading.html", "text/html;charset=utf-8");
    get("ct-save-status").textContent =
      "Illustrated reading saved with the selected trial, all fourteen passages, twelve full pages, fonts and licenses.";
  } catch (e) {
    get("ct-save-status").textContent =
      e instanceof Error ? e.message : "Could not save. Reconnect and try again.";
  } finally {
    button.disabled = false;
  }
});
addEventListener("popstate", () => {
  pause();
  parsed = parseCounter(location.search);
  state = parsed.state;
  render();
});
compact.addEventListener("change", render);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
addEventListener("pagehide", pause);
addEventListener("beforeprint", pause);
render();
void offlineStatus(get("ct-offline"));
