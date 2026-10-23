// biome-ignore-all lint/performance/useDomNodeTextContent: Inspect visible public output.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox } from "playwright";

const base = "https://antonsoo.github.io/dioptra/";
const output = resolve(process.argv[2] ?? "/tmp/dioptra-hosted");
await mkdir(output, { recursive: true });
const digest = (b) => createHash("sha256").update(b).digest("hex");
const build = JSON.parse(await readFile("docs/review/build.json", "utf8"));
const report = {
  checkedAt: new Date().toISOString(),
  base,
  runtimeCommit: build.runtimeCommit,
  files: [],
  configurations: [],
};
for (const file of build.files) {
  const r = await fetch(`${base}${file.file}?review=${Date.now()}`);
  assert.equal(r.status, 200, file.file);
  assert.equal(digest(Buffer.from(await r.arrayBuffer())), file.sha256, file.file);
  report.files.push(file);
}
console.log(`All ${report.files.length} public files match`);
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 375]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        acceptDownloads: true,
      });
      try {
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(base);
        await page.waitForFunction(
          () => document.querySelector("#offline").textContent.includes("saved offline"),
          null,
          { timeout: 60000 },
        );
        await page.locator('button[data-stage="3"]').click();
        await page.locator("#set-aim").click();
        await page.locator("#error").focus();
        await page.keyboard.press("Home");
        for (let i = 0; i < 60; i++) await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#error").inputValue(), "10");
        assert.ok((await page.locator("#meeting").innerText()).includes("60 mm"));
        await page.locator("#source").selectOption("3");
        await page.locator("#source-image").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const im = document.querySelector("#source-image");
          return im.complete && im.naturalWidth > 0 && im.currentSrc === im.src;
        });
        const downloads = [];
        for (const [button, ext] of [
          ["#save-study", "html"],
          ["#save-svg", "svg"],
          ["#save-csv", "csv"],
        ]) {
          const pending = page.waitForEvent("download");
          await page.locator(button).click();
          const d = await pending,
            file = join(output, `${name}-${width}.${ext}`);
          await d.saveAs(file);
          const bytes = await readFile(file);
          if (ext === "html")
            assert.equal(bytes.toString().match(/data:image\/jpeg;base64,/g).length, 4);
          downloads.push({ file: file.split("/").at(-1), sha256: digest(bytes) });
        }
        const artifact = await context.newPage();
        await artifact.goto(pathToFileURL(join(output, `${name}-${width}.html`)).href);
        const pending = artifact.waitForEvent("download");
        await artifact.locator("a[download]").click();
        const embedded = await pending,
          file = join(output, `${name}-${width}-embedded.csv`);
        await embedded.saveAs(file);
        assert.equal(
          digest(await readFile(file)),
          digest(await readFile(join(output, `${name}-${width}.csv`))),
        );
        await artifact.close();
        await context.setOffline(true);
        await page.reload();
        assert.equal(await page.locator("#error").inputValue(), "10");
        await page.locator("#source").selectOption("2");
        await page.locator("#source-image").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const im = document.querySelector("#source-image");
          return im.complete && im.naturalWidth > 0 && im.currentSrc === im.src;
        });
        await page.locator("#passage").selectOption("7");
        assert.deepEqual(errors, []);
        report.configurations.push({
          browser: name,
          version: browser.version(),
          width,
          downloads,
          embeddedCsvMatches: true,
          offlineReload: true,
          offlineSource: true,
        });
        console.log(`${name} ${width}: hosted controls, downloads and offline source passed`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(join(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
