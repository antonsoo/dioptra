// biome-ignore-all lint/performance/useDomNodeTextContent: Verify the saved snapshot against the live experiment.
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";

const [base, out] = process.argv.slice(2);
assert(base && out, "Pass the production base and output directory.");
await mkdir(out, { recursive: true });
const rows = [];
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch(),
    context = await browser.newContext({ serviceWorkers: "block", acceptDownloads: true });
  try {
    const page = await context.newPage();
    await page.goto(`${base}calix.html?rig=10.1.16.1&read=7&trials=10.1.16.1`);
    let release, hit;
    const gate = new Promise((r) => (release = r)),
      reached = new Promise((r) => (hit = r));
    await page.route("**/sources/frontinus/buecheler-019.jpg", async (route) => {
      hit();
      await gate;
      await route.continue();
    });
    const pending = page.waitForEvent("download");
    await page.locator("#cx-save-html").click();
    await reached;
    await page.locator("#cx-head").focus();
    await page.keyboard.press("End");
    await page.locator("#cx-record").click();
    assert.equal(await page.locator("#cx-flow-value").innerText(), "8 ×");
    assert.equal(await page.locator("#cx-trials tbody tr").count(), 2);
    release();
    const downloaded = await pending,
      file = path.join(out, `${name}-snapshot.html`);
    await downloaded.saveAs(file);
    const text = await readFile(file, "utf8");
    assert(text.includes("source digits and head 16."));
    assert(!text.includes("source digits and head 64."));
    assert.equal((text.match(/<th scope="row">/g) ?? []).length, 1);
    rows.push({
      browser: name,
      snapshotHead: 16,
      liveHead: 64,
      snapshotTrials: 1,
      liveTrials: 2,
      saved: downloaded.suggestedFilename(),
    });
  } finally {
    await context.close();
    await browser.close();
  }
}
await writeFile(
  path.join(out, "receipt.json"),
  `${JSON.stringify({ checkedAt: new Date().toISOString(), rows, scope: "A held source request allows the live rig and trial book to change while Save is pending. The native download retains the complete earlier snapshot." }, null, 2)}\n`,
);
console.log("Both browsers preserve the chosen snapshot while the live rig changes");
