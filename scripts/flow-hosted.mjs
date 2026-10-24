import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const out = path.resolve(process.argv[2] ?? "/tmp/dioptra-flow-hosted"),
  base = "https://antonsoo.github.io/dioptra/";
await mkdir(out, { recursive: true });
const build = JSON.parse(await readFile("docs/flow/build.json", "utf8"));
const report = {
  checkedAt: new Date().toISOString(),
  base,
  runtimeCommit: build.runtimeCommit,
  files: [],
};
for (const file of build.files) {
  const response = await fetch(`${base}${file.file}?review=${Date.now()}`, {
    signal: AbortSignal.timeout(60000),
  });
  assert.equal(response.status, 200, file.file);
  const b = Buffer.from(await response.arrayBuffer());
  assert.equal(createHash("sha256").update(b).digest("hex"), file.sha256, file.file);
  report.files.push(file);
}
await writeFile(path.join(out, "files.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`${report.files.length} public files match the reviewed build`);
const result = spawnSync(process.execPath, ["scripts/flow-browser.mjs", out, base, "--hosted"], {
  stdio: "inherit",
});
assert.equal(result.status, 0, "Hosted browser review failed");
