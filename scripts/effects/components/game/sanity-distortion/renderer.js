import { clamp, hash, TAU } from "../../../shared/canvas.js";

function hallway(ctx, w, h, offset, alpha) {
  ctx.save();
  ctx.translate(offset, 0);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "rgba(196,211,205,0.34)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(w * 0.42, h * 0.45); ctx.lineTo(w * 0.42, h * 0.64); ctx.lineTo(0, h);
  ctx.moveTo(w, 0); ctx.lineTo(w * 0.58, h * 0.45); ctx.lineTo(w * 0.58, h * 0.64); ctx.lineTo(w, h);
  ctx.moveTo(0, h); ctx.lineTo(w * 0.42, h * 0.64); ctx.lineTo(w * 0.58, h * 0.64); ctx.lineTo(w, h);
  ctx.stroke();
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const sanity = state.custom.sanity ?? 1;
  const distortion = clamp(1 - sanity, 0, 1);
  const pulseAge = state.custom.lastPulse ? state.now - state.custom.lastPulse : 9999;
  const pulse = clamp(1 - pulseAge / 900, 0, 1);
  const sway = Math.sin(t * 0.0021) * size * 0.012 * distortion;

  ctx.fillStyle = "#070d10";
  ctx.fillRect(0, 0, w, h);
  hallway(ctx, w, h, sway, 1);
  if (distortion > 0.1) {
    hallway(ctx, w, h, sway + size * 0.012 * distortion, distortion * 0.55);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(48,207,255,${distortion * 0.22})`;
    ctx.translate(-size * 0.012 * distortion, 0); hallway(ctx, w, h, 0, 1); ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(255,48,94,${distortion * 0.2})`;
    ctx.translate(size * 0.012 * distortion, 0); hallway(ctx, w, h, 0, 1); ctx.restore();
  }

  const lamp = 0.7 + Math.sin(t * 0.022) * 0.12 - distortion * hash(Math.floor(t / 70)) * 0.55;
  const light = ctx.createRadialGradient(w * 0.5, h * 0.38, 0, w * 0.5, h * 0.38, size * 0.34);
  light.addColorStop(0, `rgba(232,221,172,${lamp})`);
  light.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);

  const ghostCount = Math.floor(2 + distortion * 7);
  for (let i = 0; i < ghostCount; i += 1) {
    const x = w * (0.2 + hash(i * 9.3) * 0.6) + Math.sin(t * 0.001 + i) * size * 0.03;
    const y = h * (0.42 + hash(i * 3.1) * 0.22);
    ctx.fillStyle = `rgba(210,228,220,${0.03 + distortion * 0.14})`;
    ctx.beginPath(); ctx.ellipse(x, y, size * 0.035, size * 0.11, 0, 0, TAU); ctx.fill();
  }

  for (let i = 0; i < Math.floor(18 * distortion); i += 1) {
    const y = hash(i * 4.5 + Math.floor(t / 100)) * h;
    ctx.fillStyle = `rgba(220,245,239,${0.03 + distortion * 0.08})`;
    ctx.fillRect(0, y, w, 1 + hash(i) * 3);
  }

  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, size * 0.1, w * 0.5, h * 0.5, size * 0.72);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, `rgba(0,0,0,${0.65 + distortion * 0.27})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  if (pulse > 0) {
    ctx.fillStyle = `rgba(152,12,45,${pulse * 0.22})`;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.fillRect(w * 0.08, h * 0.86, w * 0.84, size * 0.035);
  ctx.fillStyle = sanity > 0.5 ? "#b9e5cf" : "#ff6075";
  ctx.fillRect(w * 0.08, h * 0.86, w * 0.84 * sanity, size * 0.035);
  ctx.font = `700 ${Math.max(10, size * 0.027)}px system-ui, sans-serif`;
  ctx.fillText("SANITY", w * 0.08, h * 0.84);
}
