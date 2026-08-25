import { hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#02070b";
  ctx.fillRect(0, 0, w, h);
  const scanX = state.pointer.active ? state.pointer.x : w * (0.5 + Math.sin(t * 0.00055) * 0.34);
  const glitch = state.impulses.reduce((sum, hit) => sum + Math.max(0, 1 - (state.now - hit.time) / 650), 0);
  const cx = w * 0.5;
  const cy = h * 0.51;
  const size = Math.min(w, h) * 0.27;
  const beam = ctx.createLinearGradient(scanX - 90, 0, scanX + 90, 0);
  beam.addColorStop(0, "rgba(0,225,255,0)");
  beam.addColorStop(0.5, "rgba(141,255,250,0.42)");
  beam.addColorStop(1, "rgba(0,225,255,0)");
  ctx.fillStyle = beam;
  ctx.fillRect(scanX - 90, 0, 180, h);
  ctx.save();
  ctx.translate((Math.sin(t * 0.017) * 5 + hash(Math.floor(t / 90)) * 12) * glitch, 0);
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(t * 0.00045) * 0.08);
  [1, 0.72, 0.42].forEach((scale, layer) => {
    ctx.strokeStyle = layer ? `rgba(65,179,229,${0.34 - layer * 0.06})` : "rgba(124,246,255,0.82)";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = -Math.PI / 2 + i * TAU / 8;
      const radius = size * scale * (i % 2 ? 0.82 : 1);
      i ? ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72) : ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72);
    }
    ctx.closePath();
    ctx.stroke();
  });
  ctx.restore();
  ctx.strokeStyle = "rgba(174,255,255,0.82)";
  ctx.beginPath();
  ctx.moveTo(scanX, 0);
  ctx.lineTo(scanX, h);
  ctx.stroke();
}
