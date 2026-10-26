# The public Frontinus opening experiment

[Open the workshop](https://antonsoo.github.io/dioptra/calix.html), or read the
[source/model decisions](calix-model.md) and [learner review](calix-review.md).

Runtime source `8e84e61` was reproduced from a clean Node 24.21.0 install. The
full check passed and all **53** static files matched the working Node 26.7.0
build. [`build-identity.json`](calix-review/build-identity.json) records those
identities. Later publication scripts and documents do not change that runtime.

The source was pushed through `1d567e7`; normal child commit `5071086` published
the reviewed output to `gh-pages`, preserving older hashed assets. Pages serves
that branch’s root using its legacy branch deployment. This is separate from
any GitHub Actions execution claim.

## Canonical bytes and real public operation

The [before receipt](calix-review/hosted-files-before.json) checks the actual
canonical entry URL, explicit index and every build file without query cache
busting. All 53 match. After the browser matrix, an independent Python pass
again matches [all 53 canonical files](calix-review/hosted-files-after.json),
including the entry URL before and after its inventory pass. Retained older
hashed assets lie outside the current-build inventory.

[Hosted browser replay](calix-review/hosted-browser.json) operates the actual
public room in Chromium and Firefox at 1440 and 375 pixels. It repeats keyboard
presets, trial/history behavior, calculated replay, all nine source readings,
zoomed Find and title-page return, sharing, native downloads and the four-room
offline edition. Browser networking is disabled after the current complete
worker is confirmed. Source substitution and origin-shutdown cases remain
separate local evidence, rather than being claimed as hosted server control.

All [sixteen native CSV/SVG/HTML downloads](calix-review/hosted-downloads.json)
match their corresponding reviewed local files exactly. The [public artifact
inspection](calix-review/hosted-artifacts.json) recovers all six original JPEGs
and three original fonts from the standalone readings, checks complete Latin,
English and word-note text in the thirteen-page PDF, and recovers its six
original JPEGs exactly. The PDF’s creation metadata is not used for identity
comparison with the local PDF.

These receipts capture responses and workflows at the stated time. They do not
promise future CDN responses, a registry release, or successful CI. The source
contains the records needed to repeat the review independently.

## Reproduce publication review

```sh
npm ci
npm run check
python3 scripts/calix-hosted.py https://antonsoo.github.io/dioptra/ /tmp/calix-before.json
node scripts/calix-browser.mjs /tmp/calix-public https://antonsoo.github.io/dioptra/
python3 scripts/calix-artifacts.py /tmp/calix-public
python3 scripts/calix-hosted.py https://antonsoo.github.io/dioptra/ /tmp/calix-after.json
```
