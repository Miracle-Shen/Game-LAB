import { casualPalette, clamp, hash, roundedRect, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#17152b";
  ctx.fillRect(0, 0, w, h);
  const cols = 7;
  const rows = 5;
  const gap = Math.max(4, Math.min(w, h) * 0.018);
  const size = Math.min((w * 0.72 - gap * (cols - 1)) / cols, (h * 0.72 - gap * (rows - 1)) / rows);
  const boardW = cols * size + (cols - 1) * gap;
  const boardH = rows * size + (rows - 1) * gap;
  const ox = (w - boardW) / 2;
  const oy = (h - boardH) / 2;
  const hit = state.impulses.at(-1);
  const age = hit ? state.now - hit.time : t % 2100;
  const wave = clamp(age / 850, 0, 1) * Math.max(boardW, boardH) * 0.72;
  const hx = hit ? hit.x : w * 0.5;
  const hy = hit ? hit.y : h * 0.5;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = ox + col * (size + gap) + size / 2;
      const cy = oy + row * (size + gap) + size / 2;
      const pulse = Math.max(0, 1 - Math.abs(Math.hypot(cx - hx, cy - hy) - wave) / (size * 1.3)) * (1 - clamp(age / 1300, 0, 1));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + pulse * 0.32, 1 + pulse * 0.32);
      ctx.rotate(Math.PI / 4 + pulse * 0.2);
      const color = casualPalette[(col * 2 + row * 3) % casualPalette.length];
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 5 + pulse * 24;
      roundedRect(ctx, -size * 0.34, -size * 0.34, size * 0.68, size * 0.68, size * 0.16);
      ctx.fill();
      ctx.restore();
    }
  }
  if (age < 1300) {
    for (let i = 0; i < Math.floor(36 * intensity); i++) {
      const angle = hash(i * 4.7) * TAU;
      const radius = wave * (0.7 + hash(i) * 0.35);
      ctx.fillStyle = casualPalette[i % casualPalette.length];
      ctx.fillRect(hx + Math.cos(angle) * radius, hy + Math.sin(angle) * radius, 2 + hash(i) * 5, 2 + hash(i) * 5);
    }
  }
}
