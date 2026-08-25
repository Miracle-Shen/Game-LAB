import { fract, hash, TAU } from "../../../shared/canvas.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function drawPetal(ctx, radius, angle, spread, length, alpha, color) {
  ctx.save();
  ctx.rotate(angle);
  ctx.translate(radius, 0);
  ctx.rotate(Math.PI / 2 + spread);
  ctx.scale(0.48, 1);
  ctx.fillStyle = color.replace("ALPHA", alpha.toFixed(3));
  ctx.beginPath();
  ctx.moveTo(0, -length * 0.12);
  ctx.bezierCurveTo(length * 0.68, -length * 0.52, length * 0.62, length * 0.56, 0, length);
  ctx.bezierCurveTo(-length * 0.62, length * 0.56, -length * 0.68, -length * 0.52, 0, -length * 0.12);
  ctx.fill();
  ctx.restore();
}

function traceHeart(ctx, centerX, centerY, scale) {
  ctx.beginPath();
  for (let i = 0; i <= 140; i += 1) {
    const angle = (i / 140) * TAU;
    const sin = Math.sin(angle);
    const x = 16 * sin * sin * sin;
    const y = 13 * Math.cos(angle)
      - 5 * Math.cos(angle * 2)
      - 2 * Math.cos(angle * 3)
      - Math.cos(angle * 4);
    const px = centerX + (x / 18) * scale;
    const py = centerY - (y / 18) * scale;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
}

export function draw(ctx, w, h, t, intensity, state) {
  const live = state?.custom || {};
  const music = clamp(live.musicLevel || 0, 0, 1);
  const mic = clamp(live.micLevel || 0, 0, 1);
  const accuracy = clamp(live.accuracy || 0, 0, 1);
  const pulse = clamp(live.hitPulse || 0, 0, 1);
  const progress = live.progress || (t * 0.000025) % 1;
  const energy = clamp(0.18 + music * 1.15 + mic * 0.9 + pulse * 0.7, 0.18, 1.8) * intensity;
  const cx = w * (w < 720 ? 0.5 : 0.48);
  const cy = h * 0.46;

  ctx.fillStyle = "#030305";
  ctx.fillRect(0, 0, w, h);

  const backdrop = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
  backdrop.addColorStop(0, `rgba(${38 + Math.round(accuracy * 18)},${12 + Math.round(accuracy * 34)},${26 + Math.round(accuracy * 30)},${0.72 + music * 0.18})`);
  backdrop.addColorStop(0.42, "rgba(16,7,18,.84)");
  backdrop.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";
  const baseRadius = Math.min(w, h) * (0.105 + energy * 0.018);
  const rings = 7;
  for (let ring = rings - 1; ring >= 0; ring -= 1) {
    const petals = 7 + ring * 2;
    const ringRadius = baseRadius * (0.24 + ring * 0.19);
    const length = baseRadius * (0.46 + ring * 0.1) * (0.9 + energy * 0.12);
    const rotation = t * (ring % 2 ? -0.000055 : 0.00007) + ring * 0.47 + progress * TAU * 0.16;
    for (let i = 0; i < petals; i += 1) {
      const angle = rotation + (i / petals) * TAU;
      const warm = 1 - accuracy;
      const color = ring % 3 === 0
        ? `rgba(${Math.round(88 + warm * 148)},${Math.round(188 + accuracy * 58)},${Math.round(201 - warm * 92)},ALPHA)`
        : `rgba(${Math.round(176 + warm * 70)},${Math.round(45 + accuracy * 104)},${Math.round(104 + accuracy * 76)},ALPHA)`;
      drawPetal(ctx, ringRadius, angle, Math.sin(t * 0.0008 + i) * 0.12, length, 0.1 + energy * 0.09, color);
    }
  }

  const particleCount = Math.floor((70 + energy * 90) * intensity);
  for (let i = 0; i < particleCount; i += 1) {
    const seed = hash(i * 8.731);
    const life = fract(seed + t * (0.000025 + hash(i * 2.4) * 0.00008));
    const angle = hash(i * 3.71) * TAU + t * (i % 2 ? 0.00006 : -0.000045);
    const distance = Math.pow(life, 0.72) * Math.max(w, h) * (0.16 + energy * 0.32);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * 0.68;
    const radius = 0.7 + seed * 2.4 + mic * 2.2;
    ctx.fillStyle = i % 4 === 0
      ? `rgba(110,255,207,${(1 - life) * (0.3 + accuracy * 0.55)})`
      : `rgba(255,86,139,${(1 - life) * (0.24 + energy * 0.22)})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }

  if (pulse > 0.01) {
    ctx.strokeStyle = `rgba(183,255,224,${pulse * 0.82})`;
    ctx.lineWidth = 2 + pulse * 5;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * (1.5 + (1 - pulse) * 2.8), 0, TAU);
    ctx.stroke();
  }
  ctx.restore();

  if (live.heartMode && live.completed) {
    const heartX = w * 0.515;
    const heartY = h * 0.58;
    const heartScale = Math.min(w, h) * 0.27;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i += 1) {
      const phase = fract(t * 0.00018 + i / 3);
      ctx.strokeStyle = i === 1
        ? `rgba(92,255,211,${(1 - phase) * 0.16})`
        : `rgba(255,79,145,${(1 - phase) * 0.2})`;
      ctx.lineWidth = 1 + (1 - phase) * 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = i === 1 ? "rgba(92,255,211,.4)" : "rgba(255,79,145,.48)";
      traceHeart(ctx, heartX, heartY, heartScale * (1 + phase * 0.18));
      ctx.stroke();
    }
    ctx.restore();
  }

  const floor = ctx.createLinearGradient(0, h * 0.6, 0, h);
  floor.addColorStop(0, "rgba(0,0,0,0)");
  floor.addColorStop(1, "rgba(0,0,0,.82)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  live.hitPulse = pulse * 0.9;
  live.micLevel = mic * 0.96;
}
