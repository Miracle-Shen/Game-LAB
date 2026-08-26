import { clamp, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const cols = 9;
  const rows = 5;
  const brickW = w * 0.075;
  const brickH = h * 0.105;
  const wallW = cols * brickW;
  const wallX = (w - wallW) / 2;
  const wallY = h * 0.3;
  const manual = state.custom.lastImpact && state.now - state.custom.lastImpact < 5200;
  const age = manual ? state.now - state.custom.lastImpact : t % 5200;
  const hitX = manual ? state.custom.impactX : w * 0.53;
  const hitY = manual ? state.custom.impactY : h * 0.66;
  const hitCol = clamp(Math.floor((hitX - wallX) / brickW), 0, cols - 1);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#526278");
  bg.addColorStop(0.65, "#273039");
  bg.addColorStop(1, "#12171b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1c252a";
  ctx.fillRect(0, h * 0.82, w, h * 0.18);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const distance = Math.abs(col - hitCol);
      const affected = distance <= (row < 3 ? 1 : 0) || (row >= 3 && col === hitCol);
      const delay = (rows - 1 - row) * 170 + distance * 110;
      const fall = affected ? clamp((age - 320 - delay) / 1400, 0, 1) : 0;
      const x = wallX + col * brickW + (row % 2 ? brickW * 0.16 : 0);
      const y = wallY + row * brickH + fall * fall * h * 0.55;
      if (y > h + brickH) continue;
      ctx.save();
      ctx.translate(x + brickW * 0.47, y + brickH * 0.46);
      ctx.rotate((hash(index) - 0.5) * fall * 1.5);
      ctx.fillStyle = affected ? "#846b58" : "#78695d";
      ctx.strokeStyle = "rgba(26,18,15,0.65)";
      ctx.lineWidth = 2;
      ctx.fillRect(-brickW * 0.46, -brickH * 0.43, brickW * 0.92, brickH * 0.86);
      ctx.strokeRect(-brickW * 0.46, -brickH * 0.43, brickW * 0.92, brickH * 0.86);
      if (affected && age < 1800) {
        ctx.strokeStyle = "rgba(31,20,17,0.75)";
        ctx.beginPath(); ctx.moveTo(0, -brickH * 0.4); ctx.lineTo(-brickW * 0.09, 0); ctx.lineTo(brickW * 0.14, brickH * 0.41); ctx.stroke();
      }
      ctx.restore();
    }
  }

  if (age < 2100) {
    const blast = clamp(age / 2100, 0, 1);
    for (let i = 0; i < 34; i += 1) {
      const angle = hash(i * 4.7) * TAU;
      const distance = blast * size * (0.04 + hash(i * 1.7) * 0.28);
      ctx.fillStyle = `rgba(188,158,119,${0.58 * (1 - blast)})`;
      ctx.beginPath(); ctx.arc(hitX + Math.cos(angle) * distance, hitY + Math.sin(angle) * distance * 0.45, 2 + hash(i) * 6, 0, TAU); ctx.fill();
    }
  }

  ctx.strokeStyle = "rgba(255,179,76,0.82)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(hitX, hitY, size * 0.035, 0, TAU); ctx.stroke();
  ctx.fillStyle = "rgba(13,15,16,0.7)";
  ctx.fillRect(w * 0.34, h * 0.08, w * 0.32, size * 0.07);
  ctx.fillStyle = age > 600 ? "#ff9b58" : "#d9d1bf";
  ctx.font = `800 ${Math.max(10, size * 0.028)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(age > 600 ? "SUPPORT FAILED" : "STRUCTURE STABLE", w * 0.5, h * 0.125);
}
