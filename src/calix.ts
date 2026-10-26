import license from "../LICENSE?raw";
import {
  CALIX_LIMITS,
  CALIX_PHYSICS,
  calixPages,
  calixPassages,
  FRONTINUS_ENGLISH,
  FRONTINUS_LATIN,
  FRONTINUS_SOURCE,
} from "./calix-content";
import { calixBores, calixRig, calixSvg, calixTable, decimal, html } from "./calix-drawing";
import { calixStudy, verifiedCalix } from "./calix-files";
import {
  CALIX_BOUNDS,
  CALIX_INITIAL,
  type CalixSettings,
  type CalixState,
  calixCSV,
  calixModel,
  calixQuery,
  calixSettings,
  exactText,
  readCalix,
} from "./calix-model";
import { offlineStatus } from "./offline";

function get<T extends HTMLElement = HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw Error(`Missing ${id}`);
  return e as T;
}
let parsed = readCalix(location.search),
  state = parsed.state,
  frame = 0,
  playing = false,
  progress = 1,
  sourceTicket = 0,
  sourceURL = "",
  selectedPage = "",
  zoomed = false;
const presets: { id: string; label: string; settings: CalixSettings }[] = [
  {
    id: "double",
    label: "Double the diameter",
    settings: { quarters: 10, count: 1, head: 16, duration: 1 },
  },
  {
    id: "four",
    label: "Four small openings",
    settings: { quarters: 5, count: 4, head: 16, duration: 1 },
  },
  {
    id: "same",
    label: "Same delivery, wider opening",
    settings: { quarters: 10, count: 1, head: 1, duration: 1 },
  },
  {
    id: "head",
    label: "Same opening, four times the head",
    settings: { quarters: 5, count: 1, head: 64, duration: 1 },
  },
];
get("app").innerHTML =
  `<a class="skip" href="#cx-workshop">Skip to the experiment</a><header class="masthead"><a class="wordmark" href="./">Dioptra <span lang="grc">διόπτρα</span></a><nav aria-label="Main"><a href="./flow.html">Hero · Collect the water</a><a href="#cx-workshop">Compare openings</a><a href="#cx-reading">Read the Latin</a><a href="#cx-sources">Printed evidence</a></nav></header><main>
<section class="opening cx-opening"><div><p class="eyebrow">Frontinus / De aquis urbis Romae / c. 97 CE</p><h1>Double the bore.<br>Four times<br>the opening.</h1></div><div class="opening-note"><p class="cx-latin" lang="la">minore pressura</p><p>“With less pressure.”</p><p>A Roman pipe name can count quarter-digits across its diameter. That makes the next size more than a name change. But even the opening’s area cannot tell you how much water arrives.</p><a href="#cx-workshop">Try the diameter. Then change the head. ↓</a></div></section>
<section id="cx-workshop" class="cx-section" aria-labelledby="cx-workshop-title"><div class="section-head"><div><p class="eyebrow">01 / Geometry first, delivery second</p><h2 id="cx-workshop-title">A name can<br>conceal a square.</h2></div><p>The reference is one circular opening five quarter-digits across: Frontinus’s probable explanation of <i lang="la">quinaria</i>. Choose a second opening and compare both at a maintained water level. Head means the vertical distance from the surface to the outlet.</p></div>
<p id="cx-invalid" class="cx-warning" role="status" hidden></p><div class="cx-lab"><div class="cx-geometry"><p class="eyebrow">Equal length scale / source digits</p><div id="cx-bores"></div><p class="cx-small">Separate circles compare total open area. They are not packed inside one larger circle. The line through each opening marks its diameter.</p><div id="cx-area" class="cx-equation"></div><button type="button" class="text-button" data-read="8">Read the ten-pipe’s four quinariae ↓</button></div>
<div class="cx-controls"><h3>Keep the reference.<br>Change the comparison.</h3>${(
    [
      ["quarters", "Diameter / quarter-digits"],
      ["count", "Number of separate openings"],
      ["head", "Head / chosen units"],
      ["duration", "Collection / chosen time units"],
    ] as const
  )
    .map(
      ([key, label]) =>
        `<div><label for="cx-${key}">${label}<output id="cx-${key}-value" for="cx-${key}"></output></label><input id="cx-${key}" type="range" min="${CALIX_BOUNDS[key][0]}" max="${CALIX_BOUNDS[key][1]}" step="1"></div>`,
    )
    .join(
      "",
    )}<p class="cx-small">One source digit stays a source digit. Head and time use chosen comparison units; they are not Roman measurements. Both reservoir levels are held steady.</p></div>
<div class="cx-delivery"><p class="eyebrow">Modern ideal outlets / constant heads</p><div id="cx-rig"></div><p class="cx-small">The head rulers share one vertical scale. Collection bars share one linear scale, rescaled for each setup. Reservoir width is schematic; outlet marks do not show bore diameter.</p></div></div>
<div class="cx-results" id="cx-results" aria-live="polite" aria-atomic="true"></div><div class="cx-actions"><button type="button" class="primary" id="cx-play">Replay calculated collection</button><button type="button" id="cx-record">Record this prediction</button><button type="button" id="cx-reset">Reset setup</button></div><p id="cx-run-status" role="status" class="cx-small">The complete calculated result is shown. Playback takes two screen seconds, regardless of the chosen time unit.</p>
<div class="cx-presets"><p class="eyebrow">Compare four arguments</p><div class="cx-actions">${presets.map((p) => `<button type="button" data-preset="${p.id}">${p.label}</button>`).join("")}</div></div>
<details class="cx-method"><summary>Why a wider opening can deliver the same amount</summary><p>For circles, opening area grows as diameter squared: A/A₀ = count × (D/D₀)². A modern ideal-orifice relation is Q = C A √(2gh). With the same coefficient C and gravity g, Q/Q₀ = (A/A₀) √(h/h₀).</p><p>Four times the open area needs just 1/16 of the reference head to give the same relative delivery in this model: 4 × √(1/16) = 1. Four times the head through the same opening doubles delivery. Collection time multiplies both volumes and does not change their ratio.</p><p>${CALIX_LIMITS}</p><p><a href="${CALIX_PHYSICS}" target="_blank" rel="noopener">Read the modern Bernoulli derivation ↗</a>. Frontinus supplies neither this algebraic formula nor a universal flow conversion.</p></details></section>
<section id="cx-book" class="cx-section" aria-labelledby="cx-book-title"><div class="section-head"><div><p class="eyebrow">02 / Keep the conditions with the number</p><h2 id="cx-book-title">Write what<br>you changed.</h2></div><p>Record a prediction before changing the rig. Compare a doubled diameter with four small openings, then lower the head. This book records calculated comparisons, not experimental observations of Roman equipment.</p></div><div id="cx-trials" class="cx-table" role="region" tabindex="0" aria-label="Recorded trial book; scroll horizontally if needed"></div><div class="cx-actions"><button type="button" id="cx-undo">Remove last trial</button><button type="button" id="cx-clear">Clear trial book</button><button type="button" id="cx-csv">Save trial CSV</button></div><p id="cx-book-status" role="status" class="cx-small"></p></section>
<section class="cx-bridge"><div><p class="eyebrow">03 / Read the qualification</p><h2>A bronze fitting<br>has a length.</h2><p>Frontinus’s <i lang="la">calix</i> is an intake gauge of bronze, at least twelve digits long, with pipes attached. A thin mathematical opening leaves that tube length out.</p><p>In the preceding passage he names height, pressure and a longer supply route. The model lets you isolate head; a real pipe also has losses and an arrangement that must be known.</p><button type="button" class="text-button" data-read="7">Read what the calix actually is ↓</button></div><div><p class="eyebrow">A Greek comparison / a different measurement</p><h3>Hero asks for<br>water and time.</h3><p>Hero’s <i>Dioptra</i> warns that a stream’s width and depth are insufficient. His method collects water and observes the time. Here we predict relative delivery under stated assumptions; there you inspect an average over a collection interval.</p><a href="./flow.html#fl-reading">Compare the Greek measurement argument →</a></div></section>
<section id="cx-reading" class="cx-section" aria-labelledby="cx-reading-title"><div class="section-head"><div><p class="eyebrow">04 / Nine Latin readings, with new English</p><h2 id="cx-reading-title">Diameter. Opening.<br>Pressure.</h2></div><div><label for="cx-passage">Choose a passage</label><select id="cx-passage">${calixPassages.map((p, i) => `<option value="${i}">${i + 1}. ${p.title}</option>`).join("")}</select><p class="cx-small">Selections from Bücheler’s 1858 edition. Joined printed lines, u/v spelling retained, apparatus omitted from excerpts. Full pages retain the editorial evidence.</p></div></div><article class="cx-reading"><p id="cx-reference" class="eyebrow"></p><h3 id="cx-passage-title"></h3><div class="cx-reading-grid"><div><p class="eyebrow">Latin / printed edition</p><p id="cx-latin" lang="la" class="cx-latin"></p></div><div><p class="eyebrow">English / new translation</p><p id="cx-english"></p><div id="cx-words"></div></div></div><p id="cx-note" class="cx-note"></p><div class="cx-actions"><button type="button" id="cx-previous">Previous reading</button><button type="button" id="cx-next">Next reading</button><button type="button" id="cx-find">Find on the printed page ↓</button></div></article></section>
<section id="cx-sources" class="cx-section" aria-labelledby="cx-sources-title"><div class="section-head"><div><p class="eyebrow">05 / Six complete pages, including the title</p><h2 id="cx-sources-title">Keep the apparatus<br>beside the excerpt.</h2></div><p><i>Iulii Frontini De aquis urbis Romae libri II</i>, edited by Franz Bücheler, Leipzig: B. G. Teubner, 1858. The selected readings do not repair the whole capacity table. Different edited fractions remain visible in the retained witness.</p></div><div class="cx-source-layout"><div><label for="cx-page">Printed page</label><select id="cx-page">${calixPages.map((p) => `<option value="${p.page}">${p.page} · ${p.title}</option>`).join("")}</select><h3 id="cx-page-title"></h3><p id="cx-page-note" class="cx-small"></p><div class="cx-source-links"><button type="button" id="cx-zoom" aria-pressed="false">Enlarge the page</button><a id="cx-image-link" target="_blank" rel="noopener">Full-size image ↗</a><a id="cx-volume-link" target="_blank" rel="noopener">Source volume at this leaf ↗</a><a href="./sources/frontinus/manifest.json">Page identities and PDF mapping</a></div><p id="cx-source-status" role="status" class="cx-small"></p></div><div id="cx-pan" class="cx-pan" tabindex="0" role="region" aria-label="Printed source page; scroll to inspect the enlarged text"><div id="cx-image-frame"><img id="cx-source-image" alt=""><div id="cx-band" hidden></div></div></div></div><details class="cx-method"><summary>Edition choices, table limits and source rights</summary><p>The source’s quinaria etymology is explicitly probable. The adjustable diameter follows the five-to-ten quarter-digit sequence, without extending that naming rule into the larger area-based scheme. The ten-pipe’s reported four quinariae agrees with a doubled circular diameter. Other table fractions have editorial variants; this lesson does not force the table into agreement or convert its reported capacities into measured flow.</p><p>The I.43 excerpt marks an omission of circumference figures with an ellipsis. The remaining excerpts join printed lines. These are selected passages rather than a complete book or chapter transcription. Page images are full, uncropped public-domain scans; orange bands are a separate reading aid and do not alter the image.</p><p><a href="${FRONTINUS_LATIN}" target="_blank" rel="noopener">Compare the Latin Library text ↗</a> · <a href="${FRONTINUS_ENGLISH}" target="_blank" rel="noopener">Bennett’s 1925 English translation ↗</a>. Our excerpt and page pairing follows the retained 1858 edition.</p></details></section>
<section id="cx-save" class="cx-section cx-save" aria-labelledby="cx-save-title"><div class="section-head"><div><p class="eyebrow">06 / Keep the reading and the conditions</p><h2 id="cx-save-title">Take the evidence<br>with the result.</h2></div><p>Save one illustrated, script-free HTML file with your setup, trial book, all nine readings, six complete pages, fonts and licenses. Open it from disk or print it. The CSV keeps exact ratios alongside rounded square roots.</p></div><div class="cx-actions"><button type="button" class="primary" id="cx-save-html">Save illustrated reading</button><button type="button" id="cx-save-svg">Save openings SVG</button><button type="button" id="cx-share">Share setup and trials</button></div><p id="cx-save-status" role="status"></p><label id="cx-share-label" for="cx-share-url" hidden>Copy this experiment link</label><input id="cx-share-url" readonly hidden></section></main><footer><span>Dioptra · Greek and Roman arguments about measurement</span><span id="cx-offline" role="status">Checking offline edition…</span><a href="./sources/frontinus/NOTICES.txt">Sources and licenses</a></footer>`;

function show(id: string) {
  const e = get(id);
  if (!e.hasAttribute("tabindex")) e.tabIndex = -1;
  e.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth",
  });
  e.focus({ preventScroll: true });
}
function pause() {
  cancelAnimationFrame(frame);
  playing = false;
  progress = 1;
  get("cx-play").textContent = "Replay calculated collection";
}
function commit(patch: Partial<CalixState>, replace = false) {
  const wasPlaying = playing;
  pause();
  if (wasPlaying)
    get("cx-run-status").textContent =
      "Playback stopped because the setup changed. The complete calculated result is shown.";
  state = { ...state, ...patch };
  parsed.error = "";
  history[replace ? "replaceState" : "pushState"](
    null,
    "",
    `${location.pathname}?${calixQuery(state)}${location.hash}`,
  );
  render();
}
function render() {
  const m = calixModel(state),
    p = calixPassages[state.reading];
  if (!p) throw Error("Missing reading");
  get("cx-invalid").hidden = !parsed.error;
  get("cx-invalid").textContent = parsed.error;
  for (const key of ["quarters", "count", "head", "duration"] as const) {
    get<HTMLInputElement>(`cx-${key}`).value = String(state[key]);
    get(`cx-${key}-value`).textContent =
      key === "quarters"
        ? `${state.quarters}/4 = ${exactText(m.diameter)} digits`
        : String(state[key]);
  }
  get("cx-bores").innerHTML = calixBores(state, "live-bores");
  get("cx-rig").innerHTML = calixRig(state, progress, "live-rig");
  get("cx-area").textContent =
    `${state.count} × (${exactText(m.diameterRatio)})² = ${exactText(m.areaRatio)} × the reference area`;
  get("cx-results").innerHTML =
    `<div><span>Opening area / A₀</span><strong>${exactText(m.areaRatio)} ×</strong></div><div><span>Head / h₀</span><strong>${exactText(m.headRatio)} ×</strong></div><div><span>Relative delivery / Q₀</span><strong id="cx-flow-value">${decimal(m.flowRatio)} ×</strong></div><p>${exactText(m.areaRatio)} × √(${exactText(m.headRatio)}) = ${decimal(m.flowRatio)}. ${Math.abs(m.flowRatio - 1) < 1e-10 ? "Equal delivery under these assumptions, with the reference conditions held fixed." : m.flowRatio > 1 ? "More delivery under these assumptions. A bigger name alone does not give this number." : "Less delivery under these assumptions, despite the selected opening area."}</p>`;
  get("cx-trials").innerHTML = state.trials.length
    ? calixTable(state.trials)
    : '<p class="cx-empty">Your trial book is empty. Record a setup to keep its conditions beside the result.</p>';
  get<HTMLButtonElement>("cx-record").disabled = state.trials.length >= 12;
  get<HTMLButtonElement>("cx-undo").disabled = !state.trials.length;
  get<HTMLButtonElement>("cx-clear").disabled = !state.trials.length;
  get<HTMLButtonElement>("cx-csv").disabled = !state.trials.length;
  get("cx-book-status").textContent =
    `${state.trials.length} / 12 predictions retained in the shared link. ${state.trials.length >= 12 ? "Remove a trial before adding another." : "Repeated setups are allowed for comparison."}`;
  get<HTMLSelectElement>("cx-passage").value = String(state.reading);
  for (const [id, value] of Object.entries({
    "cx-reference": `Frontinus ${p.ref} · printed p. ${p.page}`,
    "cx-passage-title": p.title,
    "cx-latin": p.latin,
    "cx-english": p.english,
    "cx-note": p.note,
  }))
    get(id).textContent = value;
  get("cx-words").innerHTML = p.words
    .map(
      (w) =>
        `<details open><summary><span lang="la">${html(w.word)}</span> · ${html(w.gloss)}</summary><p>${html(w.note)}</p></details>`,
    )
    .join("");
  get<HTMLButtonElement>("cx-previous").disabled = state.reading === 0;
  get<HTMLButtonElement>("cx-next").disabled = state.reading === 8;
  updateBand();
}
function updateBand() {
  const p = calixPassages[state.reading];
  if (!p) return;
  get("cx-band").hidden = selectedPage !== p.page;
  get("cx-band").style.top = `${p.band[0] * 100}%`;
  get("cx-band").style.height = `${p.band[1] * 100}%`;
}
async function source(page: string, find = false) {
  const p = calixPages.find((x) => x.page === page);
  if (!p) return;
  const ticket = ++sourceTicket;
  selectedPage = page;
  get<HTMLSelectElement>("cx-page").value = page;
  get("cx-page-title").textContent = p.title;
  get("cx-page-note").textContent =
    `Printed ${page === "title" ? "title page" : `p. ${page}`} · PDF page ${p.pdf} · archive leaf ${p.leaf}. The source image is checked against its retained SHA-256 identity before display.`;
  get<HTMLAnchorElement>("cx-image-link").href =
    `${import.meta.env.BASE_URL}sources/frontinus/${p.file}`;
  get<HTMLAnchorElement>("cx-volume-link").href = `${FRONTINUS_SOURCE}/page/n${p.leaf}/mode/1up`;
  get("cx-source-status").textContent = "Checking the printed page…";
  get("cx-image-frame").hidden = true;
  let nextURL = "";
  try {
    const bytes = await verifiedCalix(`sources/frontinus/${p.file}`);
    nextURL = URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
    const image = new Image();
    image.alt = `Bücheler 1858, ${page}: ${p.title}`;
    image.id = "cx-source-image";
    image.src = nextURL;
    await image.decode();
    if (ticket !== sourceTicket) {
      URL.revokeObjectURL(nextURL);
      return;
    }
    get("cx-source-image").replaceWith(image);
    if (sourceURL) URL.revokeObjectURL(sourceURL);
    sourceURL = nextURL;
    get("cx-image-frame").hidden = false;
    get("cx-source-status").textContent = "Source image verified for this edition.";
    updateBand();
    if (find) {
      zoom(true);
      requestAnimationFrame(() => {
        const pan = get("cx-pan"),
          band = get("cx-band"),
          box = get("cx-image-frame");
        pan.scrollLeft = (box.offsetWidth - pan.clientWidth) / 2;
        pan.scrollTop = band.offsetTop + band.offsetHeight / 2 - pan.clientHeight / 2;
        show("cx-pan");
      });
    } else {
      get("cx-pan").scrollTo(0, 0);
    }
  } catch (error) {
    if (nextURL) URL.revokeObjectURL(nextURL);
    if (ticket === sourceTicket)
      get("cx-source-status").textContent =
        `${error instanceof Error ? error.message : "Unable to verify this page."} Choose a page again to retry.`;
  }
}
function zoom(value: boolean) {
  zoomed = value;
  get("cx-image-frame").classList.toggle("cx-enlarged", value);
  get("cx-zoom").setAttribute("aria-pressed", String(value));
  get("cx-zoom").textContent = value ? "Fit the complete page" : "Enlarge the page";
}
function download(text: string, name: string, type: string) {
  const u = URL.createObjectURL(new Blob([text], { type })),
    a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 30000);
}
for (const key of ["quarters", "count", "head", "duration"] as const)
  get(`cx-${key}`).addEventListener("input", () =>
    commit({ [key]: Number(get<HTMLInputElement>(`cx-${key}`).value) }, true),
  );
for (const b of document.querySelectorAll<HTMLButtonElement>("[data-preset]"))
  b.addEventListener("click", () => {
    const p = presets.find((p) => p.id === b.dataset.preset);
    if (p) commit(p.settings);
  });
get("cx-reset").addEventListener("click", () => commit(calixSettings(CALIX_INITIAL)));
get("cx-record").addEventListener("click", () => {
  if (state.trials.length < 12) commit({ trials: [...state.trials, calixSettings(state)] });
});
get("cx-undo").addEventListener("click", () => commit({ trials: state.trials.slice(0, -1) }));
get("cx-clear").addEventListener("click", () => commit({ trials: [] }));
get("cx-csv").addEventListener("click", () =>
  download(calixCSV(state), "dioptra-calix-trials.csv", "text/csv;charset=utf-8"),
);
get("cx-play").addEventListener("click", () => {
  if (playing) {
    pause();
    render();
    get("cx-run-status").textContent = "Playback stopped. The complete calculated result is shown.";
    return;
  }
  playing = true;
  progress = 0;
  get("cx-play").textContent = "Stop playback";
  get("cx-run-status").textContent =
    "Replaying a calculated collection over two screen seconds. The chosen time unit has no conversion to seconds.";
  let start: number | undefined;
  const tick = (now: number) => {
    start ??= now;
    progress = Math.min(1, (now - start) / 2000);
    get("cx-rig").innerHTML = calixRig(state, progress, "live-rig");
    if (progress < 1) frame = requestAnimationFrame(tick);
    else {
      pause();
      get("cx-run-status").textContent =
        "Calculated collection complete. Record the conditions to compare another setup.";
    }
  };
  frame = requestAnimationFrame(tick);
});
get("cx-passage").addEventListener("change", () =>
  commit({ reading: Number(get<HTMLSelectElement>("cx-passage").value) }),
);
get("cx-previous").addEventListener("click", () =>
  commit({ reading: Math.max(0, state.reading - 1) }),
);
get("cx-next").addEventListener("click", () => commit({ reading: Math.min(8, state.reading + 1) }));
for (const b of document.querySelectorAll<HTMLButtonElement>("[data-read]"))
  b.addEventListener("click", () => {
    commit({ reading: Number(b.dataset.read) });
    show("cx-reading");
  });
get("cx-find").addEventListener("click", () => {
  const p = calixPassages[state.reading];
  if (p) void source(p.page, true);
});
get("cx-page").addEventListener(
  "change",
  () => void source(get<HTMLSelectElement>("cx-page").value),
);
get("cx-zoom").addEventListener("click", () => zoom(!zoomed));
get("cx-save-svg").addEventListener("click", () =>
  download(calixSvg(state, license), "dioptra-calix-openings.svg", "image/svg+xml"),
);
get("cx-save-html").addEventListener("click", async () => {
  const b = get<HTMLButtonElement>("cx-save-html"),
    snapshot = structuredClone(state);
  b.disabled = true;
  get("cx-save-status").textContent = "Verifying all six source pages, fonts and licenses…";
  try {
    const text = await calixStudy(snapshot);
    download(text, "dioptra-calix-reading.html", "text/html;charset=utf-8");
    get("cx-save-status").textContent =
      "Complete illustrated reading saved with the setup and trial book from when you chose Save.";
  } catch (error) {
    get("cx-save-status").textContent =
      error instanceof Error ? error.message : "Reading could not be saved.";
  } finally {
    b.disabled = false;
  }
});
get("cx-share").addEventListener("click", async () => {
  const u = new URL(location.href);
  u.search = calixQuery(state);
  u.hash = "cx-workshop";
  const input = get<HTMLInputElement>("cx-share-url");
  input.value = u.href;
  input.hidden = false;
  get("cx-share-label").hidden = false;
  input.focus();
  input.select();
  try {
    await navigator.clipboard.writeText(u.href);
    get("cx-save-status").textContent =
      "Link copied with the current setup, reading and complete trial book.";
  } catch {
    get("cx-save-status").textContent =
      "The selected link contains the setup, reading and complete trial book. Copy it from the field.";
  }
});
window.addEventListener("popstate", () => {
  pause();
  parsed = readCalix(location.search);
  state = parsed.state;
  render();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && playing) {
    pause();
    render();
    get("cx-run-status").textContent =
      "Playback stopped while the page was hidden. The complete result is shown.";
  }
});
render();
void source(calixPassages[state.reading]?.page ?? "014");
offlineStatus(get("cx-offline"));
