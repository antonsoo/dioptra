import license from "../LICENSE?raw";
import { esc } from "./drawing";
import {
  type FlowState,
  flowNumber as f,
  flowArea,
  flowSpeed,
  flowVolume,
  flowWindow,
} from "./flow-model";
export const FLOW_INK = `.fl-svg{display:block;width:100%;height:auto;color:#223e4b}.fl-svg text{font:14px system-ui,sans-serif;fill:#223e4b}.fl-svg .fl-title{font-size:20px;font-weight:600}.fl-svg .fl-large{font-size:29px;font-weight:600}.fl-svg .fl-small{font-size:12px}.fl-svg .fl-a{fill:#466b92}.fl-svg .fl-b{fill:#4a877a}.fl-svg .fl-stroke-a{stroke:#365f89}.fl-svg .fl-stroke-b{stroke:#357568}.fl-svg .fl-outline{stroke:#223e4b;stroke-width:1.5;fill:none}.fl-svg .fl-grid{stroke:#c3d0d0;stroke-width:1}.fl-svg .fl-track{fill:none;stroke-width:3}.fl-svg .fl-label-bg{fill:#f2f6f5}`;
export function receiverDrawing(s: FlowState, stream: "A" | "B", id: string) {
  const volume = flowVolume(s, stream),
    speed = flowSpeed(s, stream),
    cls = stream === "A" ? "fl-a" : "fl-b";
  const width = s.width * 8,
    depth = s.depth * 8,
    length = speed * 4,
    level = (volume / 60) * 160;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fl-svg" viewBox="0 0 360 445" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">Stream ${stream}: ${f(volume)} litres after ${f(s.time)} seconds</title><desc id="${id}-desc">Wetted section ${s.width} by ${s.depth} centimetres, area ${flowArea(s)} square centimetres. Current mean speed ${speed} centimetres per second. The receiver has the same sixty-litre scale as the other stream.</desc>
<text x="20" y="27" class="fl-title">Stream ${stream}</text><text x="340" y="27" text-anchor="end">${speed} cm/s now</text>
<text x="20" y="58" class="fl-small">WETTED END VIEW</text><text x="200" y="58" class="fl-small">ONE-SECOND SIDE VIEW</text>
<rect x="20" y="70" width="${width}" height="${depth}" class="${cls}" opacity=".75" data-section-area="${flowArea(s)}"/>
<rect x="20" y="70" width="${width}" height="${depth}" class="fl-outline"/>
<rect x="200" y="70" width="${length}" height="${depth / 2}" class="${cls}" opacity=".75"/>
<path d="M200 128h${length}m-5 -4l5 4 -5 4" class="fl-outline"/>
<text x="20" y="151">${s.width} × ${s.depth} cm</text><text x="200" y="151">${speed} cm travelled</text>
<text x="20" y="176" class="fl-small">${flowArea(s)} cm² × ${speed} cm/s = ${f((flowArea(s) * speed) / 1000)} L/s</text>
<text x="20" y="210" class="fl-small">COMPLETE COLLECTION · SAME 60 L SCALE</text>
${[0, 15, 30, 45, 60].map((v) => `<path d="M60 ${400 - (v / 60) * 160}h240" class="fl-grid"/><text x="310" y="${405 - (v / 60) * 160}" class="fl-small">${v} L</text>`).join("")}
<rect x="60" y="${400 - level}" width="240" height="${level}" class="${cls}" opacity=".7" data-collected-litres="${volume}"/>
<path d="M60 234v166h240V234" class="fl-outline"/>
<rect x="95" y="285" width="170" height="52" rx="2" class="fl-label-bg" opacity=".93"/><text x="180" y="320" text-anchor="middle" class="fl-large">${f(volume)} L</text>
<text x="180" y="430" text-anchor="middle">at ${f(s.time)} s of the recorded 20 s run</text></svg>`;
}
export function flowPlot(s: FlowState, id: string) {
  const x = (t: number) => 50 + t * 15,
    y = (v: number) => 240 - v * 3;
  const w = flowWindow(s),
    b = w.streams[1];
  if (!b) throw new Error("Missing B");
  const trace = (stream: "A" | "B") =>
    [0, 10, 20].map((t, i) => `${i ? "L" : "M"}${x(t)},${y(flowVolume(s, stream, t))}`).join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fl-svg" viewBox="0 0 400 300" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">The full collection record</title><desc id="${id}-desc">Litres against modern seconds. The highlighted ${w.start} to ${w.end} second interval gives stream B an average ${f(b.average)} litres per second. Extending that rate to twenty seconds predicts ${f(b.extrapolated)} litres; the actual total is ${f(b.actual)} litres.</desc>
<rect x="${x(w.start)}" y="60" width="${(w.end - w.start) * 15}" height="180" fill="#e0e7d1"/>
${[0, 15, 30, 45, 60].map((v) => `<path d="M50 ${y(v)}H350" class="fl-grid"/><text x="40" y="${y(v) + 5}" text-anchor="end">${v}</text>`).join("")}
${[0, 5, 10, 15, 20].map((t) => `<text x="${x(t)}" y="263" text-anchor="middle">${t}</text>`).join("")}
<path d="M50 55v185h305" class="fl-outline"/>
<text x="15" y="35">Litres</text><text x="200" y="290" text-anchor="middle">Modern seconds</text>
<path d="M50 240L350 ${y(b.extrapolated)}" stroke="#965d32" stroke-width="2" stroke-dasharray="7 5" fill="none" data-projected="${b.extrapolated}"/>
<path d="${trace("A")}" class="fl-track fl-stroke-a" data-stream="A"/><path d="${trace("B")}" class="fl-track fl-stroke-b" data-stream="B"/>
<path d="M${x(s.time)} 60v180" stroke="#223e4b" stroke-dasharray="2 4"/>
${(["A", "B"] as const).map((stream) => `<circle cx="${x(s.time)}" cy="${y(flowVolume(s, stream))}" r="4" class="${stream === "A" ? "fl-a" : "fl-b"}"/>`).join("")}</svg>`;
}
export function flowSvg(s: FlowState) {
  const a = receiverDrawing(s, "A", "export-a"),
    b = receiverDrawing(s, "B", "export-b");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fl-svg" viewBox="0 0 760 515" role="img" aria-labelledby="flow-title"><title id="flow-title">Equal sections, measured supplies · Dioptra 31</title><metadata>${esc(`${license}\nModern ideal experiment, not an ancient measurement.`)}</metadata><style>${FLOW_INK}</style><rect width="760" height="515" fill="#f2f6f5"/><text x="20" y="30" font-family="sans-serif" font-size="20" fill="#223e4b">Equal sections. Different supplies.</text><svg x="10" y="45" width="360" height="445">${a.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg><svg x="390" y="45" width="360" height="445">${b.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg><text x="20" y="508" font-family="sans-serif" font-size="12" fill="#223e4b">Chosen cm, seconds and litres. Complete collection; ${s.variable ? "B changes to A’s speed after 10 s" : "constant speeds"}.</text></svg>`;
}
export function flowCsv(s: FlowState) {
  const rows: (string | number)[][] = [
    [
      "record",
      "stream",
      "time_s",
      "area_cm2",
      "width_cm",
      "depth_cm",
      "mean_speed_cm_s",
      "cumulative_L",
      "window_start_s",
      "window_end_s",
      "window_volume_L",
      "window_average_L_s",
      "projected_20s_L",
      "actual_20s_L",
    ],
  ];
  for (let t = 0; t <= 20; t++)
    for (const stream of ["A", "B"] as const)
      rows.push([
        "sample",
        stream,
        t,
        flowArea(s),
        s.width,
        s.depth,
        flowSpeed(s, stream, t),
        flowVolume(s, stream, t),
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
  const w = flowWindow(s);
  for (const r of w.streams)
    rows.push([
      "window",
      r.stream,
      "",
      flowArea(s),
      s.width,
      s.depth,
      "",
      "",
      w.start,
      w.end,
      r.volume,
      r.average,
      r.extrapolated,
      r.actual,
    ]);
  return `${rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\r\n")}\r\n`;
}
