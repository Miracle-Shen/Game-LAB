import { clamp, hash, TAU } from "../../../shared/canvas.js";

function hexagon(ctx, x, y, radius) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 6 + i * TAU / 6;
    i ? ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius) : ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
}

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#01050b";
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.5;
  const radius = Math.min(w, h) * 0.33;
  const hits = state.impulses.filter((hit) => state.now - hit.time < 1800);
  const activeHits = hits.length ? hits : [{ x: cx + Math.sin(t * 0.0011) * radius * 0.6, y: cy, time: state.now - (t % 2400) }];
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();
  const cell = Math.max(18, radius * 0.16);
  for (let row = -8; row <= 8; row++) {
    for (let col = -8; col <= 8; col++) {
      const x = cx + col * cell * 1.72 + (row % 2) * cell * 0.86;
      const y = cy + row * cell * 1.48;
      if (Math.hypot(x - cx, y - cy) > radius * 1.08) continue;
      let energy = 0.05;
      activeHits.forEach((hit) => {
        const age = state.now - hit.time;
        const wave = clamp(age / 900, 0, 1) * radius * 1.3;
        energy += Math.max(0, 1 - Math.abs(Math.hypot(x - hit.x, y - hit.y) - wave) / (cell * 1.7));
      });
      ctx.strokeStyle = `rgba(${80 + energy * 120},${156 + energy * 70},255,${0.12 + energy * 0.5})`;
      hexagon(ctx, x, y, cell * 0.92);
      ctx.stroke();
    }
  }
  ctx.restore();
  activeHits.forEach((hit) => {
    const p = clamp((state.now - hit.time) / 1500, 0, 1);
    ctx.strokeStyle = `rgba(129,220,255,${1 - p})`;
    ctx.lineWidth = 1 + (1 - p) * 5 * intensity;
    ctx.beginPath();
    ctx.arc(hit.x, hit.y, 8 + p * radius * 0.9, 0, TAU);
    ctx.stroke();
  });
}
