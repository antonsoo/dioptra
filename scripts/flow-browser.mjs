// biome-ignore-all lint/performance/useDomNodeTextContent: Inspect the learner-visible reading.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox } from "playwright";

const out = path.resolve(process.argv[2] ?? "/tmp/dioptra-flow-browser"),
  external = process.argv[3],
  production = !external || process.argv[4] === "--hosted";
await mkdir(out, { recursive: true });
const hash = (b) => createHash("sha256").update(b).digest("hex");
const report = {
  checkedAt: new Date().toISOString(),
  mode: external ? (production ? "hosted" : "development") : "local production",
  workerSha256: hash(await readFile("dist/sw.js")),
  configurations: [],
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
      res
        .writeHead(200, {
          "Content-Type":
            {
              ".html": "text/html",
              ".js": "text/javascript",
              ".css": "text/css",
              ".jpg": "image/jpeg",
              ".svg": "image/svg+xml",
              ".json": "application/json",
              ".ttf": "font/ttf",
            }[path.extname(file)] ?? "application/octet-stream",
          "Cache-Control": "no-store",
        })
        .end(await readFile(path.join("dist", file)));
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
async function overflow(page) {
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    "page overflow",
  );
}
async function sourceLoaded(page) {
  await page.locator("#fl-source-image").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const i = document.querySelector("#fl-source-image");
    return i.complete && i.naturalWidth > 0 && i.src === i.currentSrc;
  });
  await page.locator("#fl-source-image").evaluate((i) => i.decode());
}
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const server = await serve(),
        base = external ?? server.base,
        folder = path.join(out, `${name}-${width}`);
      await mkdir(folder, { recursive: true });
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        acceptDownloads: true,
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
        await page.goto(`${base}flow.html`);
        await page.evaluate(() => document.fonts.ready);
        await overflow(page);
        assert.match(await page.locator("#fl-result").innerText(), /A 9.6 L.*B 28.8 L/);
        await page
          .locator("#fl-workshop")
          .screenshot({ path: path.join(folder, "collection.png") });
        await page.locator("#fl-width").focus();
        await page.keyboard.press("ArrowLeft");
        assert.match(await page.locator("#fl-result").innerText(), /44 cm².*A 8.8 L.*B 26.4 L/);
        await page.locator("#fl-reset").click();
        await page.locator("#fl-variable").focus();
        await page.keyboard.press("Space");
        assert.match(await page.locator("#fl-result").innerText(), /B 19.2 L/);
        await page.locator('[data-window="first"]').click();
        assert.match(
          await page.locator("#fl-prediction").innerText(),
          /28.8 L.*19.2 L.*overestimates.*9.6 L/s,
        );
        await page
          .locator("#fl-record")
          .screenshot({ path: path.join(folder, "first-window.png") });
        await page.locator('[data-window="last"]').click();
        assert.match(await page.locator("#fl-prediction").innerText(), /underestimates.*9.6 L/);
        await page.goBack();
        assert.equal(
          await page.locator('[data-window="first"]').getAttribute("aria-pressed"),
          "true",
        );
        await page.locator('[data-window="whole"]').click();
        assert.match(await page.locator("#fl-equation").innerText(), /19.2 L ÷ 20 s = 0.96 L\/s/);
        await page.locator("#fl-play").click();
        await page.waitForFunction(() => Number(document.querySelector("#fl-time").value) >= 0.3);
        await page.locator("#fl-play").click();
        const paused = await page.locator("#fl-time").inputValue();
        await page.waitForTimeout(250);
        assert.equal(await page.locator("#fl-time").inputValue(), paused);
        await page.locator("#fl-time").focus();
        await page.keyboard.press("Home");
        assert.match(await page.locator("#fl-result").innerText(), /A 0 L.*B 0 L/);
        await page.locator("#fl-finish").click();
        const levels = await page.locator("[data-collected-litres]").evaluateAll((es) =>
          es.map((e) => ({
            litres: Number(e.dataset.collectedLitres),
            height: Number(e.getAttribute("height")),
          })),
        );
        assert.equal(levels.length, 2);
        for (const x of levels) assert(Math.abs(x.height / 160 - x.litres / 60) < 1e-12);
        await page.locator("#fl-share").click();
        const shared = await page.locator("#fl-share-url").inputValue();
        assert.equal(new URL(shared).searchParams.get("v"), "1");
        const sharedState = new URL(page.url()).search;
        await page.getByRole("link", { name: "Read the Greek", exact: true }).click();
        assert.equal(new URL(page.url()).search, sharedState);
        for (let i = 0; i < 11; i++) {
          await page.locator("#fl-passage").selectOption(String(i));
          assert((await page.locator("#fl-greek").innerText()).length > 40);
          assert((await page.locator("#fl-note").innerText()).length > 80);
        }
        await page.locator("#fl-passage").selectOption("7");
        assert.match(await page.locator("#fl-note").innerText(), /apparatus.*πάχος/s);
        await page.locator("#fl-reading").screenshot({ path: path.join(folder, "reading.png") });
        await page.locator(".fl-questions summary").click();
        for (const a of [1, 0, 2]) {
          await page.locator(`input[name=fl-answer][value="${a}"]`).check();
          await page.getByRole("button", { name: "Check the reasoning", exact: true }).click();
          assert.match(await page.locator("#fl-feedback").innerText(), /^Yes/);
          await page.locator("#fl-question-next").click();
        }
        await sourceLoaded(page);
        for (const p of [285, 286, 287]) {
          await page.locator("#fl-source").selectOption(String(p));
          await sourceLoaded(page);
        }
        await page.locator("#fl-source").selectOption("286");
        await sourceLoaded(page);
        await page.locator("#fl-zoom").click();
        await page.locator("#fl-source-pan").focus();
        await page.keyboard.press("End");
        assert(await page.locator("#fl-source-pan").evaluate((e) => e.scrollWidth > e.clientWidth));
        await page.locator("#fl-zoom").click();
        const csv = await save(page, "#fl-save-csv", path.join(folder, "collection.csv"));
        const svgFile = path.join(folder, "receivers.svg");
        await save(page, "#fl-save-svg", svgFile);
        const svg = await context.newPage();
        await svg.goto(pathToFileURL(svgFile).href);
        assert.equal(await svg.locator("parsererror").count(), 0);
        assert.equal(
          await svg
            .locator(".fl-b")
            .first()
            .evaluate((e) => getComputedStyle(e).fill),
          "rgb(74, 135, 122)",
        );
        await svg.screenshot({ path: path.join(folder, "svg.png") });
        await svg.close();
        const file = path.join(folder, "reading.html"),
          html = await save(page, "#fl-save-reading", file);
        const saved = await context.newPage(),
          savedRequests = [];
        saved.on("request", (r) => {
          if (/^https?:/.test(r.url())) savedRequests.push(r.url());
        });
        await saved.goto(pathToFileURL(file).href);
        await saved.evaluate(() => document.fonts.ready);
        await saved.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
        await overflow(saved);
        assert.equal(await saved.locator(".fl-full-passage").count(), 11);
        assert.equal(await saved.locator("img").count(), 4);
        assert.deepEqual(savedRequests, []);
        const images = await saved.locator("img").evaluateAll(async (es) =>
          Promise.all(
            es.map(async (i) => {
              const bytes = Uint8Array.from(atob(i.src.split(",")[1]), (c) => c.charCodeAt(0));
              const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
              return {
                width: i.naturalWidth,
                sha256: Array.from(digest, (v) => v.toString(16).padStart(2, "0")).join(""),
              };
            }),
          ),
        );
        const manifest = JSON.parse(await readFile("public/sources/manifest.json", "utf8"));
        assert.deepEqual(
          images.map((i) => i.sha256),
          [284, 285, 286, 287].map(
            (p) => manifest.files.find((f) => f.file === `schone-${p}.jpg`).sha256,
          ),
        );
        assert.equal(
          hash(await save(saved, "a[download]", path.join(folder, "embedded.csv"))),
          hash(csv),
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
        const rooms = [];
        if (production) {
          await page.waitForFunction(
            () => document.querySelector("#fl-offline").textContent.includes("saved offline"),
            null,
            { timeout: 60000 },
          );
          if (!external) {
            server.offline();
            await assert.rejects(fetch(`${base}sources/schone-286.jpg`));
          }
          await context.setOffline(true);
          for (const room of ["index.html", "flow.html"]) {
            await page.goto(base + room);
            assert((await page.locator("h1").innerText()).length > 5);
            await overflow(page);
            rooms.push(room);
          }
          await page.locator("#fl-changing-example").click();
          await save(page, "#fl-save-reading", path.join(folder, "offline-reading.html"));
        } else assert.match(await page.locator("#fl-offline").innerText(), /Development preview/);
        assert.deepEqual(errors, []);
        assert.deepEqual(consoleErrors, []);
        assert.deepEqual(externalRequests, []);
        report.configurations.push({
          engine: name,
          version: browser.version(),
          width,
          defaultVolumesL: [9.6, 28.8],
          changingVolumeL: 19.2,
          firstWindowOverestimateL: 9.6,
          lastWindowUnderestimateL: 9.6,
          wholeAverageLPerSecond: 0.96,
          keyboard: true,
          replayPaused: true,
          historyRestored: true,
          querySurvivesSectionNavigation: true,
          shared,
          readings: 11,
          questions: 3,
          sourcePagesDecoded: 4,
          sourceZoom: true,
          receiverHeightsUseSameScale: levels,
          standaloneSvgColorsVerified: true,
          readingBytes: html.length,
          embeddedImages: images,
          embeddedCsvMatches: true,
          offlineRooms: rooms,
          offlineMethod: production
            ? external
              ? "Browser context offline mode; public origin uncontrolled"
              : "HTTP origin physically disabled and independently unreachable"
            : "Not enabled in development",
          axeViolations: 0,
          pageErrors: errors,
          consoleErrors,
          externalRequests,
        });
        await writeFile(path.join(out, "browser.json"), `${JSON.stringify(report, null, 2)}\n`);
        console.log(
          `${name} ${width}: collection, sampling, 11 readings, native files, ${rooms.length} offline rooms`,
        );
      } finally {
        await context.close();
        await server.close();
      }
    }
  } finally {
    await browser.close();
  }
}
