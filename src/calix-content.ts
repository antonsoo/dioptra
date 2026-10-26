export const FRONTINUS_SOURCE = "https://archive.org/details/iuliifrontinide00bcgoog";
export const FRONTINUS_LATIN = "https://www.thelatinlibrary.com/frontinus/aqua1.shtml";
export const FRONTINUS_ENGLISH =
  "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Frontinus/De_Aquis/Bennett/1*.html";
export const CALIX_PHYSICS =
  "https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation";
export const CALIX_LIMITS =
  "This is a modern ideal-orifice ratio experiment prompted by Frontinus’s distinction between gauge, opening and delivery. It is not a reconstruction of a Roman calix or a prediction for a real supply pipe. Both reservoirs maintain constant head, the outlet coefficients are equal, approach speed and pipe losses are omitted, and every time and head unit is chosen for the comparison. No source digit is converted to metres and no quinaria is converted to litres per second. The printed ancient capacities, the geometric opening ratios and the model’s relative flow remain different quantities.";
export const calixPages = [
  {
    page: "014",
    pdf: 35,
    leaf: 34,
    title: "Names, diameters and areas",
    file: "buecheler-014.jpg",
  },
  {
    page: "015",
    pdf: 36,
    leaf: 35,
    title: "Two ways to enlarge a gauge",
    file: "buecheler-015.jpg",
  },
  {
    page: "017",
    pdf: 38,
    leaf: 37,
    title: "Pressure and intake position",
    file: "buecheler-017.jpg",
  },
  {
    page: "018",
    pdf: 39,
    leaf: 38,
    title: "The bronze calix and the table",
    file: "buecheler-018.jpg",
  },
  {
    page: "019",
    pdf: 40,
    leaf: 39,
    title: "The ten-pipe and edited fractions",
    file: "buecheler-019.jpg",
  },
  {
    page: "title",
    pdf: 6,
    leaf: 5,
    title: "Bücheler’s 1858 title page",
    file: "buecheler-title.jpg",
  },
] as const;
export const calixPassages = [
  {
    title: "A probable name",
    ref: "I.25",
    page: "014",
    band: [0.334, 0.037],
    latin: "maxime probabile est, quinariam dictam a diametro quinque quadrantum",
    english:
      "It is most probable that the quinaria takes its name from a diameter of five quarters.",
    note: "Five quarters of a digit, not five quinariae. Frontinus presents this as the most probable of competing explanations. He has just questioned the derivation from a five-digit-wide lead sheet. The diagram follows his stated diameter rule, rather than claiming a measured surviving pipe.",
    words: [
      {
        word: "maxime probabile",
        gloss: "most probable",
        note: "An explicit judgement about the name’s origin. The author does not present a directly observed invention.",
      },
      {
        word: "quinque quadrantum",
        gloss: "of five quarters",
        note: "Quadrantum is a genitive plural. The diameter is five quarter-digits: 5/4 of one digit.",
      },
    ],
  },
  {
    title: "Six names a diameter",
    ref: "I.25",
    page: "014",
    band: [0.373, 0.056],
    latin:
      "diametro per singulos adiectione singulorum quadrantum crescente: ut in senaria, quae sexs quadrantes in diametro habet",
    english:
      "The diameter increases from one size to the next by adding a quarter each time: for example, the senaria has six quarters in its diameter.",
    note: "Increasing the diameter from five quarters to six quarters multiplies it by 6/5. In a circular opening the area multiplies by (6/5)² = 36/25. That geometric result is distinct from an absolute flow rate and from the source’s edited capacity table.",
    words: [
      {
        word: "diametro … crescente",
        gloss: "with the diameter increasing",
        note: "An ablative construction: the increasing diameter describes how this named series is generated.",
      },
      {
        word: "senaria",
        gloss: "the six-pipe",
        note: "The printed sexs is a spelling of sex, six. Six counts quarter-digits across this opening. It does not mean that the opening equals six quinaria openings.",
      },
    ],
  },
  {
    title: "Three descriptions of one opening",
    ref: "I.26",
    page: "014",
    band: [0.435, 0.053],
    latin:
      "omnis autem modulus colligitur aut diametro aut perimetro aut areae mensura, ex quibus et capacitas adparet",
    english:
      "Each gauge is determined by its diameter, its circumference, or its area measure; from these its capacity is also apparent.",
    note: "For a circle, any one of those geometric measures determines the other two. This sentence does not supply a universal modern volume-per-time conversion. The later pressure passage is retained beside it.",
    words: [
      {
        word: "modulus",
        gloss: "gauge, standard measure",
        note: "The word refers here to a size or standard used in distribution, rather than a modern software module.",
      },
      {
        word: "areae mensura",
        gloss: "measure of the area",
        note: "Areae is a genitive. Area measures the two-dimensional opening; a collected volume also needs a length dimension, supplied through water moving over time.",
      },
    ],
  },
  {
    title: "Several quinariae in one opening",
    ref: "I.27",
    page: "015",
    band: [0.141, 0.055],
    latin:
      "est unum, cum ipsa multiplicatur, id est eodem lumine plures quinariae includuntur, in quibus secundum adiectionem quinariarum amplitudo luminis crescit",
    english:
      "One method multiplies the quinaria itself: several quinariae are included in the same opening, whose size increases as quinariae are added.",
    note: "The argument compares total opening, not how many separate circles can be packed inside another circle. Four quinaria-sized areas equal the area of a circle with twice the diameter. Four actual small circles cannot simply be fitted inside that larger circle without gaps or overlap.",
    words: [
      {
        word: "lumine",
        gloss: "in the clear opening",
        note: "Lumen can mean light. In this pipe context it identifies the open passage through which water can pass.",
      },
      {
        word: "amplitudo luminis",
        gloss: "size of the opening",
        note: "This grows by adding opening areas. The diameter grows as the square root of that count, not in direct proportion to it.",
      },
    ],
  },
  {
    title: "A different way to increase",
    ref: "I.28",
    page: "015",
    band: [0.298, 0.056],
    latin:
      "ut puta quinaria, cum adiectus est ei ad diametrum quadrans, senariam facit. nec iam in solidum capacitatem ampliat",
    english:
      "For example, adding a quarter to the quinaria’s diameter makes a senaria. This does not increase its capacity by a whole unit.",
    note: "The name changes by one; the geometric opening does not increase by one whole quinaria-sized area. The source also uses a different area-based naming scheme above the twenty-pipe. This workshop limits its adjustable diameter to five through ten quarter-digits, so that it does not mix those schemes.",
    words: [
      {
        word: "ad diametrum",
        gloss: "to the diameter",
        note: "Ad with the accusative identifies the dimension receiving the quarter. It is not an addition of a quarter to the area.",
      },
      {
        word: "in solidum",
        gloss: "by a whole unit",
        note: "The following source gives a fractional capacity. This workshop derives a circular area ratio without silently replacing the edition’s fractional table.",
      },
    ],
  },
  {
    title: "A higher incoming supply",
    ref: "I.35",
    page: "017",
    band: [0.412, 0.057],
    latin:
      "Meminerimus omnem aquam, quotiens ex altiore loco uenit et intra breue spatium in castellum cadit, non tantum respondere modulo suo set etiam exuberare",
    english:
      "Let us remember that water arriving from a higher place and falling into a distribution tank over a short distance can more than answer to its gauge.",
    note: "The author explicitly brings height and the supply route into the account. Our model holds two reservoir surfaces constant and changes one opening’s depth. That supplies a controlled modern comparison; it does not compute Frontinus’s complete incoming pipe or tank arrangement.",
    words: [
      {
        word: "Meminerimus",
        gloss: "let us remember",
        note: "A first-person plural form of memini used here as an instruction to keep this qualification in view.",
      },
      {
        word: "castellum",
        gloss: "distribution tank",
        note: "In this water-supply context the word identifies a reservoir or distribution structure, not a military castle.",
      },
    ],
  },
  {
    title: "Less pressure, a longer route",
    ref: "I.35",
    page: "017",
    band: [0.452, 0.055],
    latin:
      "quotiens uero ex humiliore, id est minore pressura, longius ducitur, segnitia ductus modum quoque deperdere",
    english:
      "When it is conducted farther from a lower place—that is, with less pressure—the sluggish conveyance also loses some of its amount.",
    note: "Minore pressura is part of the ancient wording. The ideal-orifice calculation here omits pipe friction and length; it models only the separate effect of head under common assumptions. Frontinus’s warning must not be turned into a claim that geometry alone fixes delivery.",
    words: [
      {
        word: "minore pressura",
        gloss: "with less pressure",
        note: "Both words are ablative singular. Minor is comparative: less, relative to a more strongly driven supply.",
      },
      {
        word: "longius ducitur",
        gloss: "it is conducted farther",
        note: "The passive ducitur describes conveyance. A real longer pipe introduces effects absent from the ideal-orifice model.",
      },
    ],
  },
  {
    title: "The calix is a bronze fitting",
    ref: "I.36, continued",
    page: "018",
    band: [0.118, 0.057],
    latin:
      "est autem calix modulus aeneus, qui riuo uel castello induitur; huic fistulae adplicantur. longitudo eius habere debet digitos non minus duodecim",
    english:
      "The calix is a bronze gauge inserted into the conduit or distribution tank; pipes are attached to it. Its length must be at least twelve digits.",
    note: "The source’s calix has a stated length and attached pipes. Our mathematical openings have no modeled tube length. A thin ideal orifice is therefore a counterexample showing why more conditions are needed, rather than an archaeological or hydraulic reconstruction of this fitting.",
    words: [
      {
        word: "modulus aeneus",
        gloss: "a bronze gauge",
        note: "Aeneus names the material. The source goes on to connect bronze’s resistance to bending with keeping a controlled opening.",
      },
      {
        word: "non minus duodecim",
        gloss: "not less than twelve",
        note: "This is a minimum length in source digits. It is not the diameter of a twelve-pipe and supplies no conversion of a quinaria into litres per second.",
      },
    ],
  },
  {
    title: "The ten-pipe holds four",
    ref: "I.43",
    page: "019",
    band: [0.202, 0.037],
    latin: "Fistula denaria: diametri digitos duos et semis … capit quinarias IIII.",
    english: "The ten-pipe: a diameter of two and a half digits … it holds four quinariae.",
    note: "The omitted words give its circumference. The source’s ten-pipe doubles the diameter of the five-quarter quinaria and reports four quinariae. The modern circle calculation agrees for this example. This agreement does not settle all damaged or edited fractions elsewhere in the table; the complete page and apparatus remain available.",
    words: [
      {
        word: "duos et semis",
        gloss: "two and a half",
        note: "Two and a half digits are ten quarter-digits. Doubling a circular diameter quadruples the opening’s area.",
      },
      {
        word: "capit quinarias IIII",
        gloss: "it holds four quinariae",
        note: "IIII writes four. Keep the ancient reported capacity distinct from the experiment’s geometric area ratio and chosen relative-flow unit.",
      },
    ],
  },
] as const;
