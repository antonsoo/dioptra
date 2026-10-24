// biome-ignore-all lint/performance/useDomNodeTextContent: Check the learner-visible reading.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox } from "playwright";

const out = path.resolve(process.argv[2] ?? "/tmp/dioptra-counter-browser");
const externalBase = process.argv[3] ? new URL(process.argv[3]).href : null;
if (externalBase && (!externalBase.endsWith("/dioptra/") || !externalBase.startsWith("https://")))
  throw new Error("Hosted review requires an HTTPS base ending in /dioptra/.");
await mkdir(out, { recursive: true });
const digest = (b) => createHash("sha256").update(b).digest("hex");
const manifest = JSON.parse(await readFile("public/sources/manifest.json", "utf8"));
const report = {
  checkedAt: new Date().toISOString(),
  mode: externalBase ? "canonical hosted production" : "local production",
  baseURL: externalBase,
  integrityScope: "Controlled local production responses; separate from the hosted browser matrix",
  workerSha256: digest(await readFile("dist/sw.js")),
  configurations: [],
  integrity: [],
};
async function serve() {
  let online = true;
  const server = createServer(async (req, res) => {
    if (!online) {
      req.socket.destroy();
      return;
    }
    try {
      const file =
        new URL(req.url, "http://local").pathname.replace(/^\/dioptra\//, "") || "index.html";
      assert(!file.includes(".."));
      const type =
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          ".svg": "image/svg+xml",
          ".jpg": "image/jpeg",
          ".json": "application/json",
          ".woff2": "font/woff2",
          ".ttf": "font/ttf",
        }[path.extname(file)] ?? "application/octet-stream";
      const bytes = await readFile(path.join("dist", file));
      res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" }).end(bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return {
    base: `http://127.0.0.1:${server.address().port}/dioptra/`,
    offline() {
      online = false;
      server.closeAllConnections();
    },
    async close() {
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
    },
  };
}
async function save(page, selector, file) {
  const pending = page.waitForEvent("download");
  await page.locator(selector).click();
  await (await pending).saveAs(file);
  return readFile(file);
}
async function noOverflow(page) {
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    "page overflow",
  );
}
async function decoded(page) {
  await page.locator("#ct-source-image").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const i = document.querySelector("#ct-source-image");
    return i.complete && i.naturalWidth > 0 && i.currentSrc === i.src;
  });
  await page.locator("#ct-source-image").evaluate((i) => i.decode());
}
async function svgBounds(page) {
  const clipped = await page
    .locator("#ct-mechanism svg, #ct-probe-drawing svg")
    .evaluateAll((roots) =>
      roots.flatMap((svg) => {
        const a = svg.getBoundingClientRect();
        return [...svg.querySelectorAll("text")]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            return (
              b.left < a.left - 1 ||
              b.right > a.right + 1 ||
              b.top < a.top - 1 ||
              b.bottom > a.bottom + 1
            );
          })
          .map((e) => e.textContent);
      }),
    );
  assert.deepEqual(clipped, [], "SVG text outside its canvas");
}
async function angles(page) {
  return page.locator("#ct-mechanism [data-dial]").evaluateAll((es) =>
    es.map((e) => ({
      dial: e.dataset.dial,
      angle: Number(e.dataset.angle),
      transform: e.getAttribute("transform"),
    })),
  );
}
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const server = await serve(),
        base = externalBase ?? server.base,
        folder = path.join(out, `${name}-${width}`);
      await mkdir(folder, { recursive: true });
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        acceptDownloads: true,
        reducedMotion: "reduce",
      });
      context.setDefaultTimeout(30000);
      try {
        const page = await context.newPage(),
          errors = [],
          consoleErrors = [],
          externalRequests = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => {
          if (m.type() === "error") consoleErrors.push(m.text());
        });
        page.on("request", (r) => {
          if (/^https?:/.test(r.url()) && !r.url().startsWith(base)) externalRequests.push(r.url());
        });
        await page.goto(`${base}counter.html`);
        await page.evaluate(() => document.fonts.ready);
        await noOverflow(page);
        for (const [w, trial] of [
          [0, 20],
          [159, 20],
          [4799, 20],
          [191, 24],
          [5759, 24],
          [7199, 30],
        ]) {
          await page.goto(
            `${base}counter.html?w=${w}&trial=${trial}&probe=${trial}&scale=measured`,
          );
          await page.evaluate(() => document.fonts.ready);
          await noOverflow(page);
          await svgBounds(page);
        }
        await page.goto(`${base}counter.html`);
        await page.evaluate(() => document.fonts.ready);
        await page.locator("#ct-cutaway").click();
        assert.equal(await page.locator("#ct-source-select").inputValue(), "295");
        await decoded(page);
        await page.locator("#ct-source-select").selectOption("298");
        await decoded(page);
        assert.match(await page.locator("#ct-indicated").innerText(), /1,200.*3 stadia/);
        assert.match(await page.locator("#ct-ledger").innerText(), /800.*2 stadia/);
        assert.equal(await page.locator("#ct-apply").isDisabled(), true);
        const originalAngles = await angles(page);
        assert.equal(originalAngles.find((a) => a.dial === "first").angle, 180);
        assert.equal(originalAngles.find((a) => a.dial === "second").angle, 6);
        // Keyboard advances are physical wheel turns, independently of the trial knob.
        await page.locator("#ct-turns").focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#ct-turns").inputValue(), "81");
        assert.equal((await angles(page)).find((a) => a.dial === "input").angle, 45);
        await page.locator('[data-scene="example"]').click();
        if (width === 1440) {
          for (let i = 0; i < 20; i++) {
            await page.locator("#ct-probe-step").focus();
            await page.keyboard.press("Enter");
          }
        } else {
          await page.locator("#ct-probe-play").click();
          await page.waitForFunction(
            () => Number(document.querySelector("#ct-probe-count").textContent.split(" ")[0]) >= 2,
          );
          await page.locator("#ct-probe-play").click();
          const paused = await page.locator("#ct-probe-count").innerText();
          await page.waitForTimeout(300);
          assert.equal(await page.locator("#ct-probe-count").innerText(), paused);
          await page.locator("#ct-probe-play").click();
          await page.waitForFunction(() => document.querySelector("#ct-apply").disabled === false);
        }
        await svgBounds(page);
        assert.match(await page.locator("#ct-observation").innerText(), /20.*1,600.*53 1\/3/s);
        assert.equal((await angles(page)).find((a) => a.dial === "first").angle, 180);
        await page.locator("#ct-apply").click();
        assert.match(await page.locator("#ct-indicated").innerText(), /800.*2 stadia/);
        assert.deepEqual(await angles(page), originalAngles);
        await page.locator("#ct-theory-scale").click();
        assert.match(await page.locator("#ct-indicated").innerText(), /1,200/);
        await page.goBack();
        assert.match(await page.locator("#ct-indicated").innerText(), /800/);
        assert.match(
          await page.locator("#ct-apply-status").innerText(),
          /Measured first-stage graduation is in use/,
        );
        await page.locator("#ct-workshop").screenshot({ path: path.join(folder, "workshop.png") });
        await page
          .locator("#ct-calibration")
          .screenshot({ path: path.join(folder, "calibration.png") });
        await page.locator('[data-scene="before"]').click();
        assert.match(await page.locator("#ct-indicated").innerText(), /1,590/);
        await page.locator("#ct-forward").click();
        assert.match(await page.locator("#ct-indicated").innerText(), /1,600/);
        assert.equal((await angles(page)).find((a) => a.dial === "first").angle, 0);
        assert.equal((await angles(page)).find((a) => a.dial === "second").angle, 12);
        await page.locator('[data-scene="wrap"]').click();
        assert.match(await page.locator("#ct-indicated").innerText(), /^0 cubits/);
        assert.match(await page.locator("#ct-ledger").innerText(), /48,000/);
        assert.match(await page.locator("#ct-wraps").innerText(), /^1 complete instrument circuit/);
        await page.locator("#ct-workshop").screenshot({ path: path.join(folder, "rollover.png") });
        await page.locator('[data-scene="theory"]').click();
        assert.match(await page.locator("#ct-ledger").innerText(), /72,000.*180 stadia/);
        assert.match(await page.locator("#ct-indicated").innerText(), /^0 cubits/);
        // A new, non-source trial exercises the method instead of a hardcoded 20.
        await page.locator("#ct-trial").selectOption("24");
        assert.equal(await page.locator("#ct-apply").isDisabled(), true);
        await page.locator('[data-scene="example"]').click();
        await page.locator("#ct-probe-play").click();
        await page.waitForFunction(() => document.querySelector("#ct-apply").disabled === false);
        assert.match(await page.locator("#ct-observation").innerText(), /64 cubits \/ division/);
        await page.locator("#ct-apply").click();
        assert.match(await page.locator("#ct-indicated").innerText(), /960.*2.4 stadia/);
        await page.locator("#ct-share").click();
        const shared = await page.locator("#ct-share-url").inputValue();
        await page.goto(shared);
        assert.match(await page.locator("#ct-indicated").innerText(), /960/);
        const q = new URL(page.url()).search;
        await page.getByRole("link", { name: "Read the Greek", exact: true }).click();
        assert.equal(new URL(page.url()).search, q);
        for (let i = 0; i < 14; i++) {
          await page.locator("#ct-reading-select").selectOption(String(i));
          assert((await page.locator("#ct-greek").innerText()).length > 80);
          assert((await page.locator("#ct-note").innerText()).length > 100);
        }
        await page.locator("#ct-reading-select").selectOption("6");
        assert.match(await page.locator("#ct-word").innerText(), /πείρᾳ/);
        await page.locator("#ct-reading").screenshot({ path: path.join(folder, "reading.png") });
        await page.locator("#ct-inspect").click();
        assert.equal(await page.locator("#ct-source-select").inputValue(), "298");
        for (let p = 292; p <= 303; p++) {
          await page.locator("#ct-source-select").selectOption(String(p));
          await decoded(page);
        }
        await page.locator("#ct-source-select").selectOption("298");
        await decoded(page);
        assert.match(await page.locator("#ct-source-link").getAttribute("href"), /page\/n313/);
        await page.locator("#ct-printed").screenshot({ path: path.join(folder, "source.png") });
        await page.locator("#ct-zoom").click();
        await page.locator("#ct-pan").focus();
        await page.keyboard.press("End");
        assert(await page.locator("#ct-pan").evaluate((e) => e.scrollWidth > e.clientWidth));
        await page.locator("#ct-zoom").click();
        // Save Hero's actual worked trial as the retained study, not the extra trial.
        await page.locator("#ct-trial").selectOption("20");
        await page.locator('[data-scene="example"]').click();
        await page.locator("#ct-probe-play").click();
        await page.waitForFunction(() => document.querySelector("#ct-apply").disabled === false);
        await page.locator("#ct-apply").click();
        const csv = await save(page, "#ct-save-csv", path.join(folder, "counter.csv"));
        const svgFile = path.join(folder, "counter.svg");
        await save(page, "#ct-save-svg", svgFile);
        const svg = await context.newPage();
        await svg.goto(pathToFileURL(svgFile).href);
        assert.equal(await svg.locator("parsererror").count(), 0);
        assert.equal(
          await svg
            .locator(".ct-needle")
            .first()
            .evaluate((e) => getComputedStyle(e).stroke),
          "rgb(155, 99, 39)",
        );
        await svg.screenshot({ path: path.join(folder, "svg.png") });
        await svg.close();
        const file = path.join(folder, "reading.html"),
          html = await save(page, "#ct-save-reading", file);
        const saved = await context.newPage(),
          requests = [];
        saved.on("request", (r) => {
          if (/^https?:/.test(r.url())) requests.push(r.url());
        });
        await saved.goto(pathToFileURL(file).href);
        await saved.evaluate(() => document.fonts.ready);
        await saved.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
        await noOverflow(saved);
        assert.equal(await saved.locator("script").count(), 0);
        assert.equal(await saved.locator(".ct-full-passage").count(), 14);
        assert.equal(await saved.locator("img").count(), 12);
        const images = await saved.locator("img").evaluateAll(async (es) =>
          Promise.all(
            es.map(async (i) => {
              const b = Uint8Array.from(atob(i.src.split(",")[1]), (c) => c.charCodeAt(0));
              return {
                width: i.naturalWidth,
                sha256: Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", b)), (v) =>
                  v.toString(16).padStart(2, "0"),
                ).join(""),
              };
            }),
          ),
        );
        assert.deepEqual(
          images.map((i) => i.sha256),
          Array.from(
            { length: 12 },
            (_, i) => manifest.files.find((f) => f.file === `schone-${292 + i}.jpg`).sha256,
          ),
        );
        assert.deepEqual(requests, []);
        assert.equal(
          digest(await save(saved, "a[download]", path.join(folder, "embedded.csv"))),
          digest(csv),
        );
        await saved.screenshot({ path: path.join(folder, "saved.png") });
        if (name === "chromium" && width === 1440)
          await saved.pdf({
            path: path.join(folder, "reading.pdf"),
            format: "A4",
            printBackground: true,
          });
        await saved.close();
        const axe = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(
          axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
          [],
        );
        await noOverflow(page);
        await page.waitForFunction(
          () => document.querySelector("#ct-offline").textContent.includes("saved offline"),
          null,
          { timeout: 60000 },
        );
        const cache = await page.evaluate(async () => {
          const names = await caches.keys();
          const cache = await caches.open(names.find((n) => n.startsWith("dioptra-")));
          return (await cache.keys()).map((r) => new URL(r.url).pathname);
        });
        assert(cache.includes("/dioptra/counter.html"));
        assert(cache.includes("/dioptra/sources/schone-303.jpg"));
        if (!externalBase) {
          server.offline();
          await assert.rejects(fetch(`${base}counter.html`));
        }
        await context.setOffline(true);
        const rooms = [];
        for (const room of ["index.html", "flow.html", "counter.html"]) {
          await page.goto(base + room);
          assert((await page.locator("h1").innerText()).length > 5);
          await noOverflow(page);
          rooms.push(room);
        }
        await page.locator("#ct-source-select").selectOption("300");
        await decoded(page);
        await save(page, "#ct-save-reading", path.join(folder, "offline-reading.html"));
        assert.deepEqual(errors, []);
        assert.deepEqual(consoleErrors, []);
        assert.deepEqual(externalRequests, []);
        report.configurations.push({
          engine: name,
          version: browser.version(),
          width,
          defaultCubits: { theoretical: 1200, ledger: 800 },
          pointerInvariantAfterCalibration: originalAngles,
          measuredCubits: 800,
          carryCubits: [1590, 1600],
          rolloverLedgerCubits: 48000,
          idealLedgerStadia: 180,
          extraTrial: { shaftTurns: 24, cubitsPerDivision: 64, halfRevolutionCubits: 960 },
          boundarySvgLayouts: 6,
          svgTextClipping: 0,
          editionCutawayReached: true,
          keyboard: true,
          history: true,
          share: true,
          readingCount: 14,
          decodedSourcePages: 12,
          svgStandalone: true,
          readingBytes: html.length,
          embeddedImages: images,
          scriptFree: true,
          externalSavedRequests: requests,
          embeddedCsvMatches: true,
          offlineRooms: rooms,
          cacheFiles: cache.length,
          offlineMethod: externalBase
            ? "Browser context offline after installing the canonical hosted edition; public origin not controlled"
            : "Origin physically disabled and independently unreachable; browser context also offline",
          axeViolations: 0,
          pageErrors: errors,
          consoleErrors,
          externalRequests,
        });
        await writeFile(path.join(out, "browser.json"), `${JSON.stringify(report, null, 2)}\n`);
        console.log(
          `${name} ${width}: observed trial, unchanged pointers, carries, extra ratio, 14 readings, 12 pages, actual files and three rooms offline`,
        );
      } finally {
        await context.close();
        await server.close();
      }
    }
    // An HTTP-200 source substitution must refuse an illustrated export.
    const server = await serve(),
      context = await browser.newContext({ serviceWorkers: "block", acceptDownloads: true });
    try {
      const page = await context.newPage();
      let downloads = 0;
      page.on("download", () => downloads++);
      await context.route("**/sources/schone-298.jpg", (route) =>
        route.fulfill({
          status: 200,
          contentType: "image/jpeg",
          path: "dist/sources/schone-292.jpg",
        }),
      );
      await page.goto(`${server.base}counter.html`);
      await page.locator("#ct-save-reading").click();
      await page.waitForFunction(() =>
        document.querySelector("#ct-save-status").textContent.includes("does not match"),
      );
      assert.equal(downloads, 0);
      assert.equal(await page.locator("#ct-save-reading").isEnabled(), true);
      await context.unrouteAll();
      await save(page, "#ct-save-reading", path.join(out, `${name}-retry.html`));
      assert.equal(downloads, 1);
      await page.goto(`${server.base}counter.html`);
      let release, hit;
      const gate = new Promise((r) => {
        release = r;
      });
      const requestHeld = new Promise((r) => {
        hit = r;
      });
      await context.route("**/sources/schone-303.jpg", async (route) => {
        hit();
        await gate;
        await route.continue();
      });
      const pending = page.waitForEvent("download");
      await page.locator("#ct-save-reading").click();
      await requestHeld;
      await page.locator("#ct-turns").focus();
      await page.keyboard.press("Home");
      assert.equal(await page.locator("#ct-turns").inputValue(), "0");
      release();
      const snapshotFile = path.join(out, `${name}-snapshot.html`);
      await (await pending).saveAs(snapshotFile);
      const snapshot = await readFile(snapshotFile, "utf8");
      assert.match(snapshot, /Road-wheel turns: <strong>80<\/strong>/);
      assert.match(snapshot, /The trial is unfinished/);
      await context.unrouteAll();
      report.integrity.push({
        engine: name,
        successfulHttpWrongImageRejected: true,
        downloadsBeforeRetry: 0,
        retrySucceeded: true,
        pendingExportPreservesOriginalWheelTurns: 80,
        liveWheelTurnsDuringPendingExport: 0,
        unfinishedTrialDoesNotInventMeasuredGraduation: true,
      });
      await writeFile(path.join(out, "browser.json"), `${JSON.stringify(report, null, 2)}\n`);
    } finally {
      await context.close();
      await server.close();
    }
  } finally {
    await browser.close();
  }
}
