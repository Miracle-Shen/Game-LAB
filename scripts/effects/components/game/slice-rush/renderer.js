import { casualPalette, fract, hash, smoothPath, TAU } from "../../../shared/canvas.js";

function drawFruit(ctx, x, y, radius, color, leafAngle, split = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (split) ctx.rotate(split * 0.08);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(split ? -split * 5 : 0, 0, radius, split ? Math.PI * 0.53 : 0, split ? Math.PI * 1.47 : TAU);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#5ee074";
  ctx.rotate(leafAngle);
  ctx.beginPath();
  ctx.ellipse(radius * 0.15, -radius * 1.04, radius * 0.42, radius * 0.18, -0.4, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#11182a";
  ctx.fillRect(0, 0, w, h);
  const trail = state.trail.filter((point) => state.now - point.time < 520);
  for (let i = 0; i < 7; i++) {
    const phase = fract(hash(i * 6.1) + t * (0.00007 + hash(i) * 0.000025));
    const x = w * (0.12 + hash(i * 9.3) * 0.76) + Math.sin(t * 0.0007 + i) * w * 0.04;
    const y = h * 1.18 - Math.sin(phase * Math.PI) * h * (0.72 + hash(i * 5.4) * 0.3);
    const radius = Math.min(w, h) * (0.04 + hash(i * 2.8) * 0.025);
    const cut = trail.some((point) => Math.hypot(point.x - x, point.y - y) < radius * 1.5);
    const color = casualPalette[(i + 2) % casualPalette.length];
    if (cut) {
      drawFruit(ctx, x - 9, y, radius, color, i, -1);
      drawFruit(ctx, x + 9, y, radius, color, i, 1);
    } else drawFruit(ctx, x, y, radius, color, i);
  }
  const displayTrail = trail.length > 1 ? trail : Array.from({ length: 18 }, (_, i) => ({ x: w * (0.18 + i * 0.035), y: h * (0.63 - Math.sin(i * 0.25 + t * 0.002) * 0.13) }));
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let layer = 0; layer < 3; layer++) {
    ctx.strokeStyle = layer === 2 ? "rgba(255,255,255,0.95)" : `rgba(${layer ? "92,224,255" : "255,82,181"},${0.28 + layer * 0.18})`;
    ctx.lineWidth = (18 - layer * 7) * intensity;
    ctx.lineCap = "round";
    ctx.beginPath();
    smoothPath(ctx, displayTrail);
    ctx.stroke();
  }
  ctx.restore();
}
