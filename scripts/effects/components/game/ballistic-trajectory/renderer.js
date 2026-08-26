import { clamp, fract, hash, TAU } from "../../../shared/canvas.js";

function pointOnArc(startX, startY, targetX, targetY, p, lift) {
  const controlX = (startX + targetX) / 2;
  const controlY = Math.min(startY, targetY) - lift;
  const q = 1 - p;
  return {
    x: q * q * startX + 2 * q * p * controlX + p * p * targetX,
    y: q * q * startY + 2 * q * p * controlY + p * p * targetY,
  };
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const startX = w * 0.14;
  const startY = h * 0.76;
  const manual = state.custom.lastFire && state.now - state.custom.lastFire < 4200;
  const targetX = state.pointer.active ? state.pointer.x : state.custom.targetX || w * 0.76;
  const targetY = state.pointer.active ? state.pointer.y : state.custom.targetY || h * 0.69;
  const age = manual ? state.now - state.custom.lastFire : t % 3000;
  const flight = clamp(age / 1100, 0, 1);
  const lift = size * (0.25 + Math.abs(targetX - startX) / w * 0.24);

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#20324b");
  sky.addColorStop(0.62, "#53625b");
  sky.addColorStop(1, "#1c261e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#263527";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  for (let x = 0; x <= w; x += w / 8) ctx.lineTo(x, h * (0.68 + hash(x) * 0.1));
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();

  ctx.setLineDash([size * 0.018, size * 0.025]);
  ctx.strokeStyle = "rgba(255,239,167,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 32; i += 1) {
    const p = i / 32;
    const point = pointOnArc(startX, startY, targetX, targetY, p, lift);
    if (i === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(255,91,68,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(targetX, targetY, size * 0.04, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(targetX - size * 0.065, targetY); ctx.lineTo(targetX + size * 0.065, targetY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(targetX, targetY - size * 0.065); ctx.lineTo(targetX, targetY + size * 0.065); ctx.stroke();

  const projectile = pointOnArc(startX, startY, targetX, targetY, flight, lift);
  ctx.fillStyle = "#ffe8a3";
  ctx.shadowColor = "#ff8f4f";
  ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(projectile.x, projectile.y, size * 0.018, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0;

  if (age > 1050 && age < 1900) {
    const impact = clamp(1 - (age - 1050) / 850, 0, 1);
    for (let i = 0; i < 24; i += 1) {
      const angle = hash(i * 3.71) * TAU;
      const distance = (1 - impact) * size * (0.05 + hash(i) * 0.16);
      ctx.fillStyle = `rgba(255,184,91,${impact})`;
      ctx.beginPath(); ctx.arc(targetX + Math.cos(angle) * distance, targetY + Math.sin(angle) * distance * 0.6, 1 + hash(i * 8) * 3, 0, TAU); ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(8,12,13,0.58)";
  ctx.fillRect(w * 0.06, h * 0.08, w * 0.3, size * 0.085);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = `700 ${Math.max(10, size * 0.029)}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(`ARC ${Math.round(lift / size * 100)}  WIND ${Math.round(Math.sin(t * 0.001) * 8)}`, w * 0.08, h * 0.13);
  for (let i = 0; i < 3; i += 1) {
    const x = w * (0.42 + i * 0.07) + Math.sin(t * 0.001) * size * 0.02;
    ctx.strokeStyle = "rgba(187,229,238,0.5)";
    ctx.beginPath(); ctx.moveTo(x, h * 0.13); ctx.lineTo(x + size * 0.05, h * 0.13); ctx.stroke();
  }
}
