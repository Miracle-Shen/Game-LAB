import { clamp, TAU } from "../../../shared/canvas.js";

function inCone(px, py, gx, gy, angle, range, spread) {
  const dx = px - gx;
  const dy = py - gy;
  const delta = Math.atan2(Math.sin(Math.atan2(dy, dx) - angle), Math.cos(Math.atan2(dy, dx) - angle));
  return Math.hypot(dx, dy) < range && Math.abs(delta) < spread;
}

function drawGuard(ctx, x, y, angle, size, alerted) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = alerted ? "#ff525d" : "#ffd36b";
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 9;
  ctx.beginPath(); ctx.arc(0, 0, size * 0.055, 0, TAU); ctx.fill();
  ctx.fillRect(-size * 0.035, -size * 0.018, size * 0.1, size * 0.036);
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const playerX = state.pointer.active ? state.pointer.x : state.custom.targetX || w * (0.5 + Math.sin(t * 0.0005) * 0.3);
  const playerY = state.pointer.active ? state.pointer.y : state.custom.targetY || h * (0.55 + Math.cos(t * 0.0007) * 0.22);
  const guards = [
    { x: w * 0.28, y: h * 0.34, a: 0.35 + Math.sin(t * 0.001) * 0.7 },
    { x: w * 0.73, y: h * 0.63, a: Math.PI + Math.cos(t * 0.0012) * 0.62 },
  ];
  const range = size * 0.42;
  const spread = 0.38;
  const forced = state.custom.lastAlert && state.now - state.custom.lastAlert < 1050;
  const detected = forced || guards.some((guard) => inCone(playerX, playerY, guard.x, guard.y, guard.a, range, spread));
  const alert = detected ? 1 : 0.18 + Math.sin(t * 0.002) * 0.04;

  ctx.fillStyle = "#091512";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#132822";
  for (let y = 0; y < h; y += size * 0.08) {
    for (let x = 0; x < w; x += size * 0.08) {
      if ((x / (size * 0.08) + y / (size * 0.08)) % 2 < 1) ctx.fillRect(x, y, size * 0.08, size * 0.08);
    }
  }
  ctx.fillStyle = "#263d36";
  ctx.fillRect(w * 0.43, 0, w * 0.12, h * 0.36);
  ctx.fillRect(w * 0.43, h * 0.68, w * 0.12, h * 0.32);
  ctx.fillRect(w * 0.08, h * 0.48, w * 0.18, h * 0.12);
  ctx.fillRect(w * 0.76, h * 0.28, w * 0.18, h * 0.12);

  guards.forEach((guard) => {
    const cone = ctx.createRadialGradient(guard.x, guard.y, 0, guard.x, guard.y, range);
    cone.addColorStop(0, detected ? "rgba(255,82,93,0.38)" : "rgba(255,218,105,0.32)");
    cone.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(guard.x, guard.y);
    ctx.arc(guard.x, guard.y, range, guard.a - spread, guard.a + spread);
    ctx.closePath();
    ctx.fill();
    drawGuard(ctx, guard.x, guard.y, guard.a, size, detected);
  });

  ctx.fillStyle = detected ? "#ff5362" : "#71f0b8";
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = detected ? 18 : 8;
  ctx.beginPath(); ctx.arc(playerX, playerY, size * 0.032, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;

  if (detected) {
    const pulse = clamp((state.now - (state.custom.lastAlert || state.now)) / 1000, 0, 1);
    ctx.strokeStyle = `rgba(255,75,88,${1 - pulse})`;
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(playerX, playerY, size * (0.07 + pulse * 0.2), 0, TAU); ctx.stroke();
    ctx.fillStyle = "#fff2dc";
    ctx.font = `900 ${Math.max(22, size * 0.09)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("!", playerX, playerY - size * 0.075);
  }

  ctx.fillStyle = "rgba(3,8,7,0.72)";
  ctx.fillRect(w * 0.28, h * 0.07, w * 0.44, size * 0.045);
  ctx.fillStyle = detected ? "#ff5362" : "#e6bd5d";
  ctx.fillRect(w * 0.28, h * 0.07, w * 0.44 * alert, size * 0.045);
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = `700 ${Math.max(10, size * 0.028)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(detected ? "DETECTED" : "SEARCHING", w * 0.5, h * 0.055);
}
