# Count the teeth. Then measure.

The third Dioptra room reads chapter 34 as an argument about calibration.
Its numerical starting point is the source's supposed trial, not a measurement
of a surviving machine. The implementation makes the distinction between
mechanism position, an assigned scale, and an outside journey record visible.

## What comes from the source

Hermann Schöne, _Herons von Alexandria Vermessungslehre und Dioptra_ (Teubner,
Leipzig, 1903), printed pp. 292–303. The Greek chapter starts halfway down
p. 292 and ends with two lines on p. 302. The facing German finishes its
translation on p. 301. Page 295 includes the edition's explanatory cutaway,
figure 114, with more reduction stages than the workshop. This is a later
illustration, not an archaeological drawing of an extant instrument.

The beginning has a textual gap after the box's floor is named. We do not
supply the missing construction. The following text nevertheless states that
eight road-wheel revolutions make the pin drum complete one revolution.
That drum and the first worm share a shaft; they are not two successive
eight-to-one reductions.

The initial theoretical example uses one tooth advanced per worm turn and
two successive thirty-tooth wheels:

```text
road wheel       indexed drum + worm       first output       second output
7,200 turns  ->       900 turns         ->    30 turns    ->       1 turn
              divide by 8                 divide by 30       divide by 30

7,200 wheel turns x 10 cubits = 72,000 cubits = 180 source stadia
```

The later passage says that worm turns do not move the teeth precisely or
in a measured amount, and instructs the operator to turn the first worm
**by trial**, until the adjacent wheel completes one revolution. Its example
supposes twenty turns for a thirty-tooth wheel. The Greek `εἰ τύχοι` marks
an example; it is not an authenticated report from a particular built device.

The source supplies the complete recalculation:

```text
20 shaft turns x 8 wheel turns/shaft turn x 10 cubits/wheel turn = 1,600 cubits
1,600 cubits / 30 divisions = 53 1/3 cubits/division
15 divisions x 53 1/3 cubits/division = 800 cubits = 2 stadia
```

The uncorrected theoretical graduation would assign eighty cubits to a
division and read those same fifteen divisions as 1,200 cubits. Applying the
measured graduation changes that distance to 800 without moving either pointer.

The example itself supplies the convention of 400 cubits per stadion. No
conversion to metres, or claim about a universal ancient unit, is needed.

## The implemented experiment

The first reduction has three fixtures:

| Fixture                           | Shaft turns per first revolution | Cubits per fine division | Fifteen fine divisions |
| --------------------------------- | -------------------------------: | -----------------------: | ---------------------: |
| Source's supposed trial           |                               20 |                   53 1/3 |                    800 |
| Source's initial theoretical case |                               30 |                       80 |                  1,200 |
| Explicit modern additional trial  |                               24 |                       64 |                    960 |

The additional fixture tests whether a learner can apply the procedure to a
different ratio. It is not attributed to Hero. A chosen replay speed has no
historical significance. Nothing moves until the learner operates a control.

The trial drives the first worm directly, with an independent shaft-turn
counter. It stops at exactly one output revolution. The measured scale cannot
be applied while the trial is incomplete. Restarting it withdraws that scale;
changing road-wheel count preserves the completed calibration. Shared URLs
retain the observation and reject an incomplete observation with a measured
scale. The supplied twenty-turn ratio is modelled as uniform average motion.
No proposed tooth profile or explanation of that ratio is implied.

The second reduction remains an assumed thirty-to-one relationship. The source
explicitly asks for the other wheels to be treated too. Applying a measured
graduation to the first stage does **not** verify the other stage or wheel rolling.

## Reading both pointers

Let `w` be completed road-wheel turns and `a` the fixture's first-stage shaft
turns per revolution. Let `P = 8a` and `C = 30P`. The first pointer has
`30(w mod P)/P` fine divisions. The second has `30(w mod C)/C` divisions.
Each complete second-dial division represents a complete first-dial revolution.

Read the integer part of the second pointer, then add the fine remainder:

```text
fine-equivalent divisions = 30 x floor(second divisions) + first divisions
distance = fine-equivalent divisions x cubits per fine division
```

Adding both fractional readings would count the fine portion twice. An exact
integer modulo precedes each floating-point division in the implementation,
so a carry occurs at the wheel-turn boundary rather than at a rounded display.

The fine graduation is `8a/3` cubits after calibration, or eighty cubits while
the theoretical graduation is retained. At the source's twenty-turn fixture,
159 wheel turns read 1,590 cubits; 160 read 1,600 and move the second dial to
its first full division. Both statements assume the completed first-stage trial
and the explicitly theoretical second stage.

Both pointers wrap after `C` road-wheel turns. The source's initial theoretical
case wraps at 7,200 turns / 72,000 cubits. The twenty-turn fixture with the
assumed second stage wraps at 4,800 turns / 48,000 cubits. The instrument reads
zero at that instant. A separate, explicitly modern outside ledger retains
`10w` cubits and the complete circuit count; the drawn instrument does not.
Hero's daily-record instruction motivates making this information loss visible.

## Language and source decisions

Fourteen selections retain the Greek argument, with new English and contextual
notes for an English-speaking beginner. They cover rolling, comparing earlier
instruments, eight-to-one indexing, the theoretical tooth, longer range, daily
records, trial, twenty versus thirty, wheel-turn recovery, graduation, fifteen
teeth, the other stages, external pointers, and readable larger dials.

Greek comes from the unchanged bundled Harvard College Library / Open Greek
and Latin TEI file, pinned to commit
`25b9f2150cfd329d94177e86e334d35487a07d3b`. Its attribution and CC BY-SA 4.0
terms accompany the adapted Greek, new English and teaching text. Source pages
are public domain; code and new diagrams are MIT.

Selections join whitespace and line endings, omit line numbers and apparatus,
and explain alphabetic numerals rather than replace them with decimal figures.
At printed p. 298 the digital text's `τύμπανυν` differs from printed `τύμπανον`;
the reading retains and identifies the digital form. The unit-fraction gamma
in `νγ γ΄` is explained separately from the integer numeral. The scans keep
all editorial marks. This is not a critical edition or a complete chapter
transcription; the full Greek and facing German are in the twelve images.

Printed and marginal pagination are different. The calibration is Schöne's
printed p. 298, with earlier-edition p. 312 in its margin. Internet Archive's
scandata identifies it as leaf 313; the included PDF has it on page 313.
The source links use verified archive leaves, not an assumed zero-based PDF index.

## Boundaries

The diagram unfolds the ratios into one plane; it does not reproduce the
edition's physical arrangement or fill the initial textual gap. Pins, dial
radius, colours, Arabic division labels and the outside ledger are teaching
choices. Worm/wheel contact geometry, alternate shaft directions, backlash,
slip, friction, manufacturing precision, reverse travel and durability are
not simulated. Between-division pointer values interpolate the ideal ratio;
they establish no historical reading precision. The source's larger-dial
instruction improves mark spacing without by itself proving better accuracy.

The standalone HTML embeds the frozen experiment, checkpoints, complete
selected reading, all twelve scans, fonts and full licenses. Every bundled
asset must match its recorded SHA-256 before the download is offered. It has
no scripts or automatic remote requests. The included CSV can also be saved
from that file. Printed output is a browser PDF, not a physically tested
printout, tagged PDF or separately typeset edition.
