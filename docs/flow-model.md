# Water needs a clock: source and model

The second Dioptra room reads **chapter 31**. Its result is deliberately concrete:
two equal wetted sections can deliver unequal volumes; a measured interval
supplies an average, whose extension to another interval needs justification.

## The printed evidence

Hermann Schöne, _Herons von Alexandria Vermessungslehre und Dioptra_
(Leipzig: Teubner, 1903), pp. 284–287. Chapter 31 starts below chapter 30 on
p. 284 and ends above chapter 32 on p. 286. The odd pages carry German.

| Printed page | PDF page, one-based | Archive leaf | Content retained |
| --- | ---: | ---: | --- |
| 284 | 299 | 299 | Greek opening, rain/drought, enclosure and outlet |
| 285 | 300 | 300 | Facing German opening below chapter 30 |
| 286 | 301 | 301 | Greek section, speed, timed collection and apparatus |
| 287 | 302 | 302 | Facing German continuation and conclusion |

The complete PDF is the public-domain Google Books scan at
[Internet Archive](https://archive.org/details/heronisalexandr00schogoog).
Its SHA-256 is
`d8c5aaa7c5757ffbc7a4e1a57286c23bd341a547a7c042d58cee5c4c9da438b5`.
Archive scandata page numbers and the four actual rasterized pages were checked.
The JPEGs use `pdftoppm -scale-to 1550 -jpeg -jpegopt quality=85`, retaining
whole pages rather than clipping away the apparatus. Individual bytes and hashes
are in [the manifest](../public/sources/manifest.json).

The digital Greek is the complete, unchanged Harvard College Library / Open
Greek and Latin [TEI](../public/sources/dioptra-grc.xml), pinned at upstream
commit `25b9f2150cfd329d94177e86e334d35487a07d3b` and SHA-256
`2a6c4f7e939c8d26dff32ce6713a57c750693cadd69b6c91abe8c19c2fbda37e`.
The adapted Greek, new English and language notes are CC BY-SA 4.0. Code and
new diagrams are MIT. Complete notices accompany both the site and saved HTML.

## Reading decisions

All chapter prose is represented in eleven units; these are divisions for
learning, not ancient section numbers. No claim is made to a new critical edition.

- Join line-end hyphens and whitespace; normalize apostrophes; omit chapter
  numeral, apparatus, line numbers and editor-deleted letters from the reading.
- Remove the digital line-join duplicate `μενον` after `στοχασάμενον`, following
  the printed page. Use printed `ὀρῶν` in the mountain phrase.
- Keep angle brackets around the twelve-finger conclusion relocated by Schöne
  to p. 286, lines 5–6. Omit its editor-deleted duplicate at the chapter’s end.
- Explicitly show **τάχος / πάχος**: the edited text says speed; the apparatus
  at p. 286, lines 9–10 records thickness. The following faster/slower comparison
  supports the interpretation used here, but the apparatus remains inspectable.
- Render `ὄγκος` as “size” in the section argument. The two lengths produce a
  cross-sectional area; translating this automatically as modern volume would
  confuse the quantities. “In depth” in the two-finger example makes explicit
  the dimension paired with width, as the facing German does.
- Treat the sundial interval and day estimate without assigning fixed modern
  seconds to an ancient hour. No finger-to-centimetre conversion is made.

The complete normalized Greek sequence is compared against the pinned TEI,
with exactly those adaptations. This comparison does not independently certify
the new English interpretation. Full Greek and facing German were also read
from the scans.

## Modern experiment

Both streams have the same chosen rectangular wetted section. Width is 4–16 cm,
depth 1–6 cm, and each section-mean normal speed is 5–30 cm/s. The replay frame
is 0–20 modern seconds in tenths. Receiver scale is fixed at 60 L: the maximum
allowed collection is 57.6 L. Every input combination therefore remains visible
without hidden overflow or automatic rescaling.

For section area `A = width * depth` in cm² and speed `v` in cm/s:

```
Q = A * v / 1000                         litres per second
V_A(t) = A * v_A * t / 1000              litres
V_B(t) = A * v_B * t / 1000              constant-speed case
V_B(t) = A * (v_B * min(t,10)
             + v_A * max(t-10,0)) / 1000 changing-speed case
```

The variable case switches B to A's speed at exactly 10 seconds. The displayed
instantaneous speed at the switch uses the new value; volume is continuous.
The end and side views have different scales, each isotropic within its view.
Receiver water height is linear in volume, at the same fixed scale for A and B.

The full simulated twenty-second record is visible throughout. Replay is an
inspection of that record, not a live instrument measurement. It starts only
on request, updates in tenths, and pauses when controls change or the tab hides.
No constant display-frame rate is used to infer elapsed time.

| Default 12 by 4 cm section | A | B, constant | B, changes after 10 s |
| --- | ---: | ---: | ---: |
| Initial mean speed / cm/s | 10 | 30 | 30 |
| Final mean speed / cm/s | 10 | 30 | 10 |
| Collected at 10 s / L | 4.8 | 14.4 | 14.4 |
| Collected at 20 s / L | 9.6 | 28.8 | 19.2 |
| Whole-window average / L/s | 0.48 | 1.44 | 0.96 |

For any selected window, subtract the starting collected volume from the end
volume and divide by elapsed time. The first, last and whole windows are
0–10, 10–20 and 0–20 seconds. In the changing default, the first window predicts
28.8 L over twenty seconds (9.6 L too much), the last predicts 9.6 L (9.6 L too
little), and the whole window measures the actual 19.2 L.

The dashed line applies the selected B average from an empty receiver across
the whole record. It is an extrapolation/comparison, not an additional measured
stream. The full-window average remains valid even when instantaneous speed
changes.

## Boundaries and artifacts

This is complete ideal collection, with no leakage or storage delay. The chosen
mean speeds are not calculated from head, pipe friction, rainfall or pressure.
The rectangular stream is not a reconstruction of the square lead pipe. The
receiver, graduations, units, switching schedule, formula and plot are modern.
The chapter supplies neither an algebraic discharge formula nor the experiment's
numerical dimensions and timing. The dioptra selects a low outlet in the text;
the sundial supplies time. No claim is made about historical instrument accuracy.

The share query rejects duplicate, non-finite, malformed, out-of-range and
non-step numeric values instead of silently accepting conflicting settings.
Source and section navigation preserve the experiment query. Native downloads
retain a click-time snapshot while sources are being fetched and verified.

The CSV contains the actual width, depth, area, instantaneous speed and cumulative
volume at every whole second, plus both interval averages and extended totals.
The SVG includes the MIT license and both receiver scales. The self-contained
HTML embeds all eleven readings, four verified scans, fonts, complete licenses,
CSV and source/model decisions. It has no scripts or remote subresources.
A browser-produced PDF is a digital artifact; physical paper printing is untested.
