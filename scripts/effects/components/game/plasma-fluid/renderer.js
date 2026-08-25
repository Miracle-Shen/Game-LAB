import { hash, smoothPath } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "rgba(1,3,12,0.18)";
  ctx.fillRect(0, 0, w, h);
  const trail = state.trail.filter((point) => state.now - point.time < 1700);
  const auto = [];
  if (trail.length < 2) {
    for (let i = 0; i < 34; i++) {
      const angle = t * 0.0008 + i * 0.18;
      auto.push({ x: w * 0.5 + Math.cos(angle) * w * (0.08 + i * 0.006), y: h * 0.5 + Math.sin(angle * 1.7) * h * 0.22, time: state.now - (34 - i) * 26 });
    }
  }
  const points = trail.length >= 2 ? trail : auto;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ["56,225,255", "116,80,255", "255,63,196"].forEach((color, layer) => {
    ctx.strokeStyle = `rgba(${color},${0.16 + layer * 0.07})`;
    ctx.lineWidth = (28 - layer * 8) * intensity;
    ctx.lineCap = "round";
    ctx.beginPath();
    smoothPath(ctx, points.map((point, i) => ({ x: point.x + Math.sin(i * 0.4 + layer) * 10 * layer, y: point.y + Math.cos(i * 0.26 + layer) * 9 * layer })));
    ctx.stroke();
  });
  points.filter((_, i) => i % 4 === 0).forEach((point, i) => {
    const radius = 3 + hash(i * 3.7) * 10;
    const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 3);
    glow.addColorStop(0, "rgba(201,250,255,0.85)");
    glow.addColorStop(1, "rgba(47,126,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(point.x - radius * 3, point.y - radius * 3, radius * 6, radius * 6);
  });
  ctx.restore();
}
