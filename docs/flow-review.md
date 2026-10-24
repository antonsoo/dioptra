# Water needs a clock

The second room adds a complete reading of Hero's Dioptra 31 and an experiment
in measurement, rather than a catalogue of ancient instruments.

## What the learner can do

Replay two streams through the same 12 by 4 cm wetted section. At chosen mean
speeds of 10 and 30 cm/s, the twenty-second collections are **9.6 and 28.8 L**.
The section alone cannot distinguish their supplies.

Choose **Try the changing-flow example**. B slows to 10 cm/s halfway through
and collects **19.2 L**. Its first ten seconds predict 28.8 L across the whole
run; its last ten predict 9.6 L. Compare the windows and see the extrapolation
against the actual record. The complete interval still gives a valid average.

Read all eleven Greek/English units, with word notes and three questions.
The text's “two fingers by six fingers” example measures a section. Its sundial
and collection trench add the missing time and collected amount. The opening
warning about changing springs matters to the closing estimate of a day's supply.

The printed **τάχος**, speed, is shown beside **πάχος**, thickness, recorded
in Schöne's apparatus at that point. Four full pages preserve the Greek,
facing German, corrections and relocated conclusion. The new English and model
follow the edited reading without pretending the editorial evidence disappears.

[The source and model account](flow-model.md) gives the complete page mapping,
source hashes, adaptation decisions, equations and limits. Centimetres, seconds,
litres and the abrupt switch are modern teaching choices. There is no conversion
of ancient fingers or hours and no hydraulic simulation of a real spring.

## Actual artifacts

The native browser downloads are retained as [illustrated HTML](../examples/dioptra-flow-reading.html),
[PDF](../examples/dioptra-flow-reading.pdf), [receivers SVG](../examples/dioptra-flow.svg)
and [collection CSV](../examples/dioptra-flow.csv). The HTML embeds all four
verified pages, fonts, licenses and the exact CSV. The SVG's colours and two
receiver scales were inspected after opening the actual file.

Screenshots show the [collection](assets/flow-collection.png),
[phone collection](assets/flow-mobile.png),
[failed short-window estimate](assets/flow-sample.png) and
[Greek reading](assets/flow-reading.png). The PDF's first experiment, complete
interval table and uncropped source apparatus were rendered and inspected.

## Verification

- [Independent rational water-packet integration](flow/oracle.json) checks
  conservation at 540 saved frames, both sides of the ten-second change,
  interval volumes, averages and extended totals. Maximum floating error is
  about 7.1e-15 L or L/s.
- [Complete Greek sequence and source identity](flow/source.json): all eleven
  units, 1,261 normalized Greek letters, and every source-file hash match the
  declared adaptation and manifest.
- [Production browser journeys](flow/browser.json): Chromium/Firefox at
  1440/375, keyboard controls, replay/pause, history, preserved query, all readings,
  questions, all four source pages, zoom, native downloads, local-file reopening,
  exact embedded image hashes and CSV. Both receiver heights use the same scale.
  No axe violations, page errors, console errors or external runtime requests in
  these reviewed workflows.
- The local production journeys physically disable the HTTP origin and
  independently require its fetch to fail before navigating both rooms and saving
  another complete reading. This is stronger than a browser offline flag alone.
- [Upgrade review](flow/upgrade.json): hold or substitute a new scan in both
  engines. A corrupt HTTP 200 response must not replace the previous tunnel
  edition. Recovery yields both rooms and the exact new scan with the origin
  disabled. Readiness is not shown while the new source is held.
- [Export snapshot and recovery](flow/exports.json): while a source is held,
  change width from 12 to 16 cm; the saved experiment remains the click-time
  12 cm state. Substituting a different valid JPEG with HTTP 200 produces no
  file; removing the substitution permits a successful retry. These probes remove
  service-worker capability to isolate direct export verification.
- [Boundary layouts and shared settings](flow/edges.json): 36 extreme layouts across
  three widths and both engines have no clipped SVG text or page overflow. Six
  malformed/duplicate-query journeys restore defaults with a visible notice.
- [PDF extraction](flow/print.json): all 55 complete Greek, English, keyword,
  gloss and note fields remain present after layout-preserving extraction.
  Digital print only; physical paper printing is unverified.
- [Development journeys](flow/development.json) run the same four workflows
  without offline installation. The existing [tunnel workflows](flow/tunnel-regression.json)
  also pass on the expanded prerelease build; its receipt records the earlier
  worker hash, before the new SVG license metadata and CSV dimensions were finalized.

## Reproduce

```sh
npm ci
npm run check
npm run verify:flow
node --import tsx -e 'import {flowPassages} from "./src/flow-content.ts"; console.log(JSON.stringify(flowPassages))' | python3 scripts/flow-source.py
node scripts/flow-browser.mjs /tmp/flow-browser
node scripts/flow-upgrade.mjs OLD_TUNNEL_DIST dist /tmp/flow-upgrade.json
node scripts/flow-exports.mjs http://127.0.0.1:4344/dioptra/ /tmp/flow-exports
node --import tsx scripts/flow-print.ts /tmp/flow-browser/chromium-1440/reading.pdf
```

`flow-exports` expects a running local server. The upgrade command needs the
previous one-room production build. No dependencies were added.

## Publication

Local review is complete. Fresh-install and public-byte evidence will be added
when this two-room edition is published.
