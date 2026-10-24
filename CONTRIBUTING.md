# Contributing

Use Node.js 24 or newer. Install with `npm ci`, then run `npm run dev`.
`npm run check` covers lint, strict types, the mathematical checks and the build.

For a source correction, identify the edition, printed page and line. Preserve
the distinction between printed Greek, an editor's supplement, an adopted
geometric reading and a modern explanatory model. Do not silently replace a
difficult label or infer an archaeological method from this ideal construction.

For geometry or interaction changes, reproduce a real learner workflow.
`npm run verify:survey` uses an independent rational calculation.
`npm run test:browser -- /tmp/dioptra-browser` checks the production files in
Chromium and Firefox. Inspect the saved drawings, images and PDF as well as the
program output. Rebuild before browser review, and keep that build unchanged
while the review is running.

For the chapter 34 counter, `npm run verify:counter` reconstructs shaft turns,
pointer phases and the indicated distance using independent rational arithmetic.
`npm run test:counter -- /tmp/dioptra-counter` exercises the actual calibration,
carry, rollover, twelve scans and native file workflows. `npm run verify:counter-sources`
checks bundled identities and the continuous Greek excerpt sequences.
The [counter model](docs/counter-model.md) records the two-stage assumption,
source's supposed twenty-turn trial and explicit modern 24-turn fixture.
Keep observed ratios separate from tooth profiles or historical performance.

Code and geometric diagrams use MIT. Teaching text and adapted Greek use
CC BY-SA 4.0; source images and fonts have their own notices. New source material
must retain attribution, redistribution terms and a stable identity.
