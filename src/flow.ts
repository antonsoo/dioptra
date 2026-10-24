import { SOURCE, TEI_SOURCE } from "./content";
import { esc } from "./drawing";
import { download } from "./files";
import { FLOW_BOUNDARY, flowPassages, flowSources } from "./flow-content";
import { FLOW_INK, flowCsv, flowPlot, flowSvg, receiverDrawing } from "./flow-drawing";
import {
  FLOW_DEFAULT,
  type FlowState,
  flowNumber as f,
  flowArea,
  flowQuery,
  flowVolume,
  flowWindow,
  type NumericFlowKey,
  normalizeFlow,
  parseFlow,
} from "./flow-model";
import { flowAccount, flowStudy } from "./flow-study";
import { offlineStatus } from "./offline";

const get = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const e = document.getElementById(id);
  if (!e) throw new Error(`Missing ${id}`);
  return e as T;
};
let parsed = parseFlow(location.search),
  state = parsed.state,
  playing = false,
  frame = 0,
  last = 0,
  selectedSource = 284,
  question = 0;
const questions = [
  {
    title: "Two streams have equal wetted sections. What can you conclude?",
    choices: [
      "They supply equal volumes each second.",
      "Their supplies can differ if their mean speeds differ.",
      "The wider receiver must collect more.",
    ],
    answer: 1,
    reason:
      "A section has area. Supply also depends on how far the water moves in a given time. The two identical receivers do not set the flow.",
  },
  {
    title: "Which pair measures the average supply without measuring the opening?",
    choices: [
      "Collected volume and elapsed time.",
      "Opening width and depth.",
      "A sundial reading by itself.",
    ],
    answer: 0,
    reason:
      "The difference between two collected volumes divided by the elapsed time gives the interval average. Time alone is insufficient.",
  },
  {
    title: "B changes from 30 to 10 cm/s halfway through the default run. Which statement holds?",
    choices: [
      "Its final speed describes the whole run’s average.",
      "The first half predicts the complete collection exactly.",
      "The whole interval measures a valid average even though the speed changed.",
    ],
    answer: 2,
    reason:
      "With the default 48 cm² section, B collects 19.2 L in 20 s: average 0.96 L/s. The first half’s 1.44 L/s predicts too much; the final half’s 0.48 L/s predicts too little.",
  },
];
get("app").innerHTML =
  `<a class="skip" href="#fl-workshop">Skip to the experiment</a><header class="masthead"><a class="wordmark" href="./">Dioptra <span lang="grc">διόπτρα</span></a><nav aria-label="Main"><a href="./">15 · Tunnel survey</a><a href="#fl-workshop">Collect the water</a><a href="#fl-reading">Read the Greek</a><a href="#fl-sources">Printed evidence</a></nav></header><main>
<section class="opening fl-opening"><div><p class="eyebrow">Hero of Alexandria / Dioptra 31</p><h1>Water needs<br>a clock.</h1></div><div class="opening-note fl-quote"><p lang="grc">ἀλλὰ καὶ τὸ τάχος αὐτοῦ</p><p>“Its speed is needed too.”</p><p>The width and depth of a stream cannot tell you how much water it supplies. Hero’s next move is to collect the water—and observe the time.</p><a href="#fl-workshop">Try the missing measurement ↓</a></div></section>
<section id="fl-workshop" class="fl-frame" aria-labelledby="fl-workshop-title"><div class="section-head"><div><p class="eyebrow">01 / Same opening, different supply</p><h2 id="fl-workshop-title">Count what arrives.</h2></div><p>Both streams have the same wetted section. Choose their mean speeds and replay a simulated twenty-second collection. All lengths, times and volumes below are modern teaching choices.</p></div>
<p id="fl-adjusted" class="fl-warning" role="status" hidden>Some shared settings were invalid. Those fields use the default values.</p>
<div class="fl-lab"><div class="fl-plates"><figure class="fl-plate" id="fl-stream-a"></figure><figure class="fl-plate" id="fl-stream-b"></figure></div><aside class="fl-controls" aria-label="Choose the experiment">${[
    ["width", "Wetted width", 4, 16, "cm"],
    ["depth", "Water depth", 1, 6, "cm"],
    ["speedA", "A · mean speed", 5, 30, "cm/s"],
    ["speedB", "B · initial mean speed", 5, 30, "cm/s"],
  ]
    .map(
      ([key, label, min, max, unit]) =>
        `<div><label for="fl-${key}">${label}<output id="fl-${key}-value" for="fl-${key}"></output></label><input id="fl-${key}" type="range" min="${min}" max="${max}" step="1" aria-description="${unit}"/></div>`,
    )
    .join("")}
<label class="fl-check" for="fl-variable"><input id="fl-variable" type="checkbox"/><span>Change B to A’s speed after ten seconds</span></label><p class="small fl-control-note">Changing supply connects to the chapter’s opening warning. The abrupt switch is a chosen exercise, not a rainfall simulation.</p><div class="fl-actions"><button id="fl-equal" type="button">Match the speeds</button><button id="fl-reset" type="button">Reset 10 / 30</button></div></aside></div>
<div class="fl-player"><div class="fl-actions"><button id="fl-play" type="button" class="primary">Replay collection</button><button id="fl-finish" type="button">Show full run</button></div><div><label for="fl-time">Inspect the recorded time <output id="fl-time-value" for="fl-time"></output></label><input id="fl-time" type="range" min="0" max="20" step="0.1"/><p class="small">The full record below stays available while you replay it. Playback pauses when you change a setting or leave the tab.</p></div></div><div id="fl-result" class="fl-results fl-number"></div><p class="small fl-limit">${FLOW_BOUNDARY} The end and side views use different scales, each with equal horizontal and vertical units; both receivers use the same linear 60 L scale. No animation runs until you choose Replay.</p></section>
<section id="fl-record" class="fl-frame" aria-labelledby="fl-record-title"><div class="section-head"><div><p class="eyebrow">02 / Measure a window, question an estimate</p><h2 id="fl-record-title">Which twenty seconds<br>does your sample describe?</h2></div><p>Collected volume divided by elapsed time gives an average for that interval. Extending it to the whole run is an additional assumption. Try the changing supply, then compare the first and last ten seconds.</p></div><div class="fl-record"><div><div id="fl-plot"></div><div class="fl-legend"><span>A · collected</span><span>B · collected</span><span>B · extended average</span></div><p class="small">The shaded interval is measured. The dashed line applies its B average to an empty receiver for the entire twenty seconds. The dotted vertical line is the replay cursor.</p></div><div><div class="fl-actions" aria-label="Measurement interval"><button type="button" data-window="first">First 10 s</button><button type="button" data-window="last">Last 10 s</button><button type="button" data-window="whole">Whole 20 s</button></div><div id="fl-account" class="fl-table" role="region" tabindex="0" aria-label="Measured volumes and average supplies"></div><p id="fl-equation" class="fl-equation fl-number"></p><div id="fl-prediction" class="fl-reason"></div><button id="fl-changing-example" type="button" class="text-button">Try the changing-flow example →</button></div></div><details><summary>Why area × speed gives supply in this model</summary><p>In one second a uniform stream advances a length equal to its speed in centimetres per second. Multiply that length by its wetted area in square centimetres: you have cubic centimetres per second. Divide by 1,000 for litres per second.</p><p>This uses the mean velocity normal to the section, complete collection and no storage delay. It does not assume every real particle has the same velocity. Hero’s chapter gives a verbal comparison and a collection method, not this modern algebraic formula.</p><p>At the exact ten-second change, the displayed speed is the speed after the change. Collected volume stays continuous. The complete record’s average remains valid when speed varies.</p></details></section>
<section class="fl-bridge"><div><p class="eyebrow">03 / What “twelve fingers” measures</p><h2>Two lengths<br>are not a supply.</h2><p>Hero’s example has water two finger-widths deep and an opening six finger-widths wide. Six times two makes twelve. The product describes a section, although the text calls it “twelve fingers”.</p><p>It gives neither a volume nor a time. The chosen centimetres in this experiment are not a conversion of those finger-widths.</p><button type="button" data-read="5" class="text-button">Read the six-times-two passage ↓</button></div><div class="fl-counterexample"><p class="eyebrow">An edited text, with its evidence</p><p class="fl-keyword" lang="grc">τάχος / πάχος</p><h3>Speed / thickness</h3><p>Schöne’s printed text says “speed”; the apparatus records “thickness” at that point. One letter changes the physical quantity. The following sentence compares faster and slower flow.</p><p>The lesson follows the edited reading and keeps the full page beside it. It does not turn an editorial choice into an ancient autograph.</p><button type="button" data-read="7" class="text-button">Inspect the word and its apparatus ↓</button></div></section>
<section id="fl-reading" class="fl-reading fl-frame" aria-labelledby="fl-reading-title"><div class="section-head"><div><p class="eyebrow">04 / The complete chapter, in eleven units</p><h2 id="fl-reading-title">Read the measurement.</h2></div><div><label for="fl-passage">Choose a reading</label><select id="fl-passage">${flowPassages.map((p, i) => `<option value="${i}">${i + 1}. ${p.title}</option>`).join("")}</select><p class="small">Edited Greek, new English and language notes. Schöne’s 1903 German remains in the source pages. No Greek prerequisite is assumed.</p></div></div><article id="fl-passage-article"><p id="fl-ref" class="fl-read-ref"></p><h3 id="fl-passage-title"></h3><div class="fl-greek-grid"><div><p class="eyebrow">Greek / Schöne’s edited text</p><p id="fl-greek" class="greek" lang="grc"></p></div><div><p class="eyebrow">English / new translation</p><p id="fl-english"></p><details open><summary><span id="fl-word" lang="grc"></span> · <span id="fl-gloss"></span></summary><p id="fl-note"></p></details></div></div><div class="fl-actions fl-reading-nav"><button id="fl-previous" type="button">Previous reading</button><button id="fl-next" type="button">Next reading</button><button id="fl-inspect" type="button">Inspect the printed page ↓</button></div></article>
<details class="fl-questions"><summary>Three questions about the measurement</summary><form id="fl-question" class="fl-question"></form><p id="fl-feedback" role="status"></p><button id="fl-question-next" type="button">Next question</button></details></section>
<section id="fl-sources" class="fl-frame" aria-labelledby="fl-sources-title"><div class="section-head"><div><p class="eyebrow">05 / Four complete pages</p><h2 id="fl-sources-title">Keep the argument<br>beside the apparatus.</h2></div><p>Hermann Schöne, <cite>Herons von Alexandria Vermessungslehre und Dioptra</cite>, Leipzig, 1903, pp. 284–287. The chapter begins below a triangle calculation and ends before the next surveying task.</p></div><div class="fl-source-layout"><div class="fl-source-controls"><label for="fl-source">Printed page</label><select id="fl-source">${flowSources.map((p) => `<option value="${p.page}">${p.page} · ${p.title}</option>`).join("")}</select><h3 id="fl-source-heading" class="fl-source-title"></h3><p id="fl-source-note"></p><button id="fl-zoom" type="button" aria-pressed="false">Enlarge the page</button><a id="fl-full-image" target="_blank" rel="noopener">Full-size image ↗</a><a id="fl-volume" target="_blank" rel="noopener">Source volume ↗</a><a href="./sources/manifest.json">Image identities and page mapping</a><p id="fl-source-status" role="status"></p></div><div class="fl-source-pan" id="fl-source-pan" role="region" tabindex="0" aria-label="Printed page; scroll to inspect enlarged details"><img id="fl-source-image" class="fl-source-image" width="1079" height="1550" loading="lazy" alt=""/></div></div><details><summary>Transcription, units and interpretation</summary><p>Greek adapted from the <a href="${TEI_SOURCE}">Harvard College Library / Open Greek and Latin transcription</a>, 2018, CC BY-SA 4.0. The complete <a href="./sources/dioptra-grc.xml">unchanged TEI file</a> is included. New English, grammar and teaching prose use the same license; code and new diagrams are MIT.</p><p>Line-end hyphens and whitespace are joined. Line numbers, apparatus and deleted letters are omitted in the reading. The digital duplicate “μενον” after στοχασάμενον is removed following the printed line; ὀρῶν follows the printed mountain word. The supplied twelve-finger conclusion keeps angle brackets; its deleted duplicate is omitted. Full scans retain every mark.</p><p>The printed τάχος, speed, is read alongside the apparatus’s τὸ πάχος, thickness. Ὄγκος is rendered “size” in the stream-section argument, not silently assigned the modern meaning of three-dimensional volume. The text gives no numerical receiver dimensions or timing interval. No fixed finger or sundial-hour conversion is used.</p><p>${FLOW_BOUNDARY}</p></details></section>
<section id="fl-save" class="save-section"><div><p class="eyebrow">06 / Take the evidence with you</p><h2>Keep a measured reading.</h2><p>Save your two streams, collection record, measured window, all eleven Greek-and-English readings, four source pages, fonts and licenses in one file. Open it from disk or print it to PDF.</p><div class="fl-actions"><button id="fl-save-reading" type="button" class="primary">Save illustrated reading</button><button id="fl-save-csv" type="button">Save collection CSV</button><button id="fl-save-svg" type="button">Save receivers SVG</button><button id="fl-share" type="button">Share this experiment</button></div><p id="fl-save-status" class="fl-status" role="status"></p><label id="fl-share-label" for="fl-share-url" hidden>Copy this view link</label><input id="fl-share-url" readonly hidden/></div><div><h3>Another use of the dioptra</h3><p>The chapter uses the dioptra to find a low outlet. In chapter 15 it establishes directions for a tunnel whose entrances cannot see one another.</p><a href="./">Open the tunnel survey →</a><p><a href="https://github.com/antonsoo/dioptra">Source, model and review ↗</a></p></div></section></main><footer><span>Dioptra · a measured reading of Hero</span><span id="fl-offline" role="status">Checking offline edition…</span><a href="./sources/NOTICES.txt">Licenses and credits</a></footer>`;
const style = document.createElement("style");
style.textContent = FLOW_INK;
document.head.append(style);
function commit(patch: Partial<FlowState>, replace = false) {
  state = normalizeFlow({ ...state, ...patch });
  parsed.adjusted = false;
  history[replace ? "replaceState" : "pushState"](
    null,
    "",
    `${location.pathname}${flowQuery(state)}${location.hash}`,
  );
  render();
}
function pause() {
  playing = false;
  cancelAnimationFrame(frame);
  get("fl-play").textContent = state.time >= 20 ? "Replay collection" : "Continue replay";
}
function render() {
  get("fl-adjusted").hidden = !parsed.adjusted;
  get("fl-stream-a").innerHTML = receiverDrawing(state, "A", "live-a");
  get("fl-stream-b").innerHTML = receiverDrawing(state, "B", "live-b");
  for (const key of ["width", "depth", "speedA", "speedB"] as const) {
    get<HTMLInputElement>(`fl-${key}`).value = String(state[key]);
    get(`fl-${key}-value`).textContent = `${state[key]} ${key.startsWith("speed") ? "cm/s" : "cm"}`;
  }
  get<HTMLInputElement>("fl-time").value = String(state.time);
  get("fl-time-value").textContent = `${f(state.time)} / 20 s`;
  get<HTMLInputElement>("fl-variable").checked = state.variable;
  get("fl-play").textContent = playing
    ? "Pause replay"
    : state.time >= 20
      ? "Replay collection"
      : "Continue replay";
  get("fl-result").innerHTML =
    `<p>Same <strong>${flowArea(state)} cm²</strong> section. At ${f(state.time)} s: <strong>A ${f(flowVolume(state, "A"))} L</strong> · <strong>B ${f(flowVolume(state, "B"))} L</strong>.</p>`;
  get("fl-plot").innerHTML = flowPlot(state, "live-plot");
  get("fl-account").innerHTML = flowAccount(state);
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-window]"))
    button.setAttribute("aria-pressed", String(button.dataset.window === state.window));
  const w = flowWindow(state),
    b = w.streams[1];
  if (!b) throw new Error("Missing B");
  get("fl-equation").textContent = `B: ${f(b.volume)} L ÷ ${w.duration} s = ${f(b.average)} L/s`;
  const delta = b.extrapolated - b.actual;
  get("fl-prediction").innerHTML =
    `<p>Extend this average to 20 s: <strong>${f(b.extrapolated)} L</strong>.<br>The complete record: <strong>${f(b.actual)} L</strong>.</p><p>${Math.abs(delta) < 1e-8 ? (state.window === "whole" ? "The whole interval measures its own average, including any change within it." : "This interval represents this run: its extended estimate matches the total.") : `This sample ${delta > 0 ? "overestimates" : "underestimates"} the total by ${f(Math.abs(delta))} L. The rate did not stay representative.`}</p>`;
  const p = flowPassages[state.reading];
  if (!p) throw new Error("Missing passage");
  get<HTMLSelectElement>("fl-passage").value = String(state.reading);
  for (const [id, value] of Object.entries({
    "fl-ref": `Dioptra 31 · ${p.ref}`,
    "fl-passage-title": `${state.reading + 1}. ${p.title}`,
    "fl-greek": p.greek,
    "fl-english": p.english,
    "fl-word": p.word,
    "fl-gloss": p.gloss,
    "fl-note": p.note,
  }))
    get(id).textContent = value;
  get<HTMLButtonElement>("fl-previous").disabled = state.reading === 0;
  get<HTMLButtonElement>("fl-next").disabled = state.reading === flowPassages.length - 1;
}
function source(page: number) {
  const p = flowSources.find((x) => x.page === page);
  if (!p) return;
  selectedSource = page;
  get<HTMLSelectElement>("fl-source").value = String(page);
  get("fl-source-heading").textContent = p.title;
  get("fl-source-note").textContent = p.note;
  const image = get<HTMLImageElement>("fl-source-image");
  image.src = `${import.meta.env.BASE_URL}sources/schone-${page}.jpg`;
  image.alt = `Schöne’s complete printed page ${page}: ${p.title}`;
  get<HTMLAnchorElement>("fl-full-image").href = image.src;
  get<HTMLAnchorElement>("fl-volume").href = `${SOURCE}/page/${page}/mode/1up`;
  get("fl-source-status").textContent = "";
}
function showSection(id: string) {
  const e = get(id);
  e.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth",
  });
  e.tabIndex = -1;
  e.focus({ preventScroll: true });
}
for (const key of ["width", "depth", "speedA", "speedB", "time"] as NumericFlowKey[])
  get(`fl-${key}`).addEventListener("input", () => {
    pause();
    commit({ [key]: Number(get<HTMLInputElement>(`fl-${key}`).value) }, true);
  });
get("fl-variable").addEventListener("change", () => {
  pause();
  commit({ variable: get<HTMLInputElement>("fl-variable").checked });
});
get("fl-equal").addEventListener("click", () => {
  pause();
  commit({ speedB: state.speedA });
});
get("fl-reset").addEventListener("click", () => {
  pause();
  commit({ ...FLOW_DEFAULT, reading: state.reading });
});
get("fl-finish").addEventListener("click", () => {
  pause();
  commit({ time: 20 });
});
get("fl-play").addEventListener("click", () => {
  if (playing) {
    pause();
    return;
  }
  if (state.time >= 20) commit({ time: 0 });
  playing = true;
  last = performance.now();
  let elapsed = state.time;
  const tick = (now: number) => {
    elapsed += (now - last) / 1000;
    last = now;
    if (Math.min(20, Math.round(elapsed * 10) / 10) !== state.time)
      commit({ time: Math.min(20, elapsed) }, true);
    if (elapsed >= 20) pause();
    else frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  render();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-window]"))
  button.addEventListener("click", () => {
    pause();
    commit({ window: button.dataset.window as FlowState["window"] });
  });
get("fl-changing-example").addEventListener("click", () => {
  pause();
  commit({ ...FLOW_DEFAULT, variable: true, window: "first", reading: state.reading });
});
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-read]"))
  button.addEventListener("click", () => {
    pause();
    commit({ reading: Number(button.dataset.read) });
    showSection("fl-reading");
  });
get("fl-passage").addEventListener("change", () =>
  commit({ reading: Number(get<HTMLSelectElement>("fl-passage").value) }),
);
get("fl-previous").addEventListener("click", () => commit({ reading: state.reading - 1 }));
get("fl-next").addEventListener("click", () => commit({ reading: state.reading + 1 }));
get("fl-inspect").addEventListener("click", () => {
  source(flowPassages[state.reading]?.page ?? 284);
  showSection("fl-sources");
});
get("fl-source").addEventListener("change", () =>
  source(Number(get<HTMLSelectElement>("fl-source").value)),
);
get("fl-source-image").addEventListener("error", () => {
  get("fl-source-status").textContent =
    `Page ${selectedSource} could not load. Reconnect or use the full-size image link.`;
});
get("fl-zoom").addEventListener("click", () => {
  const zoom = get("fl-source-pan").classList.toggle("fl-enlarged");
  get("fl-zoom").setAttribute("aria-pressed", String(zoom));
  get("fl-zoom").textContent = zoom ? "Fit the page" : "Enlarge the page";
});
function renderQuestion() {
  const q = questions[question];
  if (!q) throw new Error("Missing question");
  get("fl-question").innerHTML =
    `<fieldset><legend>${q.title}</legend>${q.choices.map((c, i) => `<label><input required type="radio" name="fl-answer" value="${i}"/>${esc(c)}</label>`).join("")}</fieldset><button type="submit">Check the reasoning</button>`;
  get("fl-feedback").textContent = "";
}
get("fl-question").addEventListener("submit", (event) => {
  event.preventDefault();
  const a = document.querySelector<HTMLInputElement>('input[name="fl-answer"]:checked'),
    q = questions[question];
  if (a && q)
    get("fl-feedback").textContent =
      `${Number(a.value) === q.answer ? "Yes." : "Try again."} ${q.reason}`;
});
get("fl-question-next").addEventListener("click", () => {
  question = (question + 1) % questions.length;
  renderQuestion();
});
get("fl-save-csv").addEventListener("click", () =>
  download(flowCsv(state), "dioptra-flow.csv", "text/csv;charset=utf-8"),
);
get("fl-save-svg").addEventListener("click", () =>
  download(flowSvg(state), "dioptra-flow.svg", "image/svg+xml"),
);
get("fl-save-reading").addEventListener("click", async () => {
  pause();
  const snapshot = { ...state },
    button = get<HTMLButtonElement>("fl-save-reading");
  button.disabled = true;
  get("fl-save-status").textContent = "Verifying four source pages and fonts…";
  try {
    download(await flowStudy(snapshot), "dioptra-flow-reading.html", "text/html;charset=utf-8");
    get("fl-save-status").textContent =
      "Saved the complete chapter, measured record and four source pages.";
  } catch (error) {
    get("fl-save-status").textContent =
      error instanceof Error ? error.message : "Could not save the reading.";
  } finally {
    button.disabled = false;
  }
});
get("fl-share").addEventListener("click", async () => {
  pause();
  const url = `${location.origin}${location.pathname}${flowQuery(state)}#fl-workshop`;
  get("fl-share-label").hidden = false;
  const input = get<HTMLInputElement>("fl-share-url");
  input.hidden = false;
  input.value = url;
  input.focus();
  input.select();
  try {
    await navigator.clipboard.writeText(url);
    get("fl-save-status").textContent = "Copied the experiment link.";
  } catch {
    get("fl-save-status").textContent = "Copy the selected experiment link.";
  }
});
addEventListener("popstate", () => {
  pause();
  parsed = parseFlow(location.search);
  state = parsed.state;
  render();
});
render();
renderQuestion();
source(284);
void offlineStatus(get("fl-offline"));
