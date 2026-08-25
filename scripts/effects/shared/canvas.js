export const TAU = Math.PI * 2;

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const fract = (value) => value - Math.floor(value);
export const hash = (value) => fract(Math.sin(value * 127.1) * 43758.5453);

export const casualPalette = ["#ff4d88", "#40d6c3", "#ffc857", "#856cff", "#56a8ff"];

export function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, r);
}

export function drawGrid(ctx, width, height, alpha = 0.08) {
  ctx.save();
  ctx.strokeStyle = `rgba(240,240,250,${alpha})`;
  ctx.lineWidth = 1;
  const step = Math.max(32, Math.min(width, height) / 8);
  for (let x = step / 2; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = step / 2; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function smoothPath(ctx, points) {
  if (!points.length) return;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  const last = points.at(-1);
  ctx.lineTo(last.x, last.y);
}
