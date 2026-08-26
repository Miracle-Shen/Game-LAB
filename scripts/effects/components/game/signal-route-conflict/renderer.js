import { clamp, fract, TAU } from "../../../shared/canvas.js";

function track(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

function train(ctx, x, y, angle, color, size) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.shadowColor = color; ctx.shadowBlur = 9;
  ctx.fillRect(-size * 0.07, -size * 0.025, size * 0.14, size * 0.05);
  ctx.fillStyle = "#d8f5ff";
  ctx.fillRect(size * 0.03, -size * 0.016, size * 0.025, size * 0.032);
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const green = state.custom.green;
  const p = fract(t / (green ? 5600 : 7600));
  const horizontalX = w * (0.08 + p * 0.84);
  const verticalY = h * (0.08 + p * 0.84);
  const danger = !green && Math.abs(p - 0.5) < 0.19;
  const pulse = 0.45 + Math.sin(t * 0.012) * 0.25;

  ctx.fillStyle = "#10191a";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#172424";
  for (let x = 0; x < w; x += size * 0.12) ctx.fillRect(x, 0, 1, h);
  for (let y = 0; y < h; y += size * 0.12) ctx.fillRect(0, y, w, 1);

  track(ctx, w * 0.05, h * 0.5 - size * 0.026, w * 0.95, h * 0.5 - size * 0.026, "#655d57", 3);
  track(ctx, w * 0.05, h * 0.5 + size * 0.026, w * 0.95, h * 0.5 + size * 0.026, "#655d57", 3);
  track(ctx, w * 0.5 - size * 0.026, h * 0.05, w * 0.5 - size * 0.026, h * 0.95, "#655d57", 3);
  track(ctx, w * 0.5 + size * 0.026, h * 0.05, w * 0.5 + size * 0.026, h * 0.95, "#655d57", 3);
  for (let x = w * 0.07; x < w * 0.94; x += size * 0.06) track(ctx, x, h * 0.45, x, h * 0.55, "#3a3432", 2);
  for (let y = h * 0.07; y < h * 0.94; y += size * 0.06) track(ctx, w * 0.45, y, w * 0.55, y, "#3a3432", 2);

  ctx.fillStyle = danger ? `rgba(255,54,65,${pulse})` : green ? "rgba(87,255,155,0.22)" : "rgba(255,177,69,0.2)";
  ctx.fillRect(w * 0.42, h * 0.4, w * 0.16, h * 0.2);
  ctx.strokeStyle = danger ? "#ff4653" : green ? "#64efa5" : "#dda84f";
  ctx.lineWidth = 3;
  ctx.strokeRect(w * 0.42, h * 0.4, w * 0.16, h * 0.2);

  if (green) {
    ctx.strokeStyle = "rgba(89,255,162,0.72)";
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(w * 0.08, h * 0.5); ctx.quadraticCurveTo(w * 0.5, h * 0.5, w * 0.73, h * 0.83); ctx.stroke();
  }

  train(ctx, horizontalX, h * 0.5, 0, "#58dbff", size);
  train(ctx, w * 0.5, verticalY, Math.PI / 2, green ? "#80f4ad" : "#ffc45e", size);

  const sx = w * 0.28;
  const sy = h * 0.27;
  ctx.fillStyle = "#101315";
  ctx.fillRect(sx - size * 0.028, sy - size * 0.07, size * 0.056, size * 0.14);
  ctx.fillStyle = green ? "#55f59c" : "#ff4d59";
  ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(sx, sy + (green ? size * 0.032 : -size * 0.032), size * 0.014, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;

  const timeToConflict = Math.max(0, Math.abs(0.5 - p) * 7.6);
  ctx.fillStyle = danger ? "#ff6570" : green ? "#74f3ac" : "#ffd178";
  ctx.font = `900 ${Math.max(13, size * 0.04)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(danger ? `CONFLICT ${timeToConflict.toFixed(1)}s` : green ? "ROUTE LOCKED" : "SIGNAL HOLD", w * 0.5, h * 0.14);
}
