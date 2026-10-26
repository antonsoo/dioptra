// biome-ignore-all lint/performance/useDomNodeTextContent: Read the actual learner-visible result.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox } from "playwright";

const out = path.resolve(process.argv[2] ?? "/tmp/dioptra-calix-browser"),
  external = process.argv[3] ?? "";
if (external && (!external.startsWith("https://") || !external.endsWith("/dioptra/")))
  throw Error("Use a canonical HTTPS /dioptra/ base.");
await mkdir(out, { recursive: true });
const hash = (b) => createHash("sha256").update(b).digest("hex");
const report = {
  checkedAt: new Date().toISOString(),
  mode: external ? "canonical hosted" : "local production with origin disabled for offline replay",
  workerSha256: hash(await readFile("dist/sw.js")),
  configurations: [],
  integrity: [],
};
async function serve() {
  let online = true,
    substitute = "";
  const server = createServer(async (req, res) => {
    if (!online) {
      req.socket.destroy();
      return;
    }
    try {
      const name =
        new URL(req.url, "http://local").pathname.replace(/^\/dioptra\//, "") || "index.html";
      assert(!name.includes(".."));
      const file =
        name === substitute
          ? name.endsWith(".jpg")
            ? "sources/frontinus/buecheler-title.jpg"
            : "fonts/IBMPlexSans-Regular.woff2"
          : name;
      const bytes = await readFile(path.join("dist", file));
      const type =
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          ".jpg": "image/jpeg",
          ".svg": "image/svg+xml",
          ".ttf": "font/ttf",
          ".woff2": "font/woff2",
          ".json": "application/json",
        }[path.extname(name)] ?? "text/plain";
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
    replace(p) {
      substitute = p;
    },
    close() {
      server.closeAllConnections();
      return new Promise((r) => server.close(r));
    },
  };
}
async function save(page, selector, file) {
  const pending = page.waitForEvent("download");
  await page.locator(selector).click();
  await (await pending).saveAs(file);
  return hash(await readFile(file));
}
async function geometry(page) {
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    "page overflow",
  );
  const clipped = await page.locator("#cx-bores svg,#cx-rig svg").evaluateAll((roots) =>
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
  assert.deepEqual(clipped, [], "clipped SVG labels");
}
async function find(page, reading) {
  await page.selectOption("#cx-passage", String(reading));
  await page.locator("#cx-find").click();
  await page.waitForFunction(() =>
    document.querySelector("#cx-source-status").textContent.includes("Source image verified"),
  );
  await page.waitForFunction(() => {
    const p = document.querySelector("#cx-pan"),
      b = document.querySelector("#cx-band");
    const expected = Math.max(
      0,
      Math.min(
        p.scrollHeight - p.clientHeight,
        b.offsetTop + b.offsetHeight / 2 - p.clientHeight / 2,
      ),
    );
    return Math.abs(p.scrollTop - expected) < 5;
  });
  await page.locator("#cx-source-image").evaluate((i) => i.decode());
  await page.waitForFunction(() => {
    const box = document.querySelector("#cx-pan").getBoundingClientRect();
    return box.top >= -1 && box.bottom <= innerHeight + 1;
  });
  const pan = await page
    .locator("#cx-pan")
    .evaluate((p) => ({ left: p.scrollLeft, width: p.clientWidth, total: p.scrollWidth }));
  assert(
    Math.abs(pan.left - (pan.total - pan.width) / 2) < 3,
    "find centers the text horizontally",
  );
}
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      console.log(name, width);
      const server = await serve(),
        base = external || server.base,
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
          outside = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("request", (r) => {
          if (/^https?:/.test(r.url()) && !r.url().startsWith(base)) outside.push(r.url());
        });
        await page.goto(`${base}calix.html`);
        await page.evaluate(() => document.fonts.ready);
        await geometry(page);
        assert.equal(await page.locator("#cx-flow-value").innerText(), "4 ×");
        for (const [id, result] of [
          ["double", "4 ×"],
          ["four", "4 ×"],
          ["same", "1 ×"],
          ["head", "2 ×"],
        ]) {
          await page.locator(`[data-preset=${id}]`).focus();
          await page.keyboard.press("Enter");
          assert.equal(await page.locator("#cx-flow-value").innerText(), result);
          await geometry(page);
          await page.locator("#cx-record").click();
        }
        assert.equal(await page.locator("#cx-trials tbody tr").count(), 4);
        await page.locator("#cx-undo").click();
        assert.equal(await page.locator("#cx-trials tbody tr").count(), 3);
        await page.goBack();
        assert.equal(await page.locator("#cx-trials tbody tr").count(), 4);
        await page.locator("[data-preset=same]").click();
        await page.locator("#cx-head").focus();
        await page.keyboard.press("End");
        assert.equal(await page.locator("#cx-flow-value").innerText(), "8 ×");
        await page.keyboard.press("Home");
        assert.equal(await page.locator("#cx-flow-value").innerText(), "1 ×");
        await page.locator("#cx-play").click();
        await page.waitForFunction(() =>
          document
            .querySelector("#cx-run-status")
            .textContent.startsWith("Calculated collection complete"),
        );
        await page.locator("#cx-play").click();
        await page.locator("[data-preset=double]").click();
        assert((await page.locator("#cx-run-status").innerText()).startsWith("Playback stopped"));
        await page.locator("[data-preset=same]").click();
        for (const i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 7]) await find(page, i);
        await page.screenshot({ path: path.join(folder, "source.png") });
        await page.locator("#cx-zoom").click();
        await page.selectOption("#cx-page", "title");
        await page.waitForFunction(() =>
          document.querySelector("#cx-source-status").textContent.includes("Source image verified"),
        );
        await find(page, 7);
        await page.locator("#cx-share").click();
        const shared = await page.locator("#cx-share-url").inputValue();
        await page.goto(shared);
        assert.equal(await page.locator("#cx-trials tbody tr").count(), 4);
        assert.equal(await page.locator("#cx-flow-value").innerText(), "1 ×");
        assert.equal(await page.locator("#cx-passage").inputValue(), "7");
        await page.locator("#cx-workshop").scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(folder, "workbench.png"), fullPage: true });
        await page.screenshot({ path: path.join(folder, "viewport.png") });
        await geometry(page);
        const axe = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(
          axe.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
        );
        const csv = await save(page, "#cx-csv", path.join(folder, "trials.csv")),
          svg = await save(page, "#cx-save-svg", path.join(folder, "openings.svg")),
          html = await save(page, "#cx-save-html", path.join(folder, "reading-online.html"));
        await page.waitForFunction(
          () => document.querySelector("#cx-offline").textContent.includes("saved offline"),
          null,
          { timeout: 60000 },
        );
        const inventory = await page.evaluate(async () => {
          const names = (await caches.keys()).filter((k) => k.startsWith("dioptra-"));
          return Promise.all(
            names.map(async (name) => ({
              name,
              files: (await (await caches.open(name)).keys())
                .map((r) => new URL(r.url).pathname)
                .sort(),
            })),
          );
        });
        assert.equal(inventory.length, 1);
        assert(inventory[0].files.includes("/dioptra/calix.html"));
        assert(inventory[0].files.includes("/dioptra/sources/frontinus/buecheler-019.jpg"));
        server.offline();
        await context.setOffline(true);
        await page.reload();
        await page.waitForFunction(() =>
          document.querySelector("#cx-offline").textContent.includes("saved offline"),
        );
        await find(page, 7);
        const offline = await save(
          page,
          "#cx-save-html",
          path.join(folder, "reading-offline.html"),
        );
        assert.equal(offline, html, "native online and disconnected readings are identical");
        for (const room of ["", "flow.html", "counter.html", "calix.html"]) {
          await page.goto(`${base}${room}`);
          await page.locator("h1").waitFor();
          assert(await page.locator('a[href="./calix.html"],a[href="#cx-workshop"]').count());
        }
        const standalone = await browser.newContext({
          viewport: { width, height: 1000 },
          serviceWorkers: "block",
          offline: true,
        });
        const p = await standalone.newPage(),
          requests = [];
        p.on("request", (r) => {
          if (/^https?:/.test(r.url())) requests.push(r.url());
        });
        await p.goto(pathToFileURL(path.join(folder, "reading-online.html")).href);
        await p.evaluate(() => document.fonts.ready);
        await p.locator("img").evaluateAll((images) => Promise.all(images.map((i) => i.decode())));
        assert.equal(await p.locator("img").count(), 6);
        assert.equal(await p.locator(".reading").count(), 9);
        assert.equal(await p.locator("script").count(), 0);
        assert.equal(await p.locator("table tbody tr").count(), 4);
        assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        await p.screenshot({ path: path.join(folder, "saved-viewport.png") });
        assert.deepEqual(requests, []);
        if (name === "chromium" && width === 1440)
          await p.pdf({
            path: path.join(folder, "reading.pdf"),
            preferCSSPageSize: true,
            printBackground: true,
          });
        await standalone.close();
        assert.deepEqual(errors, []);
        assert.deepEqual(outside, []);
        report.configurations.push({
          browser: name,
          version: browser.version(),
          width,
          csv,
          svg,
          html,
          offlineHtml: offline,
          readingCount: 9,
          sourceImages: 6,
          trialCount: 4,
          axeViolations: 0,
          externalRequests: outside,
          worker: inventory[0],
          steps: [
            "keyboard presets and head extremes",
            "record undo browser history",
            "calculated replay and interruption",
            "nine source bands and repeated zoomed find",
            "title page then repeat find",
            "share round trip",
            "native CSV SVG HTML",
            "complete edition offline after origin disabled",
            "four rooms disconnected",
            "saved file with network disabled",
          ],
        });
      } finally {
        await context.close();
        await server.close();
      }
    }
  } finally {
    await browser.close();
  }
}
if (!external) {
  for (const [name, engine] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await engine.launch(),
      server = await serve(),
      context = await browser.newContext({ serviceWorkers: "block", acceptDownloads: true });
    try {
      const p = await context.newPage();
      await p.goto(`${server.base}calix.html`);
      await p.waitForFunction(() =>
        document.querySelector("#cx-source-status").textContent.includes("Source image verified"),
      );
      server.replace("sources/frontinus/buecheler-018.jpg");
      await p.selectOption("#cx-page", "018");
      await p.waitForFunction(() =>
        document.querySelector("#cx-source-status").textContent.includes("does not match"),
      );
      assert(await p.locator("#cx-image-frame").isHidden());
      let downloads = 0;
      p.on("download", () => downloads++);
      await p.locator("#cx-save-html").click();
      await p.waitForFunction(() => !document.querySelector("#cx-save-html").disabled);
      assert((await p.locator("#cx-save-status").innerText()).includes("does not match"));
      assert.equal(downloads, 0);
      server.replace("");
      await find(p, 7);
      await save(p, "#cx-save-html", path.join(out, `${name}-retry.html`));
      server.replace("fonts/NotoSerif-Regular.ttf");
      await p.locator("#cx-save-html").click();
      await p.waitForFunction(() => !document.querySelector("#cx-save-html").disabled);
      assert((await p.locator("#cx-save-status").innerText()).includes("does not match"));
      assert.equal(downloads, 1);
      server.replace("");
      await save(p, "#cx-save-html", path.join(out, `${name}-font-retry.html`));
      report.integrity.push({
        browser: name,
        validWrongJpeg: "rejected before display and download",
        validWrongFont: "rejected before download",
        recovery: "both retries succeeded",
      });
    } finally {
      await context.close();
      await server.close();
      await browser.close();
    }
  }
}
await writeFile(path.join(out, "receipt.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log("Verified four browser/width workflows, real downloads and disconnected readings");
