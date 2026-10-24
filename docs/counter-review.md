# Count the teeth. Then measure: development review

Dioptra's third room makes a specific Greek engineering argument usable:
the number of teeth does not establish the distance scale until the operator
has tested the driving ratio. The work is local source and a reviewed production
build. It has not been pushed, deployed or represented as the current public site.
The Officina catalogue and its existing destinations were left unchanged.

## What a learner can do

Start the counter with eighty completed road-wheel turns. Its source fixture
has a supposed twenty-turn first-worm ratio, while its initial graduation
still assumes thirty. The fine pointer is at fifteen divisions; the theoretical
scale reads 1,200 cubits and the outside wheel-turn ledger records 800.

Drive the first worm to a complete output revolution. Twenty shaft turns,
eight road-wheel turns per shaft turn, and ten cubits per wheel turn give
1,600 cubits. Divide by the thirty output divisions. Apply the resulting
53 1/3-cubit graduation and see the displayed distance become 800 without
moving a pointer. Restore the theoretical graduation or use browser Back;
the displayed scale and its status agree. An explicit modern 24-turn fixture
requires its own trial and yields 64 cubits per division.

Inspect the first carry at 159 and 160 wheel turns, then the complete circuit
at 4,800 turns in the twenty-turn fixture. Both dials return to zero, while the
outside ledger retains 48,000 cubits. Select the initial theoretical 30:1 case
to inspect the source's 7,200-turn / 180-stadia range. The separate ledger
does not give the drawn instrument a hidden memory of complete revolutions.

Read fourteen Greek-and-English selections with contextual notes. Inspect
all twelve full pages, compare the edition's cutaway on p. 295, and follow
the actual archive leaf for the printed calibration page. Save the illustrated
reading, SVG and CSV, open the files from disk, or disconnect after the complete
edition is ready and navigate all three rooms.

## Source boundaries

The [model and editorial decisions](counter-model.md) identify each source
number and modern choice. The source describes an example, not a surviving
measurement record. It supplies no physical explanation of the twenty-turn
ratio. The unfolded diagram does not supply a tooth profile or repair the
initial textual gap. Only the first worm is tested here; the second remains
an assumed thirty-to-one reduction, and wheel rolling is exact in the model.

Greek and English numerical readings were reviewed against the printed Greek
and facing German. The source verifier checks continuous letter/diacritic
sequences and byte identities; it does not certify a translation or substitute
for philological peer review. The digital `τύμπανυν` / printed `τύμπανον`
difference is visible in the language note. Printed p. 298, marginal p. 312,
PDF page 313 and archive leaf 313 remain distinct identities.

## Reproduce the substantive checks

From an installed source checkout:

```sh
npm run check
npm run verify:counter
npm run verify:counter-sources
npm run test:counter -- /tmp/dioptra-counter
node --import tsx scripts/counter-print.ts /tmp/dioptra-counter/chromium-1440/reading.pdf
```

The browser review starts its own production servers; build first and keep
`dist/` unchanged while it runs. Matching Playwright Chromium and Firefox
are required. The print command requires Poppler. For online TEI, scan-leaf
and exact PDF-render verification, run:

```sh
python3 scripts/counter-source-review.py --online
```

For an upgrade review, build the previous two-room source and the current
source into separate directories, then run:

```sh
node scripts/counter-upgrade.mjs PREVIOUS_DIST dist /tmp/dioptra-counter-upgrade.json
```

The retained previous build is from `df1c92e`, the two-room checkout present
at the start of this work. The complete [clean build identity](counter-build.json)
records the reviewed source archive and every current output file. Node 24's
clean install and Node 26's workspace build produce identical static files.
These are local results, not a remote CI or publication claim.

## Evidence

| Workflow                                                                                                                                           | Retained evidence                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Exact ratio, modulo phases, carries, reconstructed distance and lost full circuits                                                                 | [Independent Python Fraction oracle](counter-oracle.json): 6,282 cases and 91,089 checks |
| Source bytes, all fourteen continuous Greek selections, twelve reproduced page renders, archive-leaf mapping and pinned online TEI                 | [Source review](counter-sources.json)                                                    |
| Clean Node 24 install, full checks and byte comparison with the workspace build                                                                    | [Build review](counter-build.json)                                                       |
| Styled development server and applied calibration in both browsers at 375px and 1440px                                                             | [Development review](counter-development.json)                                           |
| Actual trial, unchanged pointers, carry, rollover, extra fixture, keyboard, history, shared state, source viewer, downloads and disconnected rooms | [Production browser review](counter-browser.json)                                        |
| Delayed new scan, substituted HTTP-200 bytes, retention of the old edition, recovered installation and all three rooms offline                     | [Two-room to three-room upgrade](counter-upgrade.json)                                   |
| All seventy complete Greek/English/note fields and all twelve JPEGs recovered from the actual 22-page PDF                                          | [Printed reading review](counter-print.json)                                             |
| Existing tunnel measurements, controls, sources, saved files and offline workflow after integration                                                | [Tunnel regression](counter-tunnel-regression.json)                                      |
| Existing collection, changing-flow sampling, complete chapter, saved files and offline workflow after integration                                  | [Water regression](counter-flow-regression.json)                                         |

The final production browser matrix contains Chromium and Firefox at both
desktop and phone widths. Six extreme dial layouts in each configuration
check actual SVG text bounds. No page errors, console errors, external
subresource requests, page overflow or accessibility audit violations were
reported. The screenshot review also covered the intermediate 900px layout.

The browser review physically disables its HTTP origin and independently
confirms it is unreachable, then reloads the tunnel, water and counter rooms.
It inspects and decodes a source image, and saves a complete illustrated
reading while disconnected. An HTTP-200 replacement of p. 298 with the
wrong complete page refuses the export in both browsers. Releasing the
correct page permits a retry. Holding p. 303 while the learner changes the
road-wheel count from eighty to zero preserves the original eighty-turn
snapshot in the downloaded file; an unfinished trial never acquires a
measured graduation in that file.

The upgrade review holds the new p. 303 during installation, and separately
substitutes its bytes. The pending or failed three-room edition does not claim
readiness from the older worker. The old edition remains usable offline after
failure. Correct bytes recover installation in both browsers; the recovered
source hash and all three offline navigation routes are checked.

Earlier tunnel/water regression receipts retain their own worker identities;
they are not relabelled as results from a later build. The current counter
and upgrade receipts identify the final worker themselves.

## Inspect the result

- [Desktop calibration](assets/counter-calibration.png),
  [desktop instrument](assets/counter-desktop.png),
  [desktop Greek reading](assets/counter-reading.png).
- [Phone calibration](assets/counter-phone-calibration.png) and
  [phone Greek reading](assets/counter-phone-reading.png).
- [Actual saved reading](../examples/counter-reading.html),
  [printed PDF](../examples/counter-reading.pdf),
  [standalone SVG](../examples/counter.svg),
  [checkpoint CSV](../examples/counter.csv).

The survey-paper design keeps the experiment and its word notes legible at
both widths. The mobile mechanism unfolds vertically rather than shrinking
the dials to illegible sizes. Screenshot inspection exposed a clipped trial
caption, long fractional shaft totals and a Firefox baseline at the top of
the narrow canvas; those were corrected. It also exposed the stale status
after browser Back, which now derives from the restored scale.

The PDF is a browser print, not a tagged publication, physically tested
printout, archaeological reconstruction or critical edition. The twenty-turn
trial does not establish an ancient manufacturing tolerance. The saved HTML
is self-contained; the public volume and source-repository links still require
a network if the learner follows them.

## Build and publication handoff

`npm run build` produces the complete static site in `dist/`, with base
`/dioptra/`. Run `npm run preview` and open `/dioptra/counter.html` to inspect
the production workshop. `npm run dev` serves the source version instead;
it deliberately does not install a service worker. Both normally use port
4344, so run one at a time.

No remote creation, push, deployment, tag or package release was performed.
The new route and its catalogue discovery should be published together only
after the reviewed build is chosen. Existing catalogue entries and destinations were left unchanged.

Suggested repository description: **Read Hero's Greek, survey an unseen tunnel,
measure water supply and calibrate a distance counter by trial.**

Suggested topics: `ancient-greek`, `history-of-science`, `surveying`, `geometry`,
`calibration`, `education`, `offline-first`.

## Implementation commits

```text
281a621 test: read review files before sending response headers
0ed20ee fix: identify the exact content of facing source pages
3fd340b fix: keep fractional shaft counts inside the dial drawing
ac9de7d test: exercise calibrated readings, actual exports and offline upgrades
cb37a34 feat: make hodometer calibration and lost circuits observable
2506a30 feat: retain Hero's hodometer readings and complete source pages
```
