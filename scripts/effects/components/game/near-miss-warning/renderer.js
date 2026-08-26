import { clamp, fract, TAU } from "../../../shared/canvas.js";

function plane(ctx, x, y, angle, color, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(size * 0.05, 0); ctx.lineTo(-size * 0.04, -size * 0.022); ctx.lineTo(-size * 0.016, 0); ctx.lineTo(-size * 0.04, size * 0.022); ctx.closePath(); ctx.fill();
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const p = fract(t / 5200);
  const manual = state.custom.lastReroute && state.now - state.custom.lastReroute < 5200;
  const waypointX = manual ? state.custom.waypointX : w * 0.74;
  const waypointY = manual ? state.custom.waypointY : h * 0.23;
  const a = { x: w * (0.08 + p * 0.84), y: h * 0.48 };
  let b;
  if (manual) {
    const q = 1 - p;
    b = { x: q * q * w * 0.5 + 2 * q * p * waypointX + p * p * w * 0.5, y: q * q * h * 0.08 + 2 * q * p * waypointY + p * p * h * 0.92 };
  } else {
    b = { x: w * 0.5, y: h * (0.08 + p * 0.84) };
  }
  const distance = Math.hypot(a.x - b.x, a.y - b.y);
  const danger = clamp(1 - distance / (size * 0.25), 0, 1);

  ctx.fillStyle = "#06151c";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(80,202,220,0.12)";
  for (let r = size * 0.1; r <= size * 0.6; r += size * 0.1) {
    ctx.beginPath(); ctx.arc(w * 0.5, h * 0.5, r, 0, TAU); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h); ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5); ctx.stroke();

  ctx.setLineDash([size * 0.018, size * 0.02]);
  ctx.strokeStyle = "rgba(92,225,255,0.58)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(w * 0.05, h * 0.48); ctx.lineTo(w * 0.95, h * 0.48); ctx.stroke();
  ctx.strokeStyle = manual ? "rgba(105,255,174,0.72)" : "rgba(255,187,77,0.68)";
  ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.05);
  if (manual) ctx.quadraticCurveTo(waypointX, waypointY, w * 0.5, h * 0.95); else ctx.lineTo(w * 0.5, h * 0.95);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = danger > 0.45 ? "#ff4e5d" : "#f6c959";
  ctx.globalAlpha = 0.25 + danger * 0.75;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(a.x, a.y, size * 0.09, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(b.x, b.y, size * 0.09, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.globalAlpha = 1;
  plane(ctx, a.x, a.y, 0, "#78e9ff", size);
  plane(ctx, b.x, b.y, Math.PI / 2, manual ? "#7dffae" : "#ffc65f", size);

  if (manual) {
    ctx.fillStyle = "#7dffae";
    ctx.beginPath(); ctx.arc(waypointX, waypointY, size * 0.022, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = danger > 0.45 ? "#ff6370" : manual ? "#7dffae" : "#ffd275";
  ctx.font = `900 ${Math.max(13, size * 0.04)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(danger > 0.45 ? "CONFLICT" : manual ? "ROUTE CLEAR" : "MONITOR", w * 0.5, h * 0.14);
  ctx.font = `700 ${Math.max(9, size * 0.025)}px system-ui, sans-serif`;
  ctx.fillText(`SEPARATION ${Math.round(distance / size * 1000)} m`, w * 0.5, h * 0.19);
}
