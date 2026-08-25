import { casualPalette, clamp, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#123650");
  bg.addColorStop(1, "#1a153e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const hits = state.impulses.filter((hit) => state.now - hit.time < 1700);
  const active = hits.length ? hits : [{ x: w * 0.52, y: h * 0.48, time: state.now - (t % 2600) }];
  for (let i = 0; i < 26; i++) {
    const seed = hash(i * 5.13);
    const radius = 10 + seed * Math.min(w, h) * 0.055;
    const x = radius + hash(i * 8.2) * (w - radius * 2) + Math.sin(t * 0.0006 + i) * 8;
    const y = radius + hash(i * 3.7) * (h - radius * 2) + Math.cos(t * 0.0008 + i * 1.8) * 10;
    let pop = 0;
    active.forEach((hit) => {
      const age = state.now - hit.time;
      const wave = clamp(age / 1000, 0, 1) * Math.min(w, h) * 0.7;
      pop = Math.max(pop, Math.max(0, 1 - Math.abs(Math.hypot(x - hit.x, y - hit.y) - wave) / (radius * 1.8)));
    });
    const scale = Math.max(0.12, 1 - pop * 0.84);
    const color = casualPalette[i % casualPalette.length];
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  active.forEach((hit) => {
    const progress = clamp((state.now - hit.time) / 1200, 0, 1);
    ctx.strokeStyle = `rgba(255,255,255,${(1 - progress) * 0.75})`;
    ctx.beginPath();
    ctx.arc(hit.x, hit.y, progress * Math.min(w, h) * 0.58, 0, TAU);
    ctx.stroke();
  });
}
