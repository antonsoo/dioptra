import { type CounterState, counter, counterFraction, counterNumber as f } from "./counter-model";

const point = (angle: number, radius: number) => {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
};
function dial(x: number, y: number, divisions: number, angle: number, kind: string) {
  const ticks = Array.from({ length: divisions }, (_, i) => {
    const major = divisions === 8 || i % 5 === 0;
    const a = point((i * 360) / divisions, major ? 76 : 81);
    const b = point((i * 360) / divisions, 88);
    const t = point((i * 360) / divisions, 63);
    return `<path d="M${a.x} ${a.y}L${b.x} ${b.y}" class="ct-mark"/>${major ? `<text x="${t.x}" y="${t.y + 5}" text-anchor="middle">${i}</text>` : ""}`;
  }).join("");
  return `<g transform="translate(${x} ${y})"><circle r="94" class="ct-ring"/><circle r="49" class="ct-inner"/>${ticks}<path d="M-5 -104L0 -97 5 -104Z" class="ct-origin"/><g data-dial="${kind}" data-angle="${angle}" transform="rotate(${angle})"><path d="M0 17V-79" class="ct-needle ${kind === "second" ? "ct-coarse" : kind === "input" ? "ct-input" : ""}"/></g><circle r="5" class="ct-hub"/></g>`;
}
export function counterDrawing(s: CounterState, narrow = false, id = "counter") {
  const m = counter(s),
    width = narrow ? 340 : 900,
    height = narrow ? 1000 : 370;
  const positions = narrow
    ? [
        [170, 165],
        [170, 490],
        [170, 815],
      ]
    : [
        [150, 175],
        [450, 175],
        [750, 175],
      ];
  const titles = ["Eight-pin input", "First output · 30 divisions", "Second output · 30 divisions"];
  const captions = [
    "01 / ONE STEP PER WHEEL TURN",
    "02 / FIRST WORM REDUCTION",
    "03 / SECOND WORM REDUCTION",
  ];
  const bottom = [
    `${f(s.turns / 8)} shaft turns`,
    `${f(m.firstTick)} / 30 divisions`,
    `${f(m.secondTick)} / 30 divisions`,
  ];
  const details = [
    "The drum and first worm share a shaft.",
    `One division = ${counterFraction(s.calibrated ? 8 * s.trial : 240, 3)} cubits`,
    "This reduction remains an assumed 30:1.",
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ct-svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${s.turns} wheel turns through an eight-pin input and two reduction dials</title><desc id="${id}-desc">First pointer ${f(m.firstTick)} divisions; second pointer ${f(m.secondTick)} divisions. The first ${m.coarse} whole divisions of the second pointer count completed first-dial revolutions. ${m.wraps} complete instrument circuits are absent from the dial positions. Unfolded ratio diagram, not meshing tooth geometry.</desc>
${positions
  .map((p, i) => {
    const x = p[0] ?? 0,
      y = p[1] ?? 0;
    return `<text x="${x}" y="${y - 143}" class="ct-caption" text-anchor="middle">${captions[i]}</text><text x="${x}" y="${y - 119}" class="ct-dial-title" text-anchor="middle">${titles[i]}</text>${dial(x, y, i === 0 ? 8 : 30, i === 0 ? m.peg * 45 : i === 1 ? m.firstAngle : m.secondAngle, i === 0 ? "input" : i === 1 ? "first" : "second")}${
      i === 0
        ? Array.from({ length: 8 }, (_, k) => {
            const t = point(k * 45, 35);
            return `<circle cx="${x + t.x}" cy="${y + t.y}" r="5" class="ct-pin${k === m.peg ? " ct-pin-active" : ""}"/>`;
          }).join("")
        : ""
    }<text x="${x}" y="${y + 130}" class="ct-amount" text-anchor="middle">${bottom[i]}</text><text x="${x}" y="${y + 157}" text-anchor="middle" class="ct-caption">${details[i]}</text>`;
  })
  .join("")}
${narrow ? [315, 640].map((y) => `<path d="M170 ${y + 8}v22m-5 -6l5 6 5 -6" class="ct-link"/>`).join("") : [280, 580].map((x) => `<path d="M${x} 175h40m-6 -5l6 5 -6 5" class="ct-link"/>`).join("")}
</svg>`;
}
export function probeDrawing(s: CounterState, id = "probe") {
  const m = counter(s);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ct-svg" viewBox="0 0 340 315" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">Calibration trial: ${s.probe} shaft turns</title><desc id="${id}-desc">The first output has traversed ${f(m.probeTick)} of thirty divisions. Stop at one complete revolution. The last position is the same as the starting position, so the separate turn count matters.</desc>${dial(170, 150, 30, m.probeAngle, "probe")}<circle cx="170" cy="150" r="100" class="ct-progress" transform="rotate(-90 170 150)" stroke-dasharray="${(s.probe / s.trial) * 2 * Math.PI * 100} ${2 * Math.PI * 100}"/><text x="170" y="284" text-anchor="middle" class="ct-amount">${f(m.probeTick)} / 30 divisions</text><text x="170" y="308" text-anchor="middle" class="ct-caption">TRAVERSED SINCE THE START</text></svg>`;
}
