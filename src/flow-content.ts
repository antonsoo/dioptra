// Adapted Greek and new English / language notes: CC BY-SA 4.0. See sources/NOTICES.txt.
export const FLOW_BOUNDARY =
  "A modern ideal experiment: centimetres, seconds, litres, uniform section-mean speeds and the twenty-second schedule are chosen. All outflow is collected without leakage or storage delay. These are not measurements of an ancient spring or a conversion of Hero’s fingers and sundial hours.";
export const flowSources = [
  {
    page: 284,
    title: "Greek: the changing spring",
    note: "Chapter 31 begins at line 11 below the end of chapter 30. The lower apparatus records corrections in the rain passage. The pipe instruction continues on page 286.",
  },
  {
    page: 285,
    title: "German: the opening instruction",
    note: "Schöne’s facing German begins chapter XXXI near the bottom. The numerical triangle example above belongs to chapter 30.",
  },
  {
    page: 286,
    title: "Greek: size, speed and time",
    note: "The chapter concludes at line 18. Notice the supplied twelve-finger conclusion near line 5 and its deleted duplicate at the end. The apparatus at lines 9–10 records τὸ πάχος where the edited text reads τὸ τάχος.",
  },
  {
    page: 287,
    title: "German: the complete measurement",
    note: "The facing German continues the enclosure and pipe instructions, then explains speed and timed collection. Chapter XXXII starts below the conclusion.",
  },
];
export const flowPassages = [
  {
    title: "Investigate a spring",
    ref: "p. 284, lines 11–12",
    page: 284,
    greek: "Πηγῆς ὑπαρχούσης ἐπισκέψασθαι τὴν ἀπόρρυσιν αὐτῆς, τουτέστι τὴν ἀνάβλυσιν, ὅση ἐστίν.",
    english: "Given a spring, to investigate its outflow—that is, how much it wells up.",
    word: "πηγῆς ὑπαρχούσης",
    gloss: "a spring being present",
    note: "A genitive absolute supplies the starting condition. The aorist infinitive ἐπισκέψασθαι states the task: ‘to investigate’. It does not say the investigation took place in the past.",
  },
  {
    title: "The supply does not stay the same",
    ref: "p. 284, lines 12–13",
    page: 284,
    greek: "εἰδέναι μέντοι χρὴ ὅτι οὐκ ἀεὶ ἡ ἀνάβλυσις ἡ αὐτὴ διαμένει.",
    english: "One must, however, know that the flow does not always remain the same.",
    word: "οὐκ ἀεὶ … ἡ αὐτή",
    gloss: "not always … the same",
    note: "Χρή with an infinitive expresses necessity: ‘one must know’. The article in ἡ αὐτή makes αὐτή mean ‘the same’. This opening matters when a short observation is extended to a longer period.",
  },
  {
    title: "Rain and drought",
    ref: "p. 284, lines 14–18",
    page: 284,
    greek:
      "ὄμβρων μὲν γὰρ ὄντων ἐπιτείνεται διὰ τὸ ἐπὶ τῶν ὀρῶν τὸ ὕδωρ πλεονάζον βιαιότερον ἐκθλίβεσθαι, αὐχμῶν δὲ ὄντων ἀπολήγει ἡ ῥύσις διὰ τὸ μὴ ἐπιφέρεσθαι πλέον ὕδωρ. αἱ μέντοι γενναῖαι πηγαὶ οὐ παρὰ πολὺ τὴν ἀνάβλυσιν ἴσχουσιν.",
    english:
      "For when there are rains it increases, because the abundant water on the mountains is forced out more strongly; but when there are droughts the flow falls away, because no more water is brought in. Strong springs, however, vary their flow only a little.",
    word: "ὄμβρων μὲν … αὐχμῶν δέ",
    gloss: "when there are rains … but when there are droughts",
    note: "Two genitive absolutes balance rain against drought with μέν … δέ. Διὰ τὸ plus an infinitive gives a reason. The edition’s apparatus records corrections in the rain sentence; this reading follows the printed text. The experiment’s abrupt ten-second switch is a teaching device, not a model of rainfall response.",
  },
  {
    title: "Capture all the water",
    ref: "p. 284, lines 18–21",
    page: 284,
    greek:
      "δεῖ οὖν περιλαβόντα τὸ πᾶν τῆς πηγῆς ὕδωρ, ὥστε μηδαμόθεν ἀπορρεῖν, σωλῆνα τετράγωνον μολιβοῦν ποιῆσαι, στοχασάμενον μᾶλλον μείζονα πολλῷ τῆς ἀποθύσεως·",
    english:
      "One must therefore enclose all the spring’s water, so that none flows away elsewhere, and make a square lead pipe, judging it to be considerably larger than the discharge requires.",
    word: "τὸ πᾶν … ὕδωρ",
    gloss: "all the water",
    note: "Πᾶν agrees with the neuter ὕδωρ. The instruction is about complete capture: a receiver that misses some of the water understates the supply. The pipe is square; the water need not fill its opening. The model uses an ideal rectangular stream and complete collection.",
  },
  {
    title: "Use the dioptra to find the low outlet",
    ref: "pp. 284, line 21 – 286, line 1",
    page: 284,
    greek:
      "εἶτα δι’ ἑνὸς τόπου ἐναρμόσαι αὐτὸν ὥστε δι’ αὐτοῦ τὸ ἐν τῇ πηγῇ ὕδωρ ἀπορρεῖν. δεῖ δὲ αὐτὸν κεῖσθαι εἰς τὸν ταπεινότερον τῆς πηγῆς τόπον, ὥστε ἔχειν αὐτὴν ἀπόρρυσιν· τὸν δὲ ταπεινότερον ἐπιγνωσόμεθα τῆς πηγῆς τόπον διὰ τῆς διόπτρας.",
    english:
      "Then fit it through one place so that the water in the spring flows out through it. It must lie at the spring’s lower place, so that the spring has an outlet; we shall identify the spring’s lower place by means of the dioptra.",
    word: "διὰ τῆς διόπτρας",
    gloss: "by means of the dioptra",
    note: "Διά with the genitive names the means. Ταπεινότερον is comparative: ‘lower’. Here the surveying instrument chooses a place for the outlet; the later sundial supplies time. They do different jobs.",
  },
  {
    title: "Six times two makes twelve",
    ref: "p. 286, lines 1–6",
    page: 286,
    greek:
      "ἀπολήψεται οὖν τὸ ἀπορέον διὰ τοῦ σωλῆνος ὕδωρ ἐν τῷ περιστομίῳ τοῦ σωλῆνος· οἷον ἀπολαμβάνει δακτύλους β· ἐχέτω δὲ καὶ τὸ πλάτος τοῦ περιστομίου τοῦ σωλῆνος δακτύλους ϛ· ἑξάκις δύο γίνονται ιβ· ⟨ἀποφανούμεθα δὴ τὴν ἀνάβλυσιν τῆς πηγῆς δακτύλων ιβ⟩.",
    english:
      "The water flowing through the pipe will occupy part of its mouth: for example, it occupies two finger-widths in depth; let the mouth’s width also be six finger-widths. Six times two makes twelve. ⟨We shall then declare the spring’s flow to be twelve fingers.⟩",
    word: "ἑξάκις δύο",
    gloss: "six times two",
    note: "Β = 2, ϛ = 6, ιβ = 12. ‘In depth’ makes explicit the dimension paired with width, as Schöne’s German does. The product measures a cross-sectional area even though the text says ‘fingers’. It is not a volume per time. Angle brackets preserve the editor’s relocated conclusion; the final duplicate is deleted in the printed edition.",
  },
  {
    title: "Size is insufficient",
    ref: "p. 286, lines 6–9",
    page: 286,
    greek:
      "εἰδέναι δὲ χρὴ ὅτι οὐκ ἔστιν αὔταρκες πρὸς τὸ ἐπιγνῶναι, πόσον χορηγεῖ ὕδωρ ἡ πηγή, τὸ εὑρεῖν τὸν ὄγκον τοῦ ῥεύματος, ὃν λέγομεν εἶναι δακτύλων ιβ,",
    english:
      "But one must know that finding the size of the stream, which we call twelve fingers, is not sufficient to discover how much water the spring supplies;",
    word: "οὐκ ἔστιν αὔταρκες",
    gloss: "it is not sufficient",
    note: "The subject is the articular infinitive τὸ εὑρεῖν, ‘finding’. Ὄγκος is rendered ‘size’ here, not automatically modern three-dimensional ‘volume’: the preceding two lengths produced an area. This sentence continues into the next unit.",
  },
  {
    title: "The missing quantity is speed",
    ref: "p. 286, lines 9–11",
    page: 286,
    greek:
      "ἀλλὰ καὶ τὸ τάχος αὐτοῦ· ταχυτέρας μὲν γὰρ οὔσης τῆς ῥύσεως πλέον ἐπιχορηγεῖ τὸ ὕδωρ, βραδυτέρας δὲ μεῖον.",
    english:
      "its speed is needed too. For when the flow is faster it supplies more water; when slower, less.",
    word: "τάχος / πάχος",
    gloss: "speed / thickness",
    note: "The edited text reads τάχος, ‘speed’; Schöne’s apparatus at lines 9–10 records τὸ πάχος, ‘thickness’. A single letter changes the quantity. This lesson follows the edited reading and the following faster/slower comparison; it does not present that choice as an autograph we can inspect. Ταχυτέρας and βραδυτέρας are feminine comparatives agreeing with ῥύσεως.",
  },
  {
    title: "Collect the water and observe the time",
    ref: "p. 286, lines 11–14",
    page: 286,
    greek:
      "διὸ δεῖ ὑπὸ τὴν τῆς πηγῆς ῥύσιν ὀρύξαντα τάφρον τηρῆσαι ἐξ ἡλιακοῦ ὡροσκοπίου, ἐν τινὶ ὥρᾳ πόσον ἀπορρεῖ ὕδωρ ἐν τῇ τάφρῳ,",
    english:
      "Therefore one must dig a trench beneath the spring’s outflow and observe by a sundial how much water flows into the trench in a certain interval;",
    word: "ἐξ ἡλιακοῦ ὡροσκοπίου",
    gloss: "by a solar time indicator",
    note: "Ἡλιακοῦ describes the instrument as solar: a sundial. Τάφρος is a trench or ditch used here to receive the water. The text supplies no numerical timing interval or receiver dimensions. Our graduated vessels and modern seconds make the method visible; they are not a reconstruction of that equipment.",
  },
  {
    title: "Estimate a longer supply",
    ref: "p. 286, lines 14–15",
    page: 286,
    greek: "καὶ οὕτως στοχάσασθαι τὸ ἐπιχορηγούμενον ὕδωρ ἐν τῇ ἡμέρᾳ πόσον ἐστίν,",
    english: "and in this way estimate how much water is supplied in the day,",
    word: "στοχάσασθαι",
    gloss: "to estimate",
    note: "An aorist middle infinitive continues δεῖ, ‘one must’. The wording calls for an estimate. Applying a short sample’s rate to a longer period requires the sample to represent that period. The changing-flow exercise exposes that assumption; it does not convert an ancient hour into a fixed number of seconds.",
  },
  {
    title: "The opening need not be measured",
    ref: "p. 286, lines 15–17",
    page: 286,
    greek:
      "ὥστ’ οὐδὲ ἀναγκαῖόν ἐστι τὸν ὄγκον τῆς ῥύσεως τηρεῖν· διὰ γὰρ τοῦ χρόνου δήλη ἐστὶν ἡ χορηγία.",
    english:
      "so that it is not even necessary to observe the size of the flowing stream: through the time, the supply becomes clear.",
    word: "διὰ τοῦ χρόνου",
    gloss: "through the time",
    note: "The article and genitive follow διά. The conclusion depends on the preceding collection of water as well as the time observation. Time alone cannot determine a volume. Measuring collected volume over an interval bypasses a separate measurement of the opening and speed.",
  },
];
