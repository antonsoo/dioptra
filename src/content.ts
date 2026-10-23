export const SOURCE = "https://archive.org/details/heronisalexandr00schogoog";
export const TEI_SOURCE =
  "https://github.com/OpenGreekAndLatin/First1KGreek/blob/25b9f2150cfd329d94177e86e334d35487a07d3b/data/tlg0559/tlg007/tlg0559.tlg007.1st1K-grc1.xml";
export const LIMITS =
  "A planar reading of Hero’s construction. The metres, route coordinates and mountain outline are chosen. This is not a reconstruction of Samos, an elevation survey or an estimate of ancient instrument accuracy.";
export const sources = [
  {
    file: "schone-238.jpg",
    page: 238,
    title: "Greek instruction and figure 95",
    note: "Schöne (1903), p. 238. The diagram identifies the portals Β and Δ, the circuit and the two outside sighting triangles. It is schematic: its drawn shape does not reproduce the text’s five-to-one example.",
    focus: 0.2,
  },
  {
    file: "schone-239.jpg",
    page: 239,
    title: "The facing German translation",
    note: "Printed p. 239. The lower half translates the start of chapter XV. The apparatus below records the editor’s supplied words in the Greek instrument instruction.",
    focus: 0.45,
  },
  {
    file: "schone-240.jpg",
    page: 240,
    title: "Greek calculation and meeting claim",
    note: "Printed p. 240. Read the five-to-one example and the concluding sentence. The printed distance lists use Λ where the preceding construction and diagram close the measured circuit at Μ; the experiment makes that distinction explicit.",
    focus: 0.1,
  },
  {
    file: "schone-241.jpg",
    page: 241,
    title: "Translation and textual apparatus",
    note: "Printed p. 241. Schöne’s German translation completes chapter XV above chapter XVI. The apparatus preserves readings and editorial changes; the model is a geometric reading, not a new critical edition.",
    focus: 0.1,
  },
];
export const passages = [
  {
    title: "The entrances are given",
    ref: "Dioptra 15 · p. 238, lines 2–4",
    source: 0,
    greek: "Ὄρος διορύξαι ἐπ’ εὐθείας τῶν στομάτων τοῦ ὀρύγματος ἐν τῷ ὄρει δοθέντων.",
    english:
      "To bore through a mountain in a straight line, when the mouths of the excavation in the mountain have been given.",
    word: "τῶν στομάτων … δοθέντων",
    gloss: "the mouths having been given",
    grammar:
      "A genitive absolute: a genitive noun and participle set the condition. Στόμα means ‘mouth’; here it names a tunnel entrance. Διορύξαι is an aorist active infinitive stating the task, not a report that the work happened in the past.",
    action:
      "Both portals are fixed before the outside circuit is chosen. Moving the bends does not move the entrances.",
  },
  {
    title: "Begin with a line you can choose",
    ref: "Dioptra 15 · p. 238, lines 6–8",
    source: 0,
    greek:
      "ἤγαγον εὐθεῖαν ἀπὸ τοῦ Β ἐν τῷ ἐδάφει τὴν ΒΕ, ὡς ἔτυχεν· καὶ ἀπὸ τυχόντος τοῦ Ε τῇ ΒΕ πρὸς ὀρθὰς ἤγαγον τὴν ΕΖ διὰ τῆς διόπτρας·",
    english:
      "I drew a straight line ΒΕ from Β on the ground, as it happened; and from a point Ε chosen at will I drew ΕΖ at right angles to ΒΕ by means of the dioptra.",
    word: "πρὸς ὀρθὰς",
    gloss: "at right angles",
    grammar:
      "The feminine plural ὀρθὰς leaves ‘angles’ understood. Διὰ with the genitive τῆς διόπτρας names the means: ‘by means of the dioptra’. A line chosen at will need not point toward the hidden entrance.",
    action:
      "Follow ΒΕ, then turn a right angle onto ΕΖ. Change the circuit and watch the net displacement stay fixed.",
  },
  {
    title: "Close the circuit with a perpendicular sight",
    ref: "Dioptra 15 · p. 240, lines 1–3",
    source: 2,
    greek:
      "ἂν διὰ τῆς πρὸς ὀρθὰς θέσεως τοῦ κανόνος φανῇ τὸ Δ σημεῖον. πεφηνέτω ⟨οὔσης τῆς διόπτρας κατὰ τὸ Μ⟩· ἔσται δὴ ἡ ΜΔ καὶ ἐπὶ τὴν ΚΛ κάθετος.",
    english:
      "…until point Δ comes into view through setting the sighting rule at right angles. Let it have appeared with the dioptra at Μ; then ΜΔ will be perpendicular to ΚΛ.",
    word: "κάθετος",
    gloss: "perpendicular",
    grammar:
      "The adjective describes ΜΔ relative to the line ΚΛ. The opening ἂν continues ‘until’ from the preceding page. Angle brackets retain Schöne’s supplied words; the instrument’s position at Μ is editorially explicit here.",
    action:
      "The measured circuit ends Κ–Μ–Δ. Λ belongs to the longer sight line. It is not an extra measured corner in this model.",
  },
  {
    title: "Imagine the triangle you cannot measure directly",
    ref: "Dioptra 15 · p. 240, lines 3–5",
    source: 2,
    greek: "καὶ νενοήσθω ἐκβεβλημένη ἡ ΕΒ ἐπὶ τὸ Ν, καὶ ἐπ’ αὐτὴν κάθετος ἡ ΔΝ.",
    english: "And let ΕΒ be imagined extended to Ν, with ΔΝ perpendicular to it.",
    word: "νενοήσθω",
    gloss: "let it be imagined",
    grammar:
      "A perfect passive imperative asks the reader to hold a construction in mind. The line inside the mountain is not another accessible measuring path. Ν is the foot of the perpendicular from Δ to the extended baseline.",
    action:
      "Subtract leftward distances from rightward ones to obtain ΒΝ. Sum the perpendicular signed distances to obtain ΔΝ.",
  },
  {
    title: "Five times is an example, not a universal rule",
    ref: "Dioptra 15 · p. 240, lines 9–10",
    source: 2,
    greek: "εὑρήσθω οὖν, εἰ τύχοι, πενταπλῆ ἡ ΒΝ τῆς ΔΝ",
    english: "Suppose, then, for example, that ΒΝ has been found to be five times ΔΝ.",
    word: "πενταπλῆ",
    gloss: "fivefold; five times as large",
    grammar:
      "The feminine adjective agrees with the understood straight line ΒΝ. The genitive τῆς ΔΝ supplies the comparison. Εἰ τύχοι makes this an example; it does not prescribe a five-to-one ratio for every tunnel.",
    action:
      "The default circuit gives 300:60 = 5:1. Only that ratio comes from the example; the metre lengths are chosen. Try a different exercise to see the construction generalize.",
  },
  {
    title: "Make a small similar triangle outside",
    ref: "Dioptra 15 · p. 240, lines 15–17",
    source: 2,
    greek:
      "λαβόντες οὖν ἐπὶ τῆς ΒΕ σημεῖον τυχὸν τὸ Ο, καὶ πρὸς ὀρθὰς ἀγαγόντες τὴν ΟΞ τῇ ΒΟ, πέμπτον μέρος θήσομεν τὴν ΟΞ τῆς ΒΟ.",
    english:
      "Taking, then, any point Ο on the line ΒΕ, and drawing ΟΞ at right angles to ΒΟ, we shall make ΟΞ one fifth of ΒΟ.",
    word: "πέμπτον μέρος",
    gloss: "a fifth part",
    grammar:
      "The fractional expression reverses the comparison: if the long leg is five times the short one, the short leg is one fifth of the long one. The figure places Ο on the extension beyond Β. ‘Line ΒΕ’ need not mean only the finite segment between the two letters.",
    action:
      "Set the outside baseline, then place the perpendicular peg. In the five-to-one example, a 50 m baseline needs a 10 m perpendicular.",
  },
  {
    title: "Extend both outside lines inward",
    ref: "Dioptra 15 · p. 240, lines 20–22",
    source: 2,
    greek:
      "διορύξομεν οὖν ἀπὸ μὲν τοῦ Β ποιοῦντες τὸ ὄρυγμα ἐπ’ εὐθείας τῆς ΒΞ, ἀπὸ δὲ τοῦ Δ ἐπ’ εὐθείας τῆς ΔΠ.",
    english:
      "We shall therefore bore through, making the excavation from Β in a straight line with ΒΞ, and from Δ in a straight line with ΔΠ.",
    word: "ἀπὸ μὲν … ἀπὸ δὲ",
    gloss: "from the one … from the other",
    grammar:
      "The paired particles coordinate the two starting points. Ἀπό takes the genitive. The construction uses exterior sights to establish an inward direction; no sight line through the intact mountain is assumed.",
    action:
      "Extend Ξ–Β and Π–Δ into the mountain. The small triangles give collinear lines when their proportions agree with the hidden triangle.",
  },
  {
    title: "The workers will meet",
    ref: "Dioptra 15 · p. 240, lines 24–26",
    source: 2,
    greek: "γινομένου τοῦ ὀρύγματος οὕτως ὑπαντήσουσιν ἀλλήλοις οἱ ἐργαζόμενοι.",
    english: "With the excavation made in this way, the workers will meet one another.",
    word: "ὑπαντήσουσιν ἀλλήλοις",
    gloss: "they will meet one another",
    grammar:
      "Ὑπαντήσουσιν is future active, third-person plural; οἱ ἐργαζόμενοι, ‘the workers’, is its subject. The reciprocal pronoun ἀλλήλοις is dative. The mathematical conclusion depends on the stated alignments being maintained.",
    action:
      "Reveal the middle cross-section. Then deliberately displace an outside peg: the ideal proof and a perturbed physical setting are different experiments.",
  },
];
export const steps = [
  {
    title: "Walk around",
    note: "Select a measured leg. Every turn is a right angle, but the circuit never needs to enter the mountain.",
    passage: 1,
  },
  {
    title: "Cancel the detours",
    note: "Keep direction with each distance. Opposing horizontal walks cancel; the hidden right triangle has the same net displacement.",
    passage: 3,
  },
  {
    title: "Set the sights",
    note: "Build a smaller right triangle outside each entrance. Its proportions establish a line you can extend inward.",
    passage: 5,
  },
  {
    title: "Meet in the middle",
    note: "Extend both lines to the middle station. Try a chosen peg error and compare it with a longer outside baseline.",
    passage: 7,
  },
];
