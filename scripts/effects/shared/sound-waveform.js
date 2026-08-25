import { hash } from "./canvas.js";

export function drawSoundWaveform(ctx, w, h, t, intensity, options) {
  const {
    accent = [116, 239, 255],
    density = 72,
    pulse = 1.4,
    seed = 1,
    shape = "wave",
  } = options;
  const [r, g, b] = accent;
  const mid = h * 0.5;
  const phase = t * 0.001 * pulse;

  ctx.fillStyle = "#030405";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(240,240,250,0.055)";
  ctx.lineWidth = 1;
  for (let y = h * 0.25; y < h; y += h * 0.25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const glow = ctx.createLinearGradient(0, 0, w, 0);
  glow.addColorStop(0, `rgba(${r},${g},${b},0)`);
  glow.addColorStop(0.5, `rgba(${r},${g},${b},0.15)`);
  glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const bars = Math.max(28, Math.floor(density * Math.min(1.5, intensity)));
  const step = w / bars;
  ctx.lineCap = "round";
  for (let index = 0; index < bars; index++) {
    const x = (index + 0.5) * step;
    const normalized = index / Math.max(1, bars - 1);
    const envelope = Math.sin(normalized * Math.PI);
    const noise = hash(index * 9.13 + seed * 31.7);
    const oscillation = Math.sin(phase * (1.1 + noise) + index * (0.22 + seed * 0.015));
    const transient = shape === "impact"
      ? Math.pow(Math.max(0, Math.sin(phase * 0.72 - normalized * 2.6)), 5)
      : shape === "signal"
        ? Math.abs(Math.sin(phase * 1.8 + index * 0.64))
        : 0.35 + Math.abs(oscillation) * 0.65;
    const amplitude = h * (0.04 + envelope * (0.12 + noise * 0.22) * transient) * intensity;
    ctx.strokeStyle = `rgba(${r},${g},${b},${0.28 + envelope * 0.68})`;
    ctx.lineWidth = Math.max(1, step * 0.3);
    ctx.beginPath();
    ctx.moveTo(x, mid - amplitude);
    ctx.lineTo(x, mid + amplitude);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(w, mid);
  ctx.stroke();
}
