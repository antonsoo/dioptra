// biome-ignore-all lint/performance/useDomNodeTextContent: Inspect the export failure message.
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";

const base = process.argv[2],
  out = process.argv[3];
assert(base && out);
await mkdir(out, { recursive: true });
const report = {
  checkedAt: new Date().toISOString(),
  method: "Service-worker capability removed before startup to isolate direct export fetches",
  configurations: [],
};
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch(),
    context = await browser.newContext({ acceptDownloads: true });
  try {
    await context.addInitScript(() => {
      delete Navigator.prototype.serviceWorker;
    });
    const page = await context.newPage();
    await page.goto(`${base}flow.html`);
    assert.equal(await page.evaluate(() => "serviceWorker" in navigator), false);
    let release, hit;
    const gate = new Promise((r) => {
        release = r;
      }),
      hitPromise = new Promise((r) => {
        hit = r;
      });
    await page.route("**/sources/schone-287.jpg", async (route) => {
      hit();
      await gate;
      await route.continue();
    });
    const first = page.waitForEvent("download");
    await page.locator("#fl-save-reading").click();
    await hitPromise;
    await page.locator("#fl-width").focus();
    await page.keyboard.press("End");
    assert.equal(await page.locator("#fl-width").inputValue(), "16");
    release();
    const downloaded = await first;
    const file = path.join(out, `${name}-snapshot.html`);
    await downloaded.saveAs(file);
    const html = await readFile(file, "utf8");
    assert.match(html, /Both wetted sections are 12 × 4 cm/);
    assert.doesNotMatch(html, /Both wetted sections are 16 × 4 cm/);
    await page.unroute("**/sources/schone-287.jpg");
    const wrong = await readFile("public/sources/schone-286.jpg");
    await page.route("**/sources/schone-287.jpg", (route) =>
      route.fulfill({ status: 200, contentType: "image/jpeg", body: wrong }),
    );
    let count = 0;
    page.on("download", () => count++);
    await page.locator("#fl-save-reading").click();
    await page.waitForFunction(() =>
      document.querySelector("#fl-save-status").textContent.includes("does not match this edition"),
    );
    assert.equal(count, 0);
    assert.equal(await page.locator("#fl-save-reading").isDisabled(), false);
    await page.unroute("**/sources/schone-287.jpg");
    const retry = page.waitForEvent("download");
    await page.locator("#fl-save-reading").click();
    await (await retry).saveAs(path.join(out, `${name}-retry.html`));
    assert.equal(count, 1);
    report.configurations.push({
      browser: name,
      snapshotWidthCm: 12,
      liveWidthCm: 16,
      substitutedHttp200ImageRejected: true,
      failedExportDownloads: 0,
      retrySucceeded: true,
    });
    console.log(`${name}: snapshot retained; wrong source blocked; retry saved`);
  } finally {
    await context.close();
    await browser.close();
  }
}
await writeFile(path.join(out, "exports.json"), `${JSON.stringify(report, null, 2)}\n`);
