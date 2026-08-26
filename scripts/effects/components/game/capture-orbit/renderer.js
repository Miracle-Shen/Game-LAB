import { clamp, fract, hash, TAU } from "../../../shared/canvas.js";

function arcPoint(sx, sy, tx, ty, p, lift) {
  const q = 1 - p;
  return { x: q * q * sx + 2 * q * p * (sx + tx) / 2 + p * p * tx, y: q * q * sy + 2 * q * p * (Math.min(sy, ty) - lift) + p * p * ty };
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const sx = w * 0.17;
  const sy = h * 0.77;
  const manual = state.custom.lastThrow && state.now - state.custom.lastThrow < 4300;
  const age = manual ? state.now - state.custom.lastThrow : t % 4300;
  const tx = state.custom.targetX || w * 0.72;
  const ty = state.custom.targetY || h * 0.63;
  const flight = clamp(age / 1050, 0, 1);
  const success = (state.custom.attempts || 0) % 2 === 0;
  const shakePhase = age > 1050 && age < 2700 ? Math.floor((age - 1050) / 430) : -1;
  const shake = shakePhase >= 0 ? Math.sin(age * 0.035) * size * 0.018 * (1 - (age - 1050) / 1800) : 0;

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#14334b");
  bg.addColorStop(0.65, "#234c42");
  bg.addColorStop(1, "#122a25");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(103,194,104,0.18)";
  for (let i = 0; i < 18; i += 1) {
    ctx.beginPath(); ctx.arc(hash(i * 2.2) * w, h * (0.68 + hash(i * 7.1) * 0.3), size * (0.02 + hash(i) * 0.05), Math.PI, TAU); ctx.fill();
  }

  if (age < 900 || !manual) {
    const aura = ctx.createRadialGradient(tx, ty, 0, tx, ty, size * 0.15);
    aura.addColorStop(0, "rgba(255,228,113,0.5)");
    aura.addColorStop(1, "rgba(255,228,113,0)");
    ctx.fillStyle = aura; ctx.fillRect(tx - size * 0.15, ty - size * 0.15, size * 0.3, size * 0.3);
    ctx.fillStyle = "#ffd75f";
    ctx.beginPath(); ctx.arc(tx, ty, size * 0.055, 0, TAU); ctx.fill();
    ctx.fillStyle = "#273235";
    ctx.beginPath(); ctx.arc(tx - size * 0.02, ty - size * 0.008, size * 0.009, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(tx + size * 0.02, ty - size * 0.008, size * 0.009, 0, TAU); ctx.fill();
  }

  const ball = arcPoint(sx, sy, tx, ty, flight, size * 0.35);
  const ballX = flight < 1 ? ball.x : tx + shake;
  const ballY = flight < 1 ? ball.y : ty;
  ctx.fillStyle = "#f4f5f5";
  ctx.strokeStyle = "#111b21";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(ballX, ballY, size * 0.034, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#ff5d5d";
  ctx.beginPath(); ctx.arc(ballX, ballY, size * 0.034, Math.PI, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(ballX, ballY, size * 0.01, 0, TAU); ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.stroke();

  if (age > 2700) {
    const resultLife = clamp((age - 2700) / 1000, 0, 1);
    if (success) {
      for (let i = 0; i < 8; i += 1) {
        const angle = i / 8 * TAU;
        ctx.fillStyle = `rgba(255,226,89,${1 - resultLife})`;
        ctx.beginPath(); ctx.arc(tx + Math.cos(angle) * size * (0.07 + resultLife * 0.16), ty + Math.sin(angle) * size * (0.07 + resultLife * 0.16), size * 0.012, 0, TAU); ctx.fill();
      }
    } else {
      ctx.strokeStyle = `rgba(255,91,91,${1 - resultLife})`;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(tx, ty, size * (0.05 + resultLife * 0.2), 0, TAU); ctx.stroke();
    }
    ctx.fillStyle = success ? "#ffe772" : "#ff7474";
    ctx.font = `900 ${Math.max(16, size * 0.052)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(success ? "CAPTURED" : "BROKE FREE", w * 0.5, h * 0.18);
  }

  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = shakePhase > i ? "#ffe772" : "rgba(255,255,255,0.18)";
    ctx.beginPath(); ctx.arc(w * 0.46 + i * size * 0.045, h * 0.9, size * 0.012, 0, TAU); ctx.fill();
  }
}
