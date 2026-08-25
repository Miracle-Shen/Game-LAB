import { fract, hash, TAU } from "../../../shared/canvas.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function drawWave(ctx, w, y, amplitude, phase, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  for (let x = -8; x <= w + 8; x += 8) {
    const envelope = 0.35 + Math.sin((x / w) * Math.PI) * 0.65;
    const yy = y
      + Math.sin(x * 0.012 + phase) * amplitude * envelope
      + Math.sin(x * 0.027 - phase * 0.7) * amplitude * 0.28;
    x > -8 ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
  }
  ctx.stroke();
}

function drawMoon(ctx, cx, cy, radius, progress, energy, pitch) {
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.4);
  glow.addColorStop(0, `rgba(255,238,181,${0.2 + energy * 0.26})`);
  glow.addColorStop(0.38, `rgba(117,220,255,${0.08 + progress * 0.12})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - radius * 2.4, cy - radius * 2.4, radius * 4.8, radius * 4.8);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = `rgba(255,246,207,${0.36 + progress * 0.58})`;
  ctx.shadowBlur = 22 + energy * 42;
  ctx.shadowColor = "rgba(255,221,140,.78)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius * (0.66 + progress * 0.34), 0, TAU);
  ctx.fill();
  ctx.restore();

  const orbitRadius = radius * (1.28 + pitch * 0.2);
  ctx.strokeStyle = `rgba(119,225,255,${0.12 + energy * 0.28})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx, cy, orbitRadius, orbitRadius * 0.32, -0.18, 0, TAU);
  ctx.stroke();
}

function drawSparkles(ctx, w, h, t, amount, energy, progress) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < amount; i += 1) {
    const seed = hash(i * 8.731);
    const life = fract(seed + t * (0.000035 + hash(i * 2.1) * 0.00008));
    const x = hash(i * 4.19) * w + Math.sin(t * 0.0005 + i) * w * 0.025;
    const y = h * (0.18 + hash(i * 5.77) * 0.68) - life * h * (0.08 + energy * 0.18);
    const radius = 0.6 + seed * (1.4 + energy * 2.8);
    const alpha = (1 - life) * (0.14 + energy * 0.7) * (0.45 + progress * 0.55);
    ctx.fillStyle = i % 4 === 0
      ? `rgba(255,202,118,${alpha})`
      : i % 3 === 0
        ? `rgba(255,105,173,${alpha})`
        : `rgba(100,227,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const live = state?.custom || {};
  const isPreview = !live.detailActive;
  const cue = isPreview ? Math.floor(t / 3600) % 4 : clamp(live.activeCue || 0, 0, 3);
  const progress = isPreview ? (t % 3600) / 3600 : clamp(live.cueProgress || 0, 0, 1);
  const level = isPreview ? 0.34 + Math.sin(t * 0.004) * 0.12 : clamp(live.level || 0, 0, 1);
  const pitch = isPreview ? 0.5 + Math.sin(t * 0.0011) * 0.32 : clamp(((live.pitch || 64) - 48) / 36, 0, 1);
  const burst = clamp(live.burst || 0, 0, 1);
  const energy = clamp((0.15 + level * 1.55 + burst * 0.75) * intensity, 0.1, 2.1);
  const cx = w * 0.5;
  const cy = h * 0.47;

  ctx.fillStyle = "#020609";
  ctx.fillRect(0, 0, w, h);

  const backdrop = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.78);
  const palettes = [[14, 65, 78], [52, 47, 78], [67, 29, 61], [30, 55, 72]];
  const [red, green, blue] = palettes[cue];
  backdrop.addColorStop(0, `rgba(${red + Math.round(energy * 22)},${green + Math.round(pitch * 28)},${blue + Math.round(progress * 35)},.9)`);
  backdrop.addColorStop(0.48, `rgba(${Math.round(red * 0.35)},${Math.round(green * 0.32)},${Math.round(blue * 0.35)},.82)`);
  backdrop.addColorStop(1, "rgba(0,1,3,1)");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, w, h);

  const horizon = h * (0.58 + (pitch - 0.5) * 0.08);
  if (cue === 0 || cue === 3) {
    for (let i = 0; i < 12; i += 1) {
      drawWave(
        ctx,
        w,
        horizon + i * h * 0.025,
        (3 + i * 0.6) * (0.55 + energy),
        t * (0.0012 + i * 0.000045) + i * 0.7,
        `rgba(${cue === 0 ? "76,218,235" : "255,170,118"},${0.05 + (12 - i) * 0.012 + level * 0.18})`,
        i === 0 ? 1.8 : 1,
      );
    }
  }

  if (cue === 1 || cue === 3) {
    const moonX = cue === 1 ? cx : w * 0.72;
    const moonY = cue === 1 ? h * 0.29 : h * 0.31;
    drawMoon(ctx, moonX, moonY, Math.min(w, h) * (0.085 + progress * 0.035), progress, energy, pitch);
  }

  if (cue === 2) {
    const beam = ctx.createLinearGradient(0, h, w, 0);
    beam.addColorStop(0, "rgba(255,78,158,0)");
    beam.addColorStop(0.5, `rgba(255,151,179,${0.04 + energy * 0.08})`);
    beam.addColorStop(1, "rgba(99,227,255,0)");
    ctx.fillStyle = beam;
    ctx.fillRect(0, 0, w, h);
  }

  drawSparkles(ctx, w, h, t, Math.floor((54 + progress * 105) * intensity), energy, progress);

  if (burst > 0.01) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 30; i += 1) {
      const angle = hash(i * 6.13) * TAU;
      const distance = (1 - burst) * Math.min(w, h) * (0.12 + hash(i) * 0.34);
      ctx.fillStyle = i % 2 ? `rgba(255,205,127,${burst * 0.8})` : `rgba(102,235,255,${burst * 0.8})`;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * distance, Math.sin(angle) * distance, 1 + burst * 2, 0, TAU);
      ctx.fill();
    }
    ctx.strokeStyle = `rgba(255,245,215,${burst * 0.66})`;
    ctx.lineWidth = 1 + burst * 4;
    ctx.beginPath();
    ctx.arc(0, 0, (1 - burst) * Math.min(w, h) * 0.32, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  const vignette = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.2, cx, cy, Math.max(w, h) * 0.78);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,.72)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  live.burst = burst * 0.91;
  if (!isPreview) live.level = level * 0.94;
}
