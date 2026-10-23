import { LIMITS, passages, SOURCE, sources, steps, TEI_SOURCE } from "./content";
import { gapDrawing, mapDrawing, measure, num } from "./drawing";
import { download, studyHtml, surveyCsv, surveySvg } from "./files";
import { offlineStatus } from "./offline";
import { normalize, PRESETS, parse, query, type SurveyState, survey } from "./survey";

const get = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing ${id}`);
  return found as T;
};
let parsed = parse(location.search),
  state = parsed.state,
  shownSource = -1;
get("app").innerHTML = `<a class="skip" href="#field-book">Skip to the survey</a>
<header class="masthead"><a class="wordmark" href="./">Dioptra <span lang="grc">διόπτρα</span></a><nav aria-label="Main"><a href="#field-book">Field book</a><a href="#reading">Read the Greek</a><a href="#sources">Printed evidence</a><a href="#save">Keep the study</a></nav></header>
<main><section class="opening"><div><p class="eyebrow">Hero of Alexandria / Dioptra 15</p><h1>Meet beneath<br>the mountain.</h1></div><div class="opening-note"><p>Two entrances. Neither can see the other.</p><p>Walk around the mountain, keep track of your turns, and use two small triangles to aim a line through what you cannot see.</p><a href="#field-book">Open the survey ↓</a></div></section>
<section id="field-book" aria-labelledby="book-title"><div class="section-head"><div><p class="eyebrow">01 / Measure what you can reach</p><h2 id="book-title" tabindex="-1">The long way round.<br>The straight way through.</h2></div><p>The ground plan and metre lengths are chosen. Hero supplies the construction and the five-to-one example. The mountain is not a surveyed site.</p></div>
<p id="adjusted" class="notice" role="status" hidden>Some shared settings were outside this experiment’s range and have been adjusted.</p>
<div class="steps" aria-label="Survey stages">${steps.map((s, i) => `<button type="button" data-stage="${i}" aria-pressed="false"><span>0${i + 1}</span>${s.title}</button>`).join("")}</div>
<div class="workbench"><div class="drawing-board"><div class="board-header"><span id="board-caption">A circuit between fixed portals</span><a href="#controls" class="phone-link">Change the survey ↓</a></div><div id="map-wide" class="wide"></div><div id="map-narrow" class="narrow"></div><div class="map-key"><span><i class="walk-key"></i>Measured circuit</span><span><i class="ideal-key"></i>Imagined connection</span><span><i class="peg-key"></i>Outside peg</span></div><p id="leg-note" class="board-note" aria-live="polite"></p></div>
<aside id="controls" class="field-ledger" aria-label="Measured circuit"><label for="preset">Choose the proportions</label><select id="preset">${Object.entries(
  PRESETS,
)
  .map(([key, p]) => `<option value="${key}">${p.title}</option>`)
  .join(
    "",
  )}</select><p id="preset-note" class="small"></p><label for="detour">Move the bends <output id="detour-value" for="detour"></output></label><input id="detour" type="range" min="0" max="100" step="10"><p class="small">The two entrances stay fixed.</p><div class="ledger-heading"><span>Leg</span><span>Distance</span><span>Direction</span></div><div id="ledger" class="ledger-rows">${Array.from({ length: 7 }, (_, i) => `<button type="button" data-leg="${i}" aria-pressed="false"><span class="leg-name"></span><span class="leg-length"></span><span class="leg-direction"></span></button>`).join("")}</div><p class="walk-total">Outside walk <strong id="route-length"></strong></p><a href="#board-caption" class="phone-link">Inspect the changed plan ↑</a></aside></div>
<div class="instruction"><p class="eyebrow" id="step-count"></p><div><h3 id="step-title"></h3><p id="step-note"></p><button id="read-command" type="button" class="text-button">Read this Greek instruction ↓</button></div></div>
<section id="reduction" class="reduction" aria-labelledby="sum-title" hidden><div><p class="eyebrow">02 / Keep the signs</p><h2 id="sum-title">The detour cancels.</h2><p>Rightward and leftward distances belong to the same direction. Subtract them. The result is <span lang="grc">ΒΝ</span>, the long leg of a triangle hidden inside the mountain.</p><p>The perpendicular distances give <span lang="grc">ΔΝ</span>. These are displacements in a plan, not height differences.</p></div><div class="sum-sheet"><table><caption>Signed distances from the measured circuit</caption><thead><tr><th scope="col">Direction</th><th scope="col">Calculation</th><th scope="col">Net</th></tr></thead><tbody><tr><th scope="row">Along ΒΝ</th><td id="sum-x"></td><td id="net-x"></td></tr><tr><th scope="row">Along ΔΝ</th><td id="sum-y"></td><td id="net-y"></td></tr></tbody></table><p class="ratio-line" id="ratio"></p><p class="small">All lengths are chosen modern metres. The book’s figure is schematic; its proportions cannot be measured to recover the numerical example.</p></div></section>
<section id="aiming" class="aiming" aria-labelledby="aim-title" hidden><div><p class="eyebrow">03 / Similar triangles</p><h2 id="aim-title">Aim from outside.</h2><p>Choose an accessible baseline <span lang="grc">ΒΟ</span>. Put a peg at <span lang="grc">Ξ</span>, perpendicular to its end. The line <span lang="grc">Ξ–Β</span> points inward. Repeat the construction beyond <span lang="grc">Δ</span>.</p><p>The perpendicular must have the same proportion to the baseline as <span lang="grc">ΔΝ</span> has to <span lang="grc">ΒΝ</span>.</p><p id="target-equation" class="equation"></p></div><div class="aim-controls"><label for="baseline">Outside baseline <output id="baseline-value" for="baseline"></output></label><input id="baseline" type="range" min="10" max="80" step="5"><p class="small">Changing its length preserves your chosen direction.</p><label for="peg-rise">Perpendicular to the outside peg <span>Chosen metres</span></label><div class="number-action"><input id="peg-rise" type="number" min="0" step="any" inputmode="decimal" aria-describedby="aim-input-note"><button id="set-aim" type="button" class="primary">Set from the ledger</button></div><p id="aim-input-note" class="small">Try a length, then extend both sight lines inward.</p><p id="aim-result" class="aim-result" aria-live="polite"></p><button id="extend" type="button" class="text-button">Extend the lines into the mountain →</button></div></section>
<section id="meeting" class="meeting" aria-labelledby="meeting-title" hidden><div><p class="eyebrow">04 / A proof and a physical setting</p><h2 id="meeting-title">Will the lines meet?</h2><p>With exact proportions, the two sights extend along one line. Now move a peg by a chosen number of millimetres. This is an experiment with aiming error, not a claim about an ancient instrument’s precision.</p><label for="error">Perpendicular peg error <output id="error-value" for="error"></output></label><input id="error" type="range" min="-50" max="50" step="1"><div class="error-row"><div><label for="affected">Displace the peg at</label><select id="affected"><option value="both">Both entrances</option><option value="B">Entrance Β only</option><option value="D">Entrance Δ only</option></select></div><button id="reset-error" type="button">Put the pegs back</button></div><p class="small">Positive error moves each peg farther from its own baseline. The measured circuit stays exact.</p></div><div class="meeting-detail"><label for="progress">Extend each half <output id="progress-value" for="progress"></output></label><input id="progress" type="range" min="0" max="100" step="1"><p class="small">A fraction of each half’s horizontal span, not elapsed time or equal drilling distance.</p><div id="gap"></div><p id="gap-note" aria-live="polite"></p><p id="amplification" class="small"></p><p class="small">The detail has its own scale. It compares the lines at the middle vertical cross-section, including when their drawn fronts have not yet reached it.</p></div></section></section>
<section id="reading" class="reading" aria-labelledby="reading-title"><div class="section-head"><div><p class="eyebrow">05 / The words do geometric work</p><h2 id="reading-title">Read the instruction.<br>Then draw it.</h2></div><div><label for="passage">Choose a passage</label><select id="passage">${passages.map((p, i) => `<option value="${i}">${i + 1}. ${p.title}</option>`).join("")}</select><p class="small">Selected Greek from Schöne’s 1903 edition. New English translation and grammar for an English-speaking reader.</p></div></div><article id="passage-article"><p id="passage-ref" class="eyebrow"></p><h3 id="passage-title"></h3><div class="parallel"><div><p class="eyebrow">Greek</p><p id="greek" lang="grc"></p></div><div><p class="eyebrow">English / new translation</p><p id="english"></p><details id="grammar" open><summary><span id="word" lang="grc"></span><span id="gloss"></span></summary><p id="grammar-note"></p></details></div></div><p id="reading-action" class="reading-action"></p><div class="reading-actions"><button id="previous" type="button">Previous passage</button><button id="next" type="button">Next passage</button><button id="show-source" type="button">Inspect its printed page ↓</button></div></article><p class="small">Letters use standard Greek Δ in place of the digital transcription’s ∠. Line-end hyphens are joined; selected excerpts omit line numbers and apparatus. Angle brackets preserve editorial supplements. <a href="#source-decisions">Read the source decisions</a>.</p></section>
<section id="sources" class="source-section" aria-labelledby="source-title"><div class="section-head"><div><p class="eyebrow">06 / Keep the printed evidence</p><h2 id="source-title">The diagram is an argument.<br>It is not a measured map.</h2></div><p>Inspect four complete pages: the Greek, figure 95, Schöne’s facing German translation, and the printed apparatus. All four are saved with the study.</p></div><div class="source-layout"><div class="source-controls"><label for="source">Choose a printed page</label><select id="source">${sources.map((s, i) => `<option value="${i}">${s.page} · ${s.title}</option>`).join("")}</select><h3 id="source-heading"></h3><p id="source-note"></p><label for="zoom">Image enlargement <output id="zoom-value">100%</output></label><input id="zoom" type="range" min="100" max="260" step="10" value="100"><button id="find-passage" type="button">Find the passage</button><a id="full-source" target="_blank" rel="noopener">Open the full image ↗</a><a id="volume-source" target="_blank" rel="noopener">Source volume ↗</a><p class="small">Historical text and figure: public domain. <a href="./sources/manifest.json">Image identities and provenance</a>.</p></div><div id="source-pan" class="source-pan" tabindex="0" role="region" aria-label="Printed page; scroll to inspect enlarged details"><img id="source-image" alt="" loading="lazy"><p id="source-error" role="status" hidden>The image could not load. Reconnect and choose the page again.</p></div></div><details id="source-decisions"><summary>One letter-label difficulty; one historical boundary</summary><p>The construction moves along ΚΛ until Δ is seen at right angles from Μ. The printed summation lists then use ΚΛ and ΛΔ. This model sums the measured ΚΜ and ΜΔ legs identified by that perpendicular construction. The Greek and facing apparatus remain visible; the application is making a geometric reading, not silently repairing a manuscript.</p><p>The figure places Ο beyond Β, although the words name the line ΒΕ. The model follows that exterior placement and treats the named line as extended. The text’s five-to-one example supplies a ratio, not the size of the drawing or metre coordinates.</p><p>${LIMITS} No claim is made that Eupalinos used this later-described method at Samos.</p><p>Greek transcription adapted from the <a href="${TEI_SOURCE}">Harvard College Library / Open Greek and Latin edition</a> (2018), CC BY-SA 4.0. Its complete TEI file is <a href="./sources/dioptra-grc.xml">included</a>. The new translation and teaching text use the same license; code and new diagrams are MIT.</p></details></section>
<section id="save" class="save-section"><div><p class="eyebrow">07 / Leave with a field book</p><h2>Keep your construction.</h2><p>Save a complete illustrated reading with the survey, signed distances, aiming settings, all eight Greek passages and all four printed pages. The file opens on its own, offline.</p><div class="save-actions"><button id="save-study" type="button" class="primary">Save illustrated reading</button><button id="save-csv" type="button">Save survey CSV</button><button id="save-svg" type="button">Save drawing SVG</button><button id="share" type="button">Copy this view</button></div><p id="action-status" role="status"></p><label id="share-label" for="share-url" hidden>Copyable view link</label><input id="share-url" type="text" readonly hidden></div><div><h3>What stays outside the model</h3><p>${LIMITS}</p><p>The perturbation changes only the outside aiming pegs. It does not simulate imperfect right-angle measurements, excavation, groundwater, rock or structural conditions. The proof describes an ideal alignment; the error experiment illustrates one way that alignment can fail.</p><a href="https://github.com/antonsoo/dioptra">Source, model and evidence ↗</a></div></section></main><footer><span>Dioptra · a measured reading of Hero</span><span id="offline" role="status">Checking offline edition…</span><a href="./sources/NOTICES.txt">Licenses and credits</a></footer>`;

function update(patch: Partial<SurveyState>, replace = false) {
  state = normalize({ ...state, ...patch });
  parsed.adjusted = false;
  history[replace ? "replaceState" : "pushState"](
    null,
    "",
    `${location.pathname}${query(state)}${location.hash}`,
  );
  render();
}
function render() {
  const m = survey(state),
    step = steps[state.stage],
    p = passages[state.reading];
  if (!step || !p) throw new Error("Missing reading");
  get("adjusted").hidden = !parsed.adjusted;
  get("map-wide").innerHTML = mapDrawing(state, false, "wide-map");
  get("map-narrow").innerHTML = mapDrawing(state, true, "narrow-map");
  get("board-caption").textContent = `${PRESETS[state.preset].title} · ${step.title}`;
  get<HTMLSelectElement>("preset").value = state.preset;
  get("preset-note").textContent = PRESETS[state.preset].note;
  get<HTMLInputElement>("detour").value = String(state.detour);
  get("detour-value").textContent =
    state.detour === 0 ? "Near circuit" : `${state.detour} m farther out`;
  for (const [i, l] of m.legs.entries()) {
    const row = document.querySelector<HTMLElement>(`button[data-leg="${i}"]`);
    if (!row) continue;
    row.setAttribute("aria-pressed", String(i === state.leg));
    const fields = {
      "leg-name": l.from.label + l.to.label,
      "leg-length": `${num(l.length)} m`,
      "leg-direction": l.dx ? `${l.dx > 0 ? "+" : "−"} x` : `+ y`,
    };
    for (const [cls, text] of Object.entries(fields)) {
      const el = row.querySelector(`.${cls}`);
      if (el) el.textContent = text;
    }
  }
  const leg = m.legs[state.leg];
  if (leg)
    get("leg-note").textContent =
      `${leg.from.label}${leg.to.label}: ${num(leg.length)} m ${leg.dx ? (leg.dx > 0 ? "rightward" : "leftward") : "upward on the unrotated plan"}. ${leg.axis === "x" ? "This contributes to ΒΝ." : "This contributes to ΔΝ; it is not an elevation gain."}`;
  get("route-length").textContent = `${num(m.routeLength)} m`;
  get("step-count").textContent = `Stage ${state.stage + 1} of 4`;
  get("step-title").textContent = step.title;
  get("step-note").textContent = step.note;
  document.querySelectorAll<HTMLElement>("button[data-stage]").forEach((b) => {
    b.setAttribute("aria-pressed", String(Number(b.dataset.stage) === state.stage));
  });
  for (const [id, stage] of [
    ["reduction", 1],
    ["aiming", 2],
    ["meeting", 3],
  ] as const)
    get(id).hidden = state.stage < stage;
  get("sum-x").textContent = `${num(m.east)} − ${num(m.west)}`;
  get("net-x").textContent = `${num(m.x)} m`;
  get("sum-y").textContent = `${num(m.north)} − ${num(m.south)}`;
  get("net-y").textContent = `${num(m.y)} m`;
  get("ratio").textContent = `ΒΝ : ΔΝ = ${num(m.x)} : ${num(m.y)} = ${num(m.x / m.y)} : 1`;
  get<HTMLInputElement>("baseline").value = String(state.baseline);
  get("baseline-value").textContent = `${state.baseline} m`;
  const peg = get<HTMLInputElement>("peg-rise");
  peg.max = String(state.baseline);
  if (document.activeElement !== peg) peg.value = num(m.chosenPegRise, 6);
  peg.removeAttribute("aria-invalid");
  get("aim-input-note").textContent =
    `Choose 0 to ${state.baseline} m. Displayed dimensions are rounded; “Set from the ledger” retains the exact proportion.`;
  get("target-equation").textContent =
    `ΟΞ = ΒΟ × ΔΝ / ΒΝ = ${state.baseline} × ${num(m.y)} / ${num(m.x)} = ${num(m.targetPegRise, 4)} m`;
  get("aim-result").textContent =
    Math.abs(state.aim - m.correctAim) < 1e-12
      ? "The chosen proportion matches the hidden triangle."
      : `The chosen perpendicular is ${measure(m.chosenPegRise - m.targetPegRise)} from the ideal position. Extend the lines to see the consequence.`;
  get<HTMLInputElement>("error").value = String(state.error);
  get("error-value").textContent = `${state.error > 0 ? "+" : ""}${state.error} mm`;
  get<HTMLSelectElement>("affected").value = state.affected;
  get<HTMLInputElement>("progress").value = String(state.progress);
  get("progress-value").textContent = `${state.progress}%`;
  get("gap").innerHTML = gapDrawing(state);
  get("gap-note").textContent =
    Math.abs(m.gap) < 1e-9
      ? "At the middle station, the two constructed lines meet."
      : `At the middle station, the Β line is ${measure(Math.abs(m.gap))} ${m.gap > 0 ? "above" : "below"} the Δ line.`;
  get("amplification").textContent =
    `Each 1 mm peg displacement contributes ${num(m.amplification, 3)} mm to the middle gap on its own side. A longer baseline reduces that contribution without changing the intended direction.`;
  get<HTMLSelectElement>("passage").value = String(state.reading);
  get("passage-ref").textContent = p.ref;
  get("passage-title").textContent = p.title;
  get("greek").textContent = p.greek;
  get("english").textContent = p.english;
  get("word").textContent = p.word;
  get("gloss").textContent = p.gloss;
  get("grammar-note").textContent = p.grammar;
  get("reading-action").textContent = p.action;
  get<HTMLButtonElement>("previous").disabled = state.reading === 0;
  get<HTMLButtonElement>("next").disabled = state.reading === passages.length - 1;
  get<HTMLSelectElement>("source").value = String(state.source);
  if (shownSource !== state.source) {
    shownSource = state.source;
    const source = sources[state.source];
    if (source) {
      get("source-heading").textContent = source.title;
      get("source-note").textContent = source.note;
      const im = get<HTMLImageElement>("source-image");
      im.src = `${import.meta.env.BASE_URL}sources/${source.file}`;
      im.alt = `Schöne, printed page ${source.page}: ${source.title}`;
      get<HTMLAnchorElement>("full-source").href = im.src;
      get<HTMLAnchorElement>("volume-source").href = `${SOURCE}/page/${source.page}/mode/1up`;
      get<HTMLInputElement>("zoom").value = "100";
      zoom();
      get("source-pan").scrollTo(0, 0);
      get("source-error").hidden = true;
    }
  }
}
function jump(id: string) {
  get(id).scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });
}
function zoom() {
  const z = get<HTMLInputElement>("zoom").value;
  get("source-image").style.width = `${z}%`;
  get("zoom-value").textContent = `${z}%`;
}
document.querySelectorAll<HTMLElement>("button[data-stage]").forEach((b) => {
  b.addEventListener("click", () => update({ stage: Number(b.dataset.stage) }));
});
document.querySelectorAll<HTMLElement>("button[data-leg]").forEach((b) => {
  b.addEventListener("click", () => update({ leg: Number(b.dataset.leg) }));
});
get("preset").addEventListener("change", () =>
  update({
    preset: get<HTMLSelectElement>("preset").value as SurveyState["preset"],
    stage: 0,
    error: 0,
  }),
);
for (const [id, key] of [
  ["detour", "detour"],
  ["baseline", "baseline"],
  ["error", "error"],
  ["progress", "progress"],
] as const)
  get(id).addEventListener("input", () =>
    update({ [key]: Number(get<HTMLInputElement>(id).value) }, true),
  );
get("peg-rise").addEventListener("input", () => {
  const input = get<HTMLInputElement>("peg-rise");
  if (input.value === "" || !input.checkValidity() || !Number.isFinite(input.valueAsNumber)) {
    input.setAttribute("aria-invalid", "true");
    get("aim-input-note").textContent =
      `Enter a perpendicular length between 0 and ${state.baseline} m. The drawing keeps the last valid direction.`;
    return;
  }
  update({ aim: input.valueAsNumber / state.baseline }, true);
});
get("set-aim").addEventListener("click", () => update({ aim: survey(state).correctAim }));
get("extend").addEventListener("click", () => {
  update({ stage: 3 });
  jump("meeting");
});
get("affected").addEventListener("change", () =>
  update({ affected: get<HTMLSelectElement>("affected").value as SurveyState["affected"] }),
);
get("reset-error").addEventListener("click", () => update({ error: 0 }));
get("read-command").addEventListener("click", () => {
  update({ reading: steps[state.stage]?.passage ?? 0 });
  jump("reading");
});
get("passage").addEventListener("change", () =>
  update({ reading: Number(get<HTMLSelectElement>("passage").value) }),
);
get("previous").addEventListener("click", () => update({ reading: state.reading - 1 }));
get("next").addEventListener("click", () => update({ reading: state.reading + 1 }));
get("source").addEventListener("change", () => {
  shownSource = -1;
  update({ source: Number(get<HTMLSelectElement>("source").value) });
});
get("show-source").addEventListener("click", () => {
  update({ source: passages[state.reading]?.source ?? 0 });
  jump("sources");
});
get("zoom").addEventListener("input", zoom);
get("find-passage").addEventListener("click", () => {
  get<HTMLInputElement>("zoom").value = "200";
  zoom();
  requestAnimationFrame(() => {
    const pane = get("source-pan");
    pane.scrollTop = get("source-image").clientHeight * (sources[state.source]?.focus ?? 0);
    pane.scrollLeft = (pane.scrollWidth - pane.clientWidth) / 2;
    pane.focus();
  });
});
get("source-image").addEventListener("error", () => {
  get("source-error").hidden = false;
});
get("source-image").addEventListener("load", () => {
  get("source-error").hidden = true;
});
get("save-csv").addEventListener("click", () => {
  download(surveyCsv(state), "dioptra-survey.csv", "text/csv");
  get("action-status").textContent = "Survey CSV saved.";
});
get("save-svg").addEventListener("click", () => {
  download(surveySvg(state, innerWidth < 650), "dioptra-survey.svg", "image/svg+xml");
  get("action-status").textContent = "Drawing saved as SVG.";
});
get("save-study").addEventListener("click", async () => {
  const b = get<HTMLButtonElement>("save-study");
  b.disabled = true;
  get("action-status").textContent = "Preparing the illustrated reading and its source pages…";
  try {
    const html = await studyHtml({ ...state });
    download(html, "dioptra-field-book.html", "text/html");
    get("action-status").textContent =
      "Complete reading saved with four verified source images, fonts and licenses.";
  } catch (e) {
    get("action-status").textContent =
      e instanceof Error ? e.message : "The reading could not be saved. Reconnect and try again.";
  } finally {
    b.disabled = false;
  }
});
get("share").addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}${query(state)}#field-book`;
  get<HTMLInputElement>("share-url").value = url;
  get("share-url").hidden = false;
  get("share-label").hidden = false;
  try {
    await navigator.clipboard.writeText(url);
    get("action-status").textContent = "View link copied.";
  } catch {
    get<HTMLInputElement>("share-url").select();
    get("action-status").textContent = "Select and copy the view link.";
  }
});
addEventListener("popstate", () => {
  parsed = parse(location.search);
  state = parsed.state;
  render();
});
render();
offlineStatus(get("offline"));
