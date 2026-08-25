import { casualPalette, clamp, hash, lerp, TAU } from "../../../shared/canvas.js";

function orb(ctx, x, y, radius, color, face) {
  const glow = ctx.createRadialGradient(x - radius * 0.28, y - radius * 0.3, 0, x, y, radius * 1.7);
  glow.addColorStop(0, "rgba(255,255,255,0.95)");
  glow.addColorStop(0.2, color);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius * 1.8, y - radius * 1.8, radius * 3.6, radius * 3.6);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
  if (face) {
    ctx.fillStyle = "rgba(10,15,35,0.72)";
    ctx.beginPath();
    ctx.arc(x - radius * 0.3, y, radius * 0.09, 0, TAU);
    ctx.arc(x + radius * 0.3, y, radius * 0.09, 0, TAU);
    ctx.fill();
  }
}

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#10142b";
  ctx.fillRect(0, 0, w, h);
  const level = state.custom.mergeLevel || 1;
  const progress = clamp((state.now - (state.custom.lastAction || state.now - (t % 2600))) / 800, 0, 1);
  const cx = state.pointer.active ? lerp(w / 2, state.pointer.x, 0.18) : w / 2;
  const cy = h * 0.5;
  const min = Math.min(w, h);
  const side = min * (0.24 - progress * 0.2);
  const radius = min * (0.095 + level * 0.006);
  orb(ctx, cx - side, cy, radius, "#55d7ff", false);
  orb(ctx, cx + side, cy, radius, "#ff6ec7", false);
  if (progress > 0.45) orb(ctx, cx, cy, radius, level % 2 ? "#ffd65c" : "#8dffb7", true);
  for (let i = 0; i < 38 * intensity; i++) {
    const angle = hash(i * 5.7) * TAU + t * 0.0005;
    const rr = min * (0.14 + hash(i) * 0.3);
    ctx.fillStyle = casualPalette[i % casualPalette.length];
    ctx.fillRect(cx + Math.cos(angle) * rr, cy + Math.sin(angle) * rr, 3, 3);
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(240,240,250,0.78)";
  ctx.font = `700 ${Math.max(11, min * 0.03)}px Arial`;
  ctx.fillText(`EVOLUTION · LV.${level}`, cx, cy - min * 0.29);
}
