import { TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  if (state?.mediaLayer) ctx.clearRect(0, 0, w, h);
  else {
    ctx.fillStyle = "#080714";
    ctx.fillRect(0, 0, w, h);
  }
  const palette = ["91,72,255", "229,64,183", "41,208,205", "245,179,71"];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = `blur(${Math.min(w, h) * 0.035}px)`;
  palette.forEach((color, i) => {
    const x = w * (0.25 + i * 0.17) + Math.sin(t * 0.00035 + i * 1.9) * w * 0.16;
    const y = h * (0.38 + (i % 2) * 0.25) + Math.cos(t * 0.00042 + i) * h * 0.16;
    const r = Math.min(w, h) * (0.15 + 0.04 * intensity);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, `rgba(${color},${state?.mediaLayer ? 0.18 : 0.5})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  });
  ctx.restore();
  ctx.strokeStyle = "rgba(240,240,250,0.14)";
  for (let y = h * 0.28; y < h * 0.78; y += 18) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 10) {
      const yy = y + Math.sin(x * 0.018 + t * 0.002 + y) * 5 * intensity;
      x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
    }
    ctx.stroke();
  }
}
