export const COUNTER_BOUNDARY =
  "A ratio experiment based on Dioptra 34, not a reconstruction of an excavated instrument. Wheel rolling, transmission and pointer interpolation are idealized. The trial changes an observed ratio; it does not explain the cause of that ratio. Only the first worm is tested. The second remains at its assumed 30:1 ratio.";
export const counterPassages = [
  {
    title: "Measure while travelling",
    page: 292,
    ref: "p. 292, lines 16–22",
    greek:
      "Ἀκόλουθον δὲ εἶναι νομίζομεν τῇ διοπτρικῇ πραγματείᾳ καὶ διὰ τοῦ καλουμένου ὁδομέτρου τὰ ἐπὶ τῆς γῆς μετρεῖν διαστήματα, ὥστε μὴ διʼ ἀλύσεως μετροῦντα ἢ σχοινίου κακοπαθῶς καὶ βραδέως ἐκμετρεῖν, ἀλλʼ ἐπʼ ὀχήματος πορευόμενον, διὰ τῆς τῶν τροχῶν ἐκκυλίσεως ἐπίστασθαι τὰ προειρημένα διαστήματα.",
    english:
      "We think it follows naturally from the study of the dioptra to measure distances on the earth also by the so-called hodometer: instead of measuring laboriously and slowly with a chain or cord, to know those distances while travelling in a vehicle, through the rolling of its wheels.",
    word: "ὁδομέτρου / ἐκκυλίσεως",
    gloss: "of the road-measurer / through rolling",
    note: "Ὁδός is a road or journey; μέτρον is a measure. Διά with the genitive names the means: through the wheels’ rolling. The instrument observes rotation. Translating it into a road length requires a circumference and reliable contact with the ground.",
  },
  {
    title: "Compare the instruments",
    page: 292,
    ref: "p. 292, lines 22–25",
    greek:
      "οἱ μὲν οὖν πρὸ ἡμῶν ἐξέθεντό τινας μεθόδους, διʼ ὧν τοῦτο γίνεται, ἐξέσται δὲ κρίνειν τό τε ὑπὸ ἡμῶν γραφόμενον ὄργανον καὶ τὰ ὑπὸ τῶν προτέρων.",
    english:
      "Our predecessors have set out some methods by which this is done; it will be possible to judge both the instrument we describe and those of earlier writers.",
    word: "ἐξέσται … κρίνειν",
    gloss: "it will be possible … to judge",
    note: "The impersonal future ἐξέσται takes an infinitive: the reader will be able to compare. This acknowledges earlier descriptions. It does not identify an inventor or establish that this particular machine was built.",
  },
  {
    title: "Eight wheel turns, one shaft turn",
    page: 294,
    ref: "p. 294, lines 8–10",
    greek:
      "συμβήσεται οὖν τοῦ τροχοῦ ὀκτὼ στροφὰς ποιησαμένου τὸ σκυταλωτὸν τύμπανον μίαν ἀποκατάστασιν εἰληφέναι.",
    english:
      "It follows, then, that when the wheel has made eight turns, the drum fitted with pins has completed one revolution.",
    word: "ὀκτὼ στροφάς / μίαν ἀποκατάστασιν",
    gloss: "eight turns / one complete revolution",
    note: "Τοῦ τροχοῦ … ποιησαμένου is a genitive absolute: ‘the wheel having made’. A pin on the vehicle wheel advances the indexed drum once per turn. The eight-to-one result survives even though the initial construction description has a gap on p. 292. Our eight positions illustrate that result rather than silently filling the missing text.",
  },
  {
    title: "The theoretical tooth",
    page: 296,
    ref: "p. 296, lines 6–13",
    greek:
      "ἕκαστος γὰρ κοχλίας ἅπαξ στραφεὶς τοῦ παρακειμένου αὐτῷ τυμπανίου ἕνα ὀδόντα κινήσει· ὥστε τὸν μὲν συμφυῆ τῷ σκυταλωτῷ τυμπανίῳ ἅπαξ στραφέντα, ὀκτὼ μὲν περιμέτρους τοῦ τροχοῦ σημαίνειν, τοῦ δὲ παρακειμένου αὑτῷ τυμπανίου ἕνα ὀδόντα κεκινηκέναι. εἰ τύχοι οὖν, τὸ παρακείμενον τύμπανον, ἐὰν ὀδόντας ἔχῃ τριάκοντα, ἅπαξ στραφὲν ὑπὸ τοῦ κοχλίου στροφὰς δηλώσει τοῦ τροχοῦ σμ.",
    english:
      "For each worm, when turned once, will move one tooth of its adjacent drum. Thus one turn of the worm attached to the pin drum represents eight circumferences of the wheel and moves one tooth of the adjacent drum. Suppose, then, that the adjacent drum has thirty teeth: one revolution driven by the worm will indicate 240 turns of the wheel.",
    word: "κοχλίας / ἕνα ὀδόντα",
    gloss: "a screw or worm / one tooth",
    note: "Κοχλίας can name a spiral shell and here a mechanical screw. Ὀδούς, ‘tooth’, has accusative ὀδόντα. The conditional thirty teeth give 8 × 30 = 240 wheel turns. This is the theoretical relationship that the later trial questions. σμ is the alphabetic numeral 240, not two multiplied variables.",
  },
  {
    title: "Another reduction, a longer journey",
    page: 296,
    ref: "p. 296, lines 17–20",
    greek:
      "ἐὰν ἄρα καὶ τοῦτο τὸ τύμπανον ἔχῃ ὀδόντας λ, ὅπερ εἶναι εἰκὸς καὶ πλείονας γίνεσθαι, ἅπαξ στραφέντος αὐτοῦ, στροφαὶ τοῦ τροχοῦ δηλωθήσονται ζσ·",
    english:
      "If, then, this drum too has thirty teeth—though it is reasonable for there to be even more—one complete revolution of it will indicate 7,200 turns of the wheel.",
    word: "ἐὰν … ἔχῃ / ζσ",
    gloss: "if it has / 7,200",
    note: "Ἐάν with the subjunctive states a condition. A second thirty-to-one reduction multiplies the first 240 by thirty. The following source calculation uses a circumference of ten cubits, giving 72,000 cubits or 180 stadia. We keep these source units and make no conversion to metres.",
  },
  {
    title: "A daily record beyond the dial",
    page: 298,
    ref: "p. 298, lines 1–4",
    greek:
      "δυνατὸν γὰρ καθʼ ἑκάστην ἡμέραν ἐκμετροῦντα τὴν τῆς ἡμέρας ὁδὸν εἰς τὴν ἑξῆς πάλιν ἀρχὴν ποιεῖσθαι τῆς ἑξῆς ὁδοῦ.",
    english:
      "For it is possible, after measuring each day’s journey, to make a fresh start again for the next journey on the following day.",
    word: "καθʼ ἑκάστην ἡμέραν",
    gloss: "on each day",
    note: "Κατά with the accusative has a distributive sense: each day. The preceding sentence asks for a capacity not much greater than a day’s travel. A circular pointer does not preserve the number of its completed circuits. Our outside ledger retains that information explicitly; the drawn instrument does not.",
  },
  {
    title: "Now test it by trial",
    page: 298,
    ref: "p. 298, lines 4–9",
    greek:
      "ἀλλʼ ἐπεὶ ἡ ἑκάστου κοχλίου στροφὴ οὐκ ἀκριβῶς οὐδὲ μεμετρημένως τοὺς παρακειμένους ὀδόντας στρέφει, ἡμεῖς τῇ πείρᾳ ἐπιστρέφομεν τὸν πρῶτον κοχλίαν, ἕως οὗ τὸ παρακείμενον αὐτῷ ὀδοντωτὸν τύμπανον μίαν ἀποκατάστασιν λάβῃ, μετροῦντες ὁσάκις αὐτὸς ἐπιστρέφεται.",
    english:
      "But since a turn of each worm does not turn the adjacent teeth precisely or in a measured amount, we turn the first worm by trial until its adjacent toothed drum has completed one revolution, counting how many times the worm itself turns.",
    word: "τῇ πείρᾳ / ἕως οὗ",
    gloss: "by trial / until",
    note: "Πεῖρα means trial or experience; the dative here expresses the means. Ἕως οὗ sets a stopping condition: one complete output revolution. The passage asks for an observation. It supplies no tooth profile or engineering diagnosis that would explain the discrepancy, so neither does this model.",
  },
  {
    title: "Twenty turns, thirty teeth",
    page: 298,
    ref: "p. 298, lines 9–13",
    greek:
      "καὶ, εἰ τύχοι, εἰληφέτω στροφὰς κ, ἐν ᾧ τὸ παρακείμενον αὑτῷ τύμπανυν μίαν ἀποκατάστασιν λαμβάνει· τοῦτο δὲ εἶχεν ὀδόντας λ· αἱ ἄρα κ στροφαὶ τοῦ σκυταλωτοῦ τυμπάνου λ ὀδόντας ἐκίνησαν τοῦ παρακειμένου τῷ κοχλίᾳ τυμπάνου·",
    english:
      "Suppose it has made twenty turns while the adjacent drum completes one revolution. That drum had thirty teeth. The twenty turns of the pin drum have therefore moved thirty teeth of the drum beside the worm.",
    word: "κ / λ / εἰ τύχοι",
    gloss: "20 / 30 / suppose, for example",
    note: "Κ is twenty and λ thirty in the alphabetic numeral system. Εἰ τύχοι marks a supposed example: the text does not provide a surviving laboratory record. The digital transcription has τύμπανυν; the full printed page reads τύμπανον. We preserve the digital form in this adapted excerpt and flag it here rather than disguise the mismatch.",
  },
  {
    title: "Recover the wheel turns",
    page: 298,
    ref: "p. 298, lines 13–15",
    greek:
      "αἱ δὲ κ στροφαὶ σκυτάλια ἐπιστρέφουσιν ρξ· τοσαῦται δὲ καὶ τοῦ τροχοῦ εἰσὶ στροφαί· γίνονται ἄρα πήχεις αχ.",
    english:
      "The twenty turns bring round 160 pins; that is also the number of wheel turns. The result is therefore 1,600 cubits.",
    word: "ρξ / αχ / πήχεις",
    gloss: "160 / 1,600 / cubits",
    note: "The eight-pin stage is still used: 20 × 8 = 160 wheel turns. At the source’s ten cubits per wheel circumference, that is 1,600 cubits. The common shaft joins the indexed drum and worm; there is no extra eight-to-one reduction between those two parts.",
  },
  {
    title: "Write a new graduation",
    page: 298,
    ref: "p. 298, lines 15–17",
    greek:
      "εἰ δὲ οἱ λ ὀδόντες μηνύουσιν πήχεις αχ, ὁ ἄρα α ὀδοὺς τοῦ εἰρημένου τυμπανίου σημαίνει τῆς ὁδοῦ πήχεις νγ γ΄.",
    english:
      "If the thirty teeth indicate 1,600 cubits, one tooth of that drum therefore represents 53 and one-third cubits of the journey.",
    word: "νγ γ΄ / σημαίνει",
    gloss: "53 and one-third / indicates",
    note: "Νγ is 53; the following marked gamma is a unit fraction, one-third. Here the numeral and fraction are distinguished by their context and the printed marks. Dividing 1,600 by thirty changes the distance assigned to a division. Rewriting that scale does not change the wheel’s position.",
  },
  {
    title: "Fifteen teeth, two stadia",
    page: 298,
    ref: "p. 298, lines 18–20",
    greek:
      "ὅταν ἄρα ἀρξάμενον τὸ ὀδοντωτὸν κινεῖσθαι τύμπανον εὑρεθῇ κεκινημένον ὀδόντας ιε, σημαίνει ὁδὸν πηχῶν ω, τουτέστι στάδια δύο.",
    english:
      "When the toothed drum, starting from its initial position, is found to have moved fifteen teeth, it indicates a journey of 800 cubits, that is, two stadia.",
    word: "ιε / ω / τουτέστι",
    gloss: "15 / 800 / that is",
    note: "Ιε is fifteen, ω eight hundred. Τουτέστι contracts τοῦτο ἐστι, ‘this is’. The source itself equates 800 cubits with two stadia, so this lesson uses 400 cubits per stadion. It does not assume a universal Greek stadion or a fixed modern cubit.",
  },
  {
    title: "Repeat for the other wheels",
    page: 298,
    ref: "p. 298, lines 20–25",
    greek:
      "ἐπιγράψομεν οὖν ἐν μέσῳ τῷ εἰρημένῳ ὀδοντωτῷ τυμπάνῳ πήχεις νγ γ΄· τὰ δὲ αὐτὰ ἐπιλογισάμενοι καὶ ἐπὶ τῶν λοιπῶν ὀδοντωτῶν τυμπανίων ἐπιγράψομεν τοὺς ἀριθμούς· ὥστε ἑκάστου αὐτῶν παραχθέντων τινῶν ὀδόντων ἐπιγνῶναι τὴν ἐξανυσθεῖσαν ὁδόν.",
    english:
      "We shall therefore inscribe 53 and one-third cubits in the middle of that toothed drum. After making the same calculation for the other toothed drums, we shall inscribe their numbers too, so that, when some teeth of each have moved forward, we can know the journey completed.",
    word: "ἐπιγράψομεν / τὰ αὐτά",
    gloss: "we shall inscribe / the same things",
    note: "The first-person plural future describes what the operator will write. Τὰ αὐτά means the same procedure, not permission to copy the first result onto every wheel. The source asks for the other stages to be treated too. Our second stage is left theoretical and is labelled as an assumption.",
  },
  {
    title: "Read it without opening the box",
    page: 300,
    ref: "p. 300, lines 4–11",
    greek:
      "οἱ δὲ ἄξονες αὐτῶν εἰς τὸ ἐκτὸς μέρος ὑπερεχέτωσαν τῶν τοίχων· αἱ δʼ ὑπεροχαὶ τετράγωνοι ἔστωσαν, ὡς ἂν προσειληφυῖαι μοιρογνωμόνια ἐν τετραγώνοις τρήμασιν· ὥστε στρεφομένου τοῦ τυμπάνου σὺν τῷ ἄξονι συστρέφεσθαι καὶ τὸ μοιρογνωμόνιον· οὗ δὴ περιαγόμενον τὸ ἄκρον κύκλον γράψει ἐν τῇ ἑτέρᾳ πλευρᾷ τοῦ αὐτοῦ τοίχου, ὃν διελοῦμεν εἰς τὸ αὐτὸ πλῆθος τῶν ὀδόντων τοῦ ἐντὸς τυμπανίου.",
    english:
      "Let their axles project outside the walls, and let the projecting ends be square, fitted with pointers through square holes. As the drum turns, the pointer turns together with its axle. Its moving tip will trace a circle on the other side of that wall; we shall divide the circle into as many parts as there are teeth on the drum inside.",
    word: "συστρέφεσθαι / μοιρογνωμόνιον",
    gloss: "to turn together / a division pointer",
    note: "Συν-, here συσ-, adds ‘together’ to the verb for turning. The square end prevents relative rotation between shaft and pointer. Μοιρογνωμόνιον refers to the device indicating divisions; our ‘pointer’ is a contextual translation. The source places some dials on side walls and some on the lid; our unfolded view puts them in one plane for comparison.",
  },
  {
    title: "Enlarge the dial, not the wheel",
    page: 300,
    ref: "p. 300, lines 12–17",
    greek:
      "τὸ δὲ μοιρογνωμόνιον μεγέθει ἔστω τηλικοῦτο, ὥστε μείζονα γράφειν κύκλον, πρὸς τὸ τὴν διαίρεσιν τῶν ὀδόντων ἐν μείζοσι διαστήμασιν εἶναι· ἕξει δὲ ὁ γραφόμενος κύκλος τὴν αὐτὴν ἐπιγραφὴν τῷ ἐντὸς τυμπάνῳ· καὶ οὕτως διὰ τῆς ἐκτὸς ἐπιφανείας ἐπιθεωρήσομεν τὸ μῆκος τῆς ἀνυσθείσης ὁδοῦ.",
    english:
      "Let the pointer be large enough to trace a larger circle, so that the tooth divisions lie farther apart. The circle it traces will have the same inscription as the drum inside. In this way we shall inspect the length of the journey from the outside surface.",
    word: "μείζονα / τὴν αὐτὴν ἐπιγραφήν",
    gloss: "a larger one / the same inscription",
    note: "Μείζων is the comparative of μέγας, ‘large’. A longer pointer spreads the marks out without changing the ratio or distance per division. Readability improves; a larger dial alone does not establish greater mechanical accuracy. The engraved scale still needs the preceding calibration.",
  },
];
export const counterSources = Array.from({ length: 12 }, (_, i) => {
  const page = 292 + i;
  const titles: Record<number, string> = {
    292: "Chapter 34 begins; a gap in the construction",
    293: "Facing German: the purpose and missing description",
    294: "The eight-pin input and successive worm shafts",
    295: "Facing German and the edition’s cutaway (figure 114)",
    296: "The theoretical ratios and the daily capacity",
    297: "Facing German: 7,200 turns and 180 stadia",
    298: "The complete trial and the new graduation",
    299: "Facing German: twenty turns and 53 1/3 cubits",
    300: "External pointers, larger circles and alternating walls",
    301: "Facing German: reading outside the box",
    302: "The final lid instruction; chapter 35 begins",
    303: "Facing German: chapter ending and next task",
  };
  return { page, title: titles[page] ?? "Printed source", file: `schone-${page}.jpg` };
});
