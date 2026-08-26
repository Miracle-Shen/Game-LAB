import { clamp, fract, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const hasManualTarget = state.custom.lastTarget && state.now - state.custom.lastTarget < 5000;
  const cx = state.pointer.active
    ? state.pointer.x
    : hasManualTarget ? state.custom.targetX : w * (0.5 + Math.sin(t * 0.00055) * 0.14);
  const cy = state.pointer.active
    ? state.pointer.y
    : hasManualTarget ? state.custom.targetY : h * (0.5 + Math.cos(t * 0.0007) * 0.08);
  const age = hasManualTarget ? state.now - state.custom.lastTarget : t % 2600;
  const grow = clamp(age / 360, 0, 1);
  const collapse = age > 1750 ? clamp((age - 1750) / 620, 0, 1) : 0;
  const energy = grow * (1 - collapse);
  const radius = size * (0.05 + energy * 0.2);

  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.82);
  bg.addColorStop(0, "#122238");
  bg.addColorStop(0.38, "#080e1a");
  bg.addColorStop(1, "#03050a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";
  const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2.9);
  aura.addColorStop(0, `rgba(225,250,255,${0.6 * energy})`);
  aura.addColorStop(0.14, `rgba(79,206,255,${0.48 * energy})`);
  aura.addColorStop(0.5, `rgba(104,74,255,${0.18 * energy})`);
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(-radius * 3, -radius * 3, radius * 6, radius * 6);

  for (let ring = 0; ring < 5; ring += 1) {
    const rr = radius * (0.55 + ring * 0.25);
    ctx.save();
    ctx.rotate(t * 0.0012 * (ring % 2 ? -1 : 1) + ring * 0.7);
    ctx.strokeStyle = `rgba(${90 + ring * 24},${170 + ring * 13},255,${energy * (0.74 - ring * 0.08)})`;
    ctx.lineWidth = 1.2 + (4 - ring) * 0.45;
    ctx.setLineDash([rr * 0.52, rr * 0.18, rr * 0.12, rr * 0.23]);
    ctx.lineDashOffset = -t * 0.016 * (ring + 1);
    ctx.beginPath();
    ctx.arc(0, 0, rr, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  ctx.setLineDash([]);

  const particleCount = Math.floor(100 * intensity);
  for (let i = 0; i < particleCount; i += 1) {
    const seed = hash(i * 5.19);
    const life = fract(seed + t * (0.00022 + hash(i * 8.1) * 0.0002));
    const angle = hash(i * 13.4) * TAU + (1 - life) * 4.2;
    const distance = radius * (0.12 + life * (1.2 + hash(i) * 1.8));
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * 0.72;
    ctx.fillStyle = `rgba(${110 + seed * 90},${185 + seed * 60},255,${energy * (1 - life)})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.7 + seed * 2.4, 0, TAU);
    ctx.fill();
  }

  ctx.fillStyle = `rgba(2,7,15,${0.82 + energy * 0.16})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.38, radius * 0.28, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = `rgba(207,240,255,${0.52 + energy * 0.4})`;
  ctx.lineWidth = 1;
  const bracket = Math.max(size * 0.09, radius * 1.45);
  for (let i = 0; i < 4; i += 1) {
    ctx.save();
    ctx.rotate(i * Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(bracket, -size * 0.035);
    ctx.lineTo(bracket, size * 0.035);
    ctx.lineTo(bracket - size * 0.018, size * 0.035);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(185,222,255,0.72)";
  ctx.font = `700 ${Math.max(10, size * 0.031)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(collapse > 0.2 ? "COLLAPSE" : "TARGET LOCK", cx, Math.min(h - 16, cy + bracket + size * 0.09));
}
