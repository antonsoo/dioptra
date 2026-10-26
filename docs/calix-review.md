# Review the opening, then the qualification

The Frontinus room is a controlled modern experiment tied to selected Latin
readings and a retained printed witness. Start with [the model and source
decisions](calix-model.md), then perform the sequence below.

## Try the opening experiment

1. Open `calix.html`. One comparison opening has twice the reference diameter:
   area ratio 4, relative delivery 4 under the maintained equal heads.
2. Choose **Four small openings**. Four separate quinaria-sized circles give
   the same total opening area and model delivery. They are not a packing diagram.
3. Choose **Same delivery, wider opening**. The opening remains four times as
   large, but head is now 1/16 of the reference and relative delivery is 1.
4. Choose **Same opening, four times the head**. Area ratio 1, head ratio 4,
   relative delivery 2. Change the collection interval: both volumes grow
   together while their ratio stays fixed.
5. Record the four presets. Remove a trial and use browser Back to recover the
   full book. Share the link and reopen it: settings, reading and all trials
   should return. A malformed or repeated record must identify a complete reset.
6. Read **Less pressure, a longer route** and **The calix is a bronze fitting**.
   The former actually says _minore pressura_; the latter specifies a fitting
   at least twelve digits long. Our ideal opening models neither pipe length
   nor friction. The source is the reason for that limitation.
7. Choose **Find on the printed page**, enlarge/fit, change to the title page,
   and find the reading again. The source viewer should enter the screen at
   phone width, with the relevant lines visible and keyboard scrolling available.
8. Save CSV, openings SVG and illustrated HTML. Open the HTML from disk with
   network disabled. All nine readings, the trial book, fonts and six full scans
   remain available. Print it; the source pages each receive their own sheet.

## Recorded local evidence

The retained receipts in [`calix-review/`](calix-review/) identify the actual
production worker and native downloads reviewed. They distinguish browser
behavior, source identity, portable files and upgrade behavior.
- Chromium and Firefox at 1440 and 375 pixels: keyboard presets/head extremes,
  trial recording and history, replay interruption, nine source bands, repeated
  zoomed Find, title-page return, shared-state round trip and actual downloads.
  No page overflow, clipped diagram labels, accessibility violations or external
  requests were observed in that matrix.
- Complete four-room offline replay after the local origin was disabled and
  browser networking switched off, following the current worker’s complete
  cache inventory. The room and source files, not a readiness label alone,
  establish the recorded result.
- A valid different JPEG is rejected before display and download; a valid
  different font is rejected before download. Both retries succeed after the
  original bytes return.
- Source review re-downloads the pinned original PDF and reproduces all six
  complete JPEGs byte for byte. The Latin is manually compared with those scans;
  no OCR transcription identity is claimed. Source bands were inspected against
  the actual derivative images, rather than scaled from another OCR image.
- Native HTML downloads from all four browser/width configurations are identical
  online and offline. Six JPEGs and three fonts match the retained originals;
  there are no scripts. The standalone SVG has its proper namespace and full
  MIT license.
- The native Chromium PDF has thirteen pages. All nine complete Latin/English
  readings and word notes survive text extraction; 2,135 extracted words remain
  within their page bounds. All six source JPEGs are recovered from the PDF
  exactly. These text and image checks supplement visual inspection.
- While one source request is held during Save, the live head and trial book
  can change. Both native browser downloads retain the complete earlier setup
  and book, rather than mixing the two moments.
- Held and substituted new-source installs are exercised from the previous
  three-room edition in both engines. Pending or failed installs cannot claim
  current readiness. The old room remains available disconnected after failure;
  recovery activates the complete four-room edition and its verified new scan.

The numerical check covers all 6,144 bounded combinations using separately
computed circular areas and energy-derived speeds with a chosen common gravity
and coefficient. This verifies the modern comparison. It is not evidence for
actual ancient equipment performance.

## Reproduce

```sh
npm ci
npm run check
python3 scripts/calix-source.py --online
node scripts/calix-browser.mjs /tmp/calix-browser
python3 scripts/calix-artifacts.py /tmp/calix-browser
npm run preview -- --port 4501
node scripts/calix-exports.mjs http://127.0.0.1:4501/dioptra/ /tmp/calix-exports
node scripts/calix-upgrade.mjs /path/to/previous-three-room/dist dist /tmp/calix-upgrade.json
```

The browser harness serves its own production build and disables that origin
for disconnected review. A canonical HTTPS base can be supplied as its third
argument for hosted replay, where browser networking is disabled but server-side
substitution cases remain a separate local check. Hosted bytes and publication
are recorded independently in [the publication review](calix-publication.md).
