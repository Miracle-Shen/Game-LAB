import { lerp, roundedRect, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  if (state?.mediaLayer) ctx.clearRect(0, 0, w, h);
  else {
    ctx.fillStyle = "#05060a";
    ctx.fillRect(0, 0, w, h);
  }
  const bars = Math.max(18, Math.floor(w / 16));
  const gap = 4;
  const barW = Math.max(2, w / bars - gap);
  for (let i = 0; i < bars; i++) {
    const p = i / (bars - 1);
    const wave = Math.abs(Math.sin(t * 0.0022 + i * 0.31) * 0.58 + Math.sin(t * 0.0011 - i * 0.17) * 0.42);
    const envelope = Math.sin(p * Math.PI) * 0.65 + 0.35;
    const barHeight = Math.max(3, wave * envelope * h * 0.52 * intensity);
    const hue = lerp(188, 332, p);
    ctx.fillStyle = `hsla(${hue}, 86%, 67%, ${state?.mediaLayer ? 0.2 + wave * 0.36 : 0.48 + wave * 0.5})`;
    roundedRect(ctx, i * (barW + gap) + gap / 2, h * 0.72 - barHeight, barW, barHeight, barW / 2);
    ctx.fill();
  }
  const pulse = (Math.sin(t * 0.004) + 1) / 2;
  ctx.strokeStyle = `rgba(240,240,250,${0.15 + pulse * 0.25})`;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.35, 28 + pulse * 24 * intensity, 0, TAU);
  ctx.stroke();
}
