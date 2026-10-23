// biome-ignore-all lint/performance/useDomNodeTextContent: Verify the visible learner workflow.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox } from "playwright";

const out = path.resolve(process.argv[2] ?? "/tmp/dioptra-browser");
await mkdir(out, { recursive: true });
const hash = (b) => createHash("sha256").update(b).digest("hex");
const manifest = JSON.parse(await readFile("public/sources/manifest.json", "utf8"));
const readings = JSON.parse(
  execFileSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "--input-type=module",
      "-e",
      'import {passages} from "./src/content.ts"; console.log(JSON.stringify(passages));',
    ],
    { encoding: "utf8" },
  ),
);
const report = {
  checkedAt: new Date().toISOString(),
  workerSha256: hash(await readFile("dist/sw.js")),
  configurations: [],
  negativeCases: [],
};
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".json": "application/json",
  ".xml": "application/xml",
};
async function serve() {
  let online = true,
    wrong = false,
    held = false,
    release,
    hit = false,
    stopped = 0;
  const gate = new Promise((r) => {
    release = r;
  });
  const server = createServer(async (req, res) => {
    if (!online) {
      stopped++;
      req.socket.destroy();
      return;
    }
    try {
      const u = new URL(req.url, "http://local"),
        rel = decodeURIComponent(u.pathname).replace(/^\/dioptra\//, "") || "index.html";
      if (!u.pathname.startsWith("/dioptra/") || rel.includes("..")) throw new Error("path");
      if (rel === "sources/schone-241.jpg" && held) {
        hit = true;
        await gate;
      }
      const file = wrong && rel === "sources/schone-241.jpg" ? "sources/schone-240.jpg" : rel;
      const bytes = await readFile(path.join("dist", file));
      res
        .writeHead(200, {
          "Content-Type": mime[path.extname(rel)] ?? "application/octet-stream",
          "Cache-Control": "no-store",
        })
        .end(bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return {
    base: `http://127.0.0.1:${server.address().port}/dioptra/`,
    stop: () => {
      online = false;
    },
    wrong: () => {
      wrong = true;
    },
    hold: () => {
      held = true;
    },
    release,
    hit: () => hit,
    stopped: () => stopped,
    close: async () => {
      release();
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
    },
  };
}
const near = (a, b, t = 1e-8) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);
async function save(page, id, file) {
  const pending = page.waitForEvent("download");
  await page.locator(id).click();
  const d = await pending,
    p = path.join(out, file);
  await d.saveAs(p);
  return p;
}
async function sourceReady(page) {
  await page.locator("#source-image").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const im = document.querySelector("#source-image");
    return im.complete && im.naturalWidth > 0 && im.currentSrc === im.src;
  });
  await page.locator("#source-image").evaluate((im) => im.decode());
}
async function drawn(page, width, preset, detour) {
  const svg = page.locator(width === 375 ? "#map-narrow svg" : "#map-wide svg");
  const result = await svg.evaluate((node) => {
    const point = (n) => ({ x: Number(n.getAttribute("cx")), y: Number(n.getAttribute("cy")) });
    const line = (n) => ({
      x1: Number(n.getAttribute("x1")),
      y1: Number(n.getAttribute("y1")),
      x2: Number(n.getAttribute("x2")),
      y2: Number(n.getAttribute("y2")),
    });
    const matrix = node.getScreenCTM();
    return {
      scale: Number(node.dataset.scale),
      sx: matrix.a,
      sy: matrix.d,
      points: [...node.querySelectorAll("[data-station]")].map((n) => ({
        id: n.dataset.station,
        ...point(n),
      })),
      legs: [...node.querySelectorAll("line[data-leg]")].map(line),
      bores: [...node.querySelectorAll("[data-bore]")].map((n) => ({
        side: n.dataset.bore,
        ...line(n),
      })),
    };
  });
  near(result.sx, result.sy);
  const B = result.points.find((p) => p.id === "B"),
    u = result.scale;
  const world = (x, y) =>
    width === 375 ? { x: (y - B.y) / u, y: (x - B.x) / u } : { x: (x - B.x) / u, y: (B.y - y) / u };
  const [X, Y] = { five: [300, 60], two: [240, 120], seven: [420, 60] }[preset],
    d = detour;
  const expected = [
    [0, 0],
    [0.6 * X - 0.6 * d, 0],
    [0.6 * X - 0.6 * d, Y * (1 / 6 - d / 1200)],
    [X + 100 + d, Y * (1 / 6 - d / 1200)],
    [X + 100 + d, Y * (2 / 3 + d / 1200)],
    [X + 20 + d / 5, Y * (2 / 3 + d / 1200)],
    [X + 20 + d / 5, Y],
    [X, Y],
  ];
  for (const [i, p] of result.points.entries()) {
    const actual = world(p.x, p.y);
    near(actual.x, expected[i][0]);
    near(actual.y, expected[i][1]);
  }
  let dx = 0,
    dy = 0,
    distance = 0;
  for (const l of result.legs) {
    const a = world(l.x1, l.y1),
      b = world(l.x2, l.y2);
    near((b.x - a.x) * (b.y - a.y), 0);
    dx += b.x - a.x;
    dy += b.y - a.y;
    distance += Math.hypot(b.x - a.x, b.y - a.y);
  }
  near(dx, X);
  near(dy, Y);
  near(distance, X + 200 + 2 * d + Y);
  const state = Object.fromEntries(new URL(await page.url()).searchParams);
  const baseline = Number(state.baseline ?? 50),
    aim = Number(state.aim ?? 0.16),
    error = Number(state.error ?? 0) / 1000,
    affected = state.affected ?? "both",
    progress = Number(state.progress ?? 100);
  for (const b of result.bores) {
    const endpoint = world(b.x2, b.y2),
      e = affected === "both" || affected === b.side ? error : 0,
      slope = aim + e / baseline;
    near(endpoint.x, b.side === "B" ? (X * progress) / 200 : X * (1 - progress / 200));
    near(
      endpoint.y,
      b.side === "B" ? (slope * X * progress) / 200 : Y - (slope * X * progress) / 200,
    );
  }
  return {
    preset,
    detour,
    drawnNetX: dx,
    drawnNetY: dy,
    drawnWalk: distance,
    boreLines: result.bores.length,
  };
}
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const host = await serve(),
        context = await browser.newContext({
          viewport: { width, height: 1050 },
          acceptDownloads: true,
          reducedMotion: "reduce",
        });
      context.setDefaultTimeout(20000);
      try {
        const page = await context.newPage(),
          errors = [],
          external = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("request", (r) => {
          if (/^https?:/.test(r.url()) && !r.url().startsWith(new URL(host.base).origin))
            external.push(r.url());
        });
        await page.goto(host.base);
        await page.waitForFunction(() =>
          document.querySelector("#offline").textContent.includes("saved offline"),
        );
        await page.evaluate(() => document.fonts.ready);
        const row = {
          browser: name,
          version: browser.version(),
          width,
          geometry: [],
          downloads: [],
          sources: [],
          readings: 8,
        };
        for (const preset of ["five", "two", "seven"]) {
          await page.locator("#preset").selectOption(preset);
          for (const detour of [0, 40, 100]) {
            await page.locator("#detour").fill(String(detour));
            for (const stage of [0, 1, 2, 3]) {
              await page.locator(`button[data-stage="${stage}"]`).click();
              if (stage >= 2) await page.locator("#set-aim").click();
              row.geometry.push(await drawn(page, width, preset, detour));
            }
          }
        }
        for (let i = 0; i < 7; i++) {
          await page.locator(`button[data-leg="${i}"]`).click();
          assert.equal(
            await page
              .locator(`#${width === 375 ? "map-narrow" : "map-wide"} line.active-leg`)
              .getAttribute("data-leg"),
            String(i),
          );
        }
        await page.locator("#preset").selectOption("five");
        await page.locator("button[data-stage='3']").click();
        await page.locator("#detour").fill("0");
        await page.locator("#peg-rise").fill("8");
        await page.locator("#peg-rise").press("End");
        await page.locator("#peg-rise").pressSequentially(".5");
        assert.equal(await page.locator("#peg-rise").inputValue(), "8.5");
        for (const value of ["", "-1", "81"]) {
          await page.locator("#peg-rise").fill(value);
          assert.equal(await page.locator("#peg-rise").getAttribute("aria-invalid"), "true");
        }
        await page.locator("#set-aim").click();
        assert.equal(await page.locator("#peg-rise").getAttribute("aria-invalid"), null);
        for (const baseline of [10, 50, 80]) {
          await page.locator("#baseline").fill(String(baseline));
          await page.locator("#set-aim").click();
          for (const affected of ["B", "D", "both"]) {
            await page.locator("#affected").selectOption(affected);
            for (const error of [-50, 0, 10, 50]) {
              await page.locator("#error").fill(String(error));
              const actual = Number(await page.locator("#gap svg").getAttribute("data-gap"));
              near(actual, (((300 / 2 / baseline) * error) / 1000) * (affected === "both" ? 2 : 1));
              await drawn(page, width, "five", 0);
            }
          }
        }
        await page.locator("#baseline").fill("50");
        await page.locator("#error").fill("10");
        await page.locator("#affected").selectOption("both");
        await page.locator("#set-aim").click();
        await page.locator("#progress").focus();
        await page.keyboard.press("Home");
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#progress").inputValue(), "1");
        await drawn(page, width, "five", 0);
        await page.keyboard.press("End");
        for (let i = 0; i < 8; i++) {
          await page.locator("#passage").selectOption(String(i));
          assert.equal(await page.locator("#greek").innerText(), readings[i].greek);
          assert.equal(await page.locator("#english").innerText(), readings[i].english);
          assert.equal(await page.locator("#grammar-note").innerText(), readings[i].grammar);
        }
        for (let i = 0; i < 4; i++) {
          await page.locator("#source").selectOption(String(i));
          await sourceReady(page);
          const source = await page.locator("#source-image").getAttribute("src"),
            response = await context.request.get(new URL(source, host.base).href),
            bytes = await response.body(),
            entry = manifest.files.find((f) => f.file === source.split("/").at(-1));
          assert.equal(hash(bytes), entry.sha256);
          row.sources.push({ file: entry.file, sha256: entry.sha256 });
        }
        await page.locator("#zoom").focus();
        await page.keyboard.press("End");
        assert.equal(await page.locator("#zoom").inputValue(), "260");
        await page.locator("#find-passage").click();
        await page.waitForFunction(() => document.querySelector("#source-pan").scrollTop > 0);
        await page.locator("#zoom").fill("100");
        await page.locator("#passage").selectOption("5");
        await page.locator("#source").selectOption("0");
        await sourceReady(page);
        for (const [label, selector] of [
          ["workbench", ".workbench"],
          ["meeting", "#meeting"],
          ["reading", "#reading"],
          ["source", "#sources"],
        ])
          await page
            .locator(selector)
            .screenshot({ path: path.join(out, `${name}-${width}-${label}.png`) });
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          true,
        );
        assert.deepEqual(
          (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
          [],
        );
        await page.locator("#share").click();
        const link = await page.locator("#share-url").inputValue();
        await page.goto(link);
        assert.equal(await page.locator("#error").inputValue(), "10");
        assert.equal(await page.locator("#passage").inputValue(), "5");
        for (const [button, ext] of [
          ["#save-study", "html"],
          ["#save-svg", "svg"],
          ["#save-csv", "csv"],
        ]) {
          const file = await save(page, button, `${name}-${width}.${ext}`),
            bytes = await readFile(file);
          row.downloads.push({
            file: path.basename(file),
            bytes: bytes.length,
            sha256: hash(bytes),
          });
          if (ext === "html") {
            const text = bytes.toString();
            const jpgs = [...text.matchAll(/src="data:image\/jpeg;base64,([^"]+)"/g)];
            assert.equal(jpgs.length, 4);
            for (let i = 0; i < 4; i++)
              assert.equal(hash(Buffer.from(jpgs[i][1], "base64")), row.sources[i].sha256);
            assert.match(text, /SIL OPEN FONT LICENSE/);
            assert.match(text, /Attribution-ShareAlike 4.0 International/);
          }
        }
        const artifact = await context.newPage(),
          requests = [];
        artifact.on("request", (r) => {
          if (/^https?:/.test(r.url())) requests.push(r.url());
        });
        await artifact.goto(pathToFileURL(path.join(out, `${name}-${width}.svg`)).href);
        assert.equal(await artifact.locator("parsererror").count(), 0);
        assert.equal(
          await artifact.locator(".active-leg").evaluate((el) => getComputedStyle(el).stroke),
          "rgb(155, 99, 39)",
        );
        await context.setOffline(true);
        await artifact.goto(pathToFileURL(path.join(out, `${name}-${width}.html`)).href);
        await artifact.evaluate(() => document.fonts.ready);
        assert.equal(await artifact.locator(".passage").count(), 8);
        for (const im of await artifact.locator("img").all())
          await im.evaluate((el) => el.decode());
        assert.equal(
          await artifact.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          true,
        );
        assert.deepEqual(
          (await new AxeBuilder({ page: artifact }).withTags(["wcag2a", "wcag2aa"]).analyze())
            .violations,
          [],
        );
        const embedded = await save(artifact, "a[download]", `${name}-${width}-embedded.csv`);
        assert.equal(
          hash(await readFile(embedded)),
          hash(await readFile(path.join(out, `${name}-${width}.csv`))),
        );
        if (name === "chromium" && width === 1440)
          await artifact.pdf({
            path: path.join(out, "field-book.pdf"),
            format: "A4",
            printBackground: true,
          });
        assert.deepEqual(requests, []);
        await artifact.close();
        await context.setOffline(false);
        host.stop();
        await page.reload();
        assert.equal(await page.locator("#error").inputValue(), "10");
        await page.locator("#detour").fill("100");
        await drawn(page, width, "five", 100);
        await page.locator("#source").selectOption("2");
        await sourceReady(page);
        const offline = await save(page, "#save-study", `${name}-${width}-offline.html`);
        assert.equal(
          (await readFile(offline, "utf8")).match(/data:image\/jpeg;base64,/g).length,
          4,
        );
        assert.ok(host.stopped() > 0);
        assert.deepEqual(errors, []);
        assert.deepEqual(external, []);
        row.offlineReload = true;
        row.offlineSource = true;
        row.offlineExport = true;
        row.embeddedCsvMatches = true;
        row.axeViolations = 0;
        report.configurations.push(row);
        console.log(
          `${name} ${width}: measured drawings, native controls, four sources, saved files and disconnected survey passed`,
        );
      } finally {
        await context.close();
        await host.close();
      }
    }
    const host = await serve(),
      context = await browser.newContext({ serviceWorkers: "block" });
    try {
      const page = await context.newPage();
      await page.goto(host.base);
      host.wrong();
      let count = 0;
      page.on("download", () => count++);
      await page.locator("#save-study").click();
      await page.waitForFunction(() =>
        document
          .querySelector("#action-status")
          .textContent.includes("does not match this edition"),
      );
      assert.equal(count, 0);
      report.negativeCases.push({
        browser: name,
        case: "substituted source",
        downloadBlocked: true,
      });
    } finally {
      await context.close();
      await host.close();
    }
    const held = await serve(),
      ctx = await browser.newContext();
    try {
      held.hold();
      const page = await ctx.newPage();
      await page.goto(held.base);
      for (let i = 0; i < 100 && !held.hit(); i++) await page.waitForTimeout(50);
      assert.equal(held.hit(), true);
      assert.doesNotMatch(await page.locator("#offline").innerText(), /saved offline/);
      held.release();
      await page.waitForFunction(() =>
        document.querySelector("#offline").textContent.includes("saved offline"),
      );
      held.stop();
      await page.reload();
      await page.locator("#source").selectOption("3");
      await sourceReady(page);
      report.negativeCases.push({
        browser: name,
        case: "held source",
        notReadyUntilComplete: true,
        completeEditionOffline: true,
      });
    } finally {
      await ctx.close();
      await held.close();
    }
  } finally {
    await browser.close();
  }
}
await writeFile(path.join(out, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
