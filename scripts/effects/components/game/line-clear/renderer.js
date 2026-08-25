import { casualPalette, clamp, fract, hash, roundedRect } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#171226";
  ctx.fillRect(0, 0, w, h);
  const cols = 8;
  const rows = 6;
  const gap = Math.max(3, Math.min(w, h) * 0.012);
  const size = Math.min((w * 0.8 - gap * (cols - 1)) / cols, (h * 0.72 - gap * (rows - 1)) / rows);
  const boardW = cols * size + (cols - 1) * gap;
  const boardH = rows * size + (rows - 1) * gap;
  const ox = (w - boardW) / 2;
  const oy = (h - boardH) / 2;
  const hit = state.impulses.at(-1);
  const selectedCol = clamp(Math.floor(((hit?.x ?? w * 0.54) - ox) / (size + gap)), 0, cols - 1);
  const selectedRow = clamp(Math.floor(((hit?.y ?? h * 0.48) - oy) / (size + gap)), 0, rows - 1);
  const age = hit ? state.now - hit.time : t % 2400;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = ox + col * (size + gap);
      const y = oy + row * (size + gap);
      ctx.fillStyle = casualPalette[(col + row * 2) % casualPalette.length];
      ctx.globalAlpha = col === selectedCol || row === selectedRow ? 1 : 0.72;
      roundedRect(ctx, x, y, size * 0.86, size * 0.86, size * 0.22);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  if (age < 1100) {
    const beamX = ox + selectedCol * (size + gap) + size / 2;
    const beamY = oy + selectedRow * (size + gap) + size / 2;
    const flash = Math.max(0, 1 - age / 900);
    ctx.strokeStyle = `rgba(255,246,195,${flash})`;
    ctx.lineWidth = 3 + flash * 12 * intensity;
    ctx.beginPath();
    ctx.moveTo(ox, beamY); ctx.lineTo(ox + boardW, beamY);
    ctx.moveTo(beamX, oy); ctx.lineTo(beamX, oy + boardH);
    ctx.stroke();
    for (let i = 0; i < 42 * intensity; i++) {
      const progress = fract(hash(i * 4.2) + age * 0.0012);
      ctx.fillStyle = casualPalette[i % casualPalette.length];
      ctx.fillRect(i % 2 ? ox + progress * boardW : beamX, i % 2 ? beamY : oy + progress * boardH, 3, 3);
    }
  }
}
