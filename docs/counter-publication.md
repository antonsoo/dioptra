# Hodometer workshop: publication review

The [calibration workshop](https://antonsoo.github.io/dioptra/counter.html) is
published. This review follows the earlier [development review](counter-review.md);
it does not turn that earlier local evidence into evidence of a deployment.

| Boundary                | Observed identity or result                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Reviewed public source  | `18c9969`, pushed to `main`                                                                       |
| Static Pages branch     | `a69bc88`, a normal fast-forward from `25f43e9` preserving the existing branch history            |
| Canonical hosted files  | All 41 files match the reviewed build; root checked before and after, with no cache-busting query |
| Build inventory SHA-256 | `b5c15e270aaa42468ad4f1b2901c7ca4988239e876e3d1b8852e5c9c1104cba9`                                |
| Service worker SHA-256  | `8cfbc906424a3e8b74ad67718c30b6127998c33762d95f6d8479f4fd3251144d`                                |
| Hosted browsers         | Chromium and Firefox at 1440 and 375 CSS pixels                                                   |

The [canonical response receipt](counter-hosted-files.json) records the exact
URLs, lengths, hashes and observation time. Matching bytes establish this
captured build at those URLs during that pass. They do not establish unobserved
extra files, a remote CI result or a registry release.

The [hosted browser receipt](counter-hosted-browser.json) exercises the actual
trial, unchanged pointer angles after applying the measured graduation, carries,
full-circuit loss, the extra 24-turn fixture, shared state, browser history,
keyboard input, fourteen Greek readings and twelve decoded source pages.
Actual SVG, CSV and script-free HTML downloads are opened from disk. The
embedded scans match their retained hashes; the saved reading makes no network
requests. Chromium also prints the reading to PDF.

After the complete canonical hosted edition is installed, each browser context
is disconnected and visits all three rooms, decodes a source page and saves a
new reading. This is browser-context disconnection; the public origin is not
under the reviewer's control. The earlier local review separately disabled its
origin server and verified that it was independently unreachable.

The browser receipt also includes two controlled integrity scenarios per
engine. Those scenarios use local production servers, not substituted public
responses: a successful HTTP response containing the wrong scan is rejected,
and a pending illustrated export retains the state from its initiating click.
The report labels that scope explicitly.

Reproduce against an unchanged build with installed Playwright browsers:

```sh
node scripts/counter-browser.mjs /tmp/dioptra-counter-hosted https://antonsoo.github.io/dioptra/
```

Build with `npm run build`; output is `dist/`. The retained build was produced
from the source recorded above. Later changes to this review and the browser
script do not change the application's build inputs. No tag or package release
is part of this publication.
