import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { passages } from "../src/content.ts";

const file = process.argv[2];
if (!file) throw new Error("Pass the PDF produced by the browser review.");
const norm = (s: string) => s.normalize("NFC").replace(/\s+/g, "");
const text = norm(execFileSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8" }));
const checks = passages.flatMap((p, i) =>
  (["greek", "english", "word", "gloss", "grammar", "action"] as const).map((field) => ({
    passage: i + 1,
    field,
    present: text.includes(norm(p[field])),
  })),
);
assert.ok(
  checks.every((c) => c.present),
  JSON.stringify(checks.filter((c) => !c.present)),
);
console.log(
  JSON.stringify(
    {
      method:
        "Poppler layout-preserving text extraction; NFC and whitespace normalization; complete paragraph inclusion",
      pdfSha256: createHash("sha256").update(readFileSync(file)).digest("hex"),
      checks,
    },
    null,
    2,
  ),
);
