// biome-ignore-all lint/performance/useDomNodeTextContent: Inspect edition readiness shown to the learner.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { chromium, firefox } from "playwright";

if (!process.argv[2]) throw new Error("Pass the previous two-room dist directory.");
const previous = resolve(process.argv[2]),
  current = resolve(process.argv[3] ?? "dist");
const output = process.argv[4] ?? "/tmp/dioptra-counter-upgrade.json";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sourceFile = "sources/schone-303.jpg",
  sourceHash = digest(await readFile(join(current, sourceFile)));
const report = {
  previousWorker: digest(await readFile(join(previous, "sw.js"))),
  currentWorker: digest(await readFile(join(current, "sw.js"))),
  scope:
    "Two-room edition to counter calibration, with a new source held or substituted; origin-disabled navigation after recovery",
  configurations: [],
};
assert.notEqual(report.previousWorker, report.currentWorker);
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const fail of [false, true]) {
      let edition = previous,
        online = true,
        hold = true,
        unavailable = false,
        held = 0;
      const pending = [];
      const send = async (response, path) => {
        try {
          const bytes = await readFile(join(edition, path));
          response.writeHead(200, {
            "Content-Type":
              {
                ".html": "text/html",
                ".js": "text/javascript",
                ".css": "text/css",
                ".jpg": "image/jpeg",
                ".svg": "image/svg+xml",
                ".json": "application/json",
                ".ttf": "font/ttf",
              }[extname(path)] ?? "application/octet-stream",
            "Cache-Control": "no-store",
          });
          response.end(bytes);
        } catch {
          response.writeHead(404);
          response.end();
        }
      };
      const server = createServer((request, response) => {
        if (!online) {
          request.socket.destroy();
          return;
        }
        const path =
          new URL(request.url, "http://localhost").pathname.slice("/dioptra/".length) ||
          "index.html";
        if (edition === current && path === sourceFile && unavailable) {
          response.writeHead(200, { "Content-Type": "image/jpeg" });
          response.end("Substituted bytes must fail the edition integrity check");
          return;
        }
        if (edition === current && path === sourceFile && hold) {
          held++;
          pending.push(response);
          return;
        }
        void send(response, path);
      });
      await new Promise((r) => server.listen(0, "127.0.0.1", r));
      const base = `http://127.0.0.1:${server.address().port}/dioptra/`;
      const context = await browser.newContext(),
        page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      try {
        await page.goto(base);
        await page.waitForFunction(() =>
          document.querySelector("#offline").textContent.includes("saved offline"),
        );
        assert.match(await page.locator("h1").innerText(), /mountain/);
        edition = current;
        await page.goto(`${base}counter.html?w=80&trial=20&probe=20&scale=measured&r=6&page=298`);
        const deadline = Date.now() + 15000;
        while (!held && Date.now() < deadline) await new Promise((r) => setTimeout(r, 25));
        assert.ok(held);
        assert.equal(
          await page.evaluate(async () => (await navigator.serviceWorker.ready).active.state),
          "activated",
        );
        const pendingStatus = await page.locator("#ct-offline").innerText();
        assert.doesNotMatch(pendingStatus, /saved offline/);
        assert.match(await page.locator("#ct-indicated").innerText(), /800 cubits/);
        hold = false;
        if (fail) {
          unavailable = true;
          for (const response of pending.splice(0)) {
            response.writeHead(200, { "Content-Type": "image/jpeg" });
            response.end("Substituted bytes must fail the edition integrity check");
          }
          await page.waitForFunction(() =>
            /update incomplete|different offline edition|unavailable/.test(
              document.querySelector("#ct-offline").textContent,
            ),
          );
          online = false;
          server.closeAllConnections();
          await assert.rejects(fetch(base));
          await context.setOffline(true);
          await page.goto(base);
          await page.locator("#field-book").waitFor();
          assert.match(await page.locator("h1").innerText(), /mountain/);
          unavailable = false;
          online = true;
          await context.setOffline(false);
          await page.goto(`${base}counter.html?w=80&trial=20&probe=20&scale=measured&r=6&page=298`);
          await page.evaluate(() => window.dispatchEvent(new Event("online")));
        } else await Promise.all(pending.splice(0).map((response) => send(response, sourceFile)));
        await page.waitForFunction(() =>
          document.querySelector("#ct-offline").textContent.includes("saved offline"),
        );
        online = false;
        server.closeAllConnections();
        await assert.rejects(fetch(base));
        await context.setOffline(true);
        const navigation = await page.reload();
        assert.equal(navigation.fromServiceWorker(), true);
        assert.equal(await page.locator("#ct-trial").inputValue(), "20");
        assert.match(await page.locator("#ct-indicated").innerText(), /800 cubits/);
        await page.locator("#ct-source-select").selectOption("303");
        await page.locator("#ct-source-image").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const img = document.querySelector("#ct-source-image");
          return img.complete && img.naturalWidth > 0;
        });
        const hash = await page.evaluate(async () => {
          const bytes = await (
            await fetch(document.querySelector("#ct-source-image").src)
          ).arrayBuffer();
          return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (n) =>
            n.toString(16).padStart(2, "0"),
          ).join("");
        });
        assert.equal(hash, sourceHash);
        await page.goto(base);
        assert.match(await page.locator("h1").innerText(), /mountain/);
        await page.getByRole("link", { name: "31 · Water supply", exact: true }).click();
        assert.match(await page.locator("h1").innerText(), /Water needs/);
        await page.getByRole("link", { name: "34 · Distance counter", exact: true }).click();
        assert.match(await page.locator("h1").innerText(), /Count the teeth/);
        assert.deepEqual(errors, []);
        report.configurations.push({
          browser: name,
          version: browser.version(),
          substitutionRejectedAndRecovered: fail,
          heldRequests: held,
          pendingStatus,
          offlineCounter: true,
          offlineFlow: true,
          offlineTunnel: true,
          offlineScanSha256: hash,
        });
        console.log(
          `${name} ${fail ? "failure and recovery" : "held installation"}: all three offline rooms passed`,
        );
      } finally {
        for (const response of pending) response.destroy();
        await context.close();
        server.closeAllConnections();
        await new Promise((r) => server.close(r));
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
