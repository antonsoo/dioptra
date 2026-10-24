// biome-ignore-all lint/performance/useDomNodeTextContent: Inspect adjusted shared-state notice.
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium, firefox } from "playwright";

const base = process.argv[2],
  output = process.argv[3];
assert(base && output);
const report = { checkedAt: new Date().toISOString(), base, configurations: [] };
for (const [name, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await engine.launch();
  try {
    for (const width of [375, 900, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      let layouts = 0;
      try {
        for (const [w, d, a, b, v, t, m] of [
          [4, 1, 5, 30, 0, 0, "first"],
          [16, 6, 30, 30, 0, 20, "whole"],
          [16, 6, 30, 5, 1, 9.9, "last"],
          [16, 6, 30, 5, 1, 10, "whole"],
          [4, 6, 5, 30, 1, 10.1, "first"],
          [7, 5, 13, 29, 1, 19.9, "last"],
        ]) {
          await page.goto(`${base}flow.html?w=${w}&d=${d}&a=${a}&b=${b}&v=${v}&t=${t}&m=${m}&r=7`);
          await page.evaluate(() => document.fonts.ready);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          const clipped = await page
            .locator("#fl-stream-a svg, #fl-stream-b svg, #fl-plot svg")
            .evaluateAll((roots) =>
              roots.flatMap((svg) => {
                const v = svg.viewBox.baseVal;
                return [...svg.querySelectorAll("text")]
                  .filter((e) => {
                    const b = e.getBBox();
                    return (
                      b.x < v.x - 1 ||
                      b.y < v.y - 1 ||
                      b.x + b.width > v.x + v.width + 1 ||
                      b.y + b.height > v.y + v.height + 1
                    );
                  })
                  .map((e) => e.textContent);
              }),
            );
          assert.deepEqual(clipped, []);
          const before = await page.locator("#fl-time").inputValue();
          await page.waitForTimeout(30);
          assert.equal(await page.locator("#fl-time").inputValue(), before);
          layouts++;
        }
        await page.goto(
          `${base}flow.html?w=99&d=2&d=3&a=NaN&b=1e309&t=1.05&v=1&v=0&m=first&m=last&r=-1`,
        );
        assert.equal(await page.locator("#fl-adjusted").isVisible(), true);
        assert.match(await page.locator("#fl-result").innerText(), /48 cm².*A 9.6 L.*B 28.8 L/);
        assert.equal(await page.locator("#fl-variable").isChecked(), false);
        assert.equal(await page.locator("#fl-passage").inputValue(), "0");
        report.configurations.push({
          browser: name,
          width,
          layouts,
          svgTextClipping: 0,
          pageOverflow: 0,
          noAutoplayUnderReducedMotion: true,
          invalidAndDuplicateQueryRejected: true,
        });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log("36 boundary layouts and six malformed shared-state journeys passed");
