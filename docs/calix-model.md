# A diameter name, an area and a delivery

Frontinus, _De aquis urbis Romae_ I.25–28, 35–36 and 43 motivates a controlled
modern comparison. The pipe-name discussion and the pressure qualification must
be read together. This room adds a Latin comparison to Hero’s Greek measuring
arguments, without claiming a shared ancient algebraic formula.

## What the retained witness says

| Passage | Printed page | Reading used                                                                                           |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| I.25    | 14           | The probable quinaria etymology is a diameter of five quarters of a digit; a senaria has six quarters. |
| I.26    | 14           | Diameter, perimeter and area describe a gauge.                                                         |
| I.27    | 15           | One enlargement combines several quinaria-sized areas in one opening.                                  |
| I.28    | 15           | Adding a quarter to the diameter is a different enlargement.                                           |
| I.35    | 17           | Height, pressure and a longer route affect delivery.                                                   |
| I.36    | 18           | The bronze calix is at least twelve digits long; pipes attach to it.                                   |
| I.43    | 19           | The ten-pipe has diameter two and a half digits and reported capacity four quinariae.                  |

The witness is Franz Bücheler (ed.), _Iulii Frontini De aquis urbis Romae libri
II_, Leipzig: B. G. Teubner, 1858, retained from the [Internet Archive
volume](https://archive.org/details/iuliifrontinide00bcgoog). Six full, uncropped
pages include the title and critical apparatus. The [manifest](../public/sources/frontinus/manifest.json)
pins the complete source PDF, derivative JPEGs and PDF/leaf mapping. Pages 14,
15, 17, 18 and 19 are PDF pages 35, 36, 38, 39 and 40; title PDF page 6 is archive
leaf 5. Printed numbering is not an archive leaf number.

Latin selections join printed lines and omit the apparatus, while preserving
Bücheler’s u/v spelling and printed **sexs** (six). The ten-pipe selection explicitly
marks omitted circumference figures. Selections are not a complete chapter
transcription. English and word notes are new teaching aids. The orange source
band is a separate overlay around relevant lines, not a modification of a scan.

The [Latin Library text](https://www.thelatinlibrary.com/frontinus/aqua1.shtml)
and [Bennett’s 1925 translation](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Frontinus/De_Aquis/Bennett/1*.html)
provide comparisons, rather than silently substituting another edition. In
particular the larger capacity table includes edited fractions and variants.
The lesson uses the stated diameter rule to calculate circles, preserves the
reported four-quinaria example, and does not force every table entry into a
modern mathematical series. Adjustable names stop at ten quarter-digits; the
larger area-based naming scheme is not applied to this control.

## The controlled modern comparison

Reference: one circular opening, diameter 5/4 source digits, constant head 16
chosen units. The comparison has 1–4 openings, each 5–10 quarter-digits across,
and constant head 1–64 chosen units. Collection lasts 1–4 chosen time units.

For a circular opening, area is pi times radius squared. For the ideal outlet,
Bernoulli’s energy relation gives exit speed proportional to the square root of
head. With a common coefficient and gravity:

```
A / A0 = count * (D / D0)^2
Q / Q0 = (A / A0) * sqrt(h / h0)
V / V0 = Q / Q0                       [same collection interval]
```

The [OpenStax Bernoulli derivation](https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation)
is the modern physical source, not an attributed Frontinus formula. Both water
surfaces are maintained at constant height. The comparison omits approach
velocity, friction, pipe length and downstream pressure differences; the outlet
coefficient is common. The drawn outlets are marks, not an archaeological
fitting or a flow-width scale. Four equal small opening areas sum to an area
four times as large; this is not a circle-packing claim.

| Setup                         | Area ratio | Head ratio | Delivery ratio |
| ----------------------------- | ---------- | ---------- | -------------- |
| Double diameter               | 4          | 1          | 4              |
| Four small openings           | 4          | 1          | 4              |
| Double diameter, shallow head | 4          | 1/16       | 1              |
| Same opening, four times head | 1          | 4          | 2              |

Head rulers share one linear scale. Both collection bars share a linear scale
whose maximum changes with the setup and is printed beside them. Volumes are
normalized so the reference collects one relative-volume unit per chosen time
unit. Neither head nor time is converted to a historical or SI unit. A source
digit remains a source digit. A quinaria remains a source gauge/capacity term;
there is no conversion to litres per second.

Area, diameter, head and squared delivery ratios use reduced integer fractions;
only square roots and derived displayed volumes require rounding. CSV retains
those exact ratios and a 15-significant-digit flow approximation. Settings and
at most twelve complete trials round-trip in the URL. An invalid or ambiguous
record restores the whole initial experiment and identifies that change.

## Reading and artifact behavior

The page verifies source images against retained SHA-256 identities before
replacing the displayed image. A fresh decoded image replaces the old one, so a
repeated Find after zooming works in Firefox as well as Chromium. A failed
source check hides the image and allows retry. Saving a reading verifies all
six images, manifest, notices, fonts and licenses before a download is created.
A valid different image or font must fail, even with HTTP 200.

The script-free reading embeds those exact bytes and the settings captured when
Save was chosen, even if the live rig changes during the save. It contains nine
readings, the trial book, area and head/collection diagrams, full source pages,
licenses and a reopening link. The trial book records predictions, not observed
ancient performance. The two-second screen animation illustrates a calculation
and does not define the chosen time unit.
