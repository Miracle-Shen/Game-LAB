import { clamp, hash, TAU } from "../../../shared/canvas.js";

function comboText(ctx, text, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(20,8,28,0.85)";
  ctx.lineWidth = Math.max(3, size * 0.012);
  ctx.font = `950 ${Math.max(34, size * 0.17)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const manual = state.custom.lastEvent && state.now - state.custom.lastEvent < 3800;
  const age = manual ? state.now - state.custom.lastEvent : t % 3800;
  const broken = manual ? state.custom.broken : age > 2400;
  const progress = broken ? clamp((age - (manual ? 0 : 2400)) / 1100, 0, 1) : 0;
  const combo = state.custom.combo || 12;
  const color = combo > 20 ? "#ff6c9f" : combo > 10 ? "#ffe46e" : "#77e8ff";

  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, size * 0.72);
  bg.addColorStop(0, "#281044");
  bg.addColorStop(1, "#080611");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 14; i += 1) {
    const angle = i / 14 * TAU + t * 0.0002;
    ctx.strokeStyle = "rgba(140,85,255,0.14)";
    ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.52); ctx.lineTo(w * 0.5 + Math.cos(angle) * size * 0.55, h * 0.52 + Math.sin(angle) * size * 0.55); ctx.stroke();
  }

  const text = `${broken ? 12 : Math.max(2, combo)}x`;
  if (!broken) {
    const bounce = 1 + Math.sin(age * 0.018) * 0.045 * clamp(1 - age / 900, 0, 1);
    ctx.save(); ctx.translate(w * 0.5, h * 0.5); ctx.scale(bounce, bounce); ctx.translate(-w * 0.5, -h * 0.5);
    ctx.shadowColor = color; ctx.shadowBlur = 22;
    comboText(ctx, text, w * 0.5, h * 0.5, size, color);
    ctx.restore();
  } else {
    const strips = 7;
    for (let i = 0; i < strips; i += 1) {
      const stripH = size * 0.042;
      const top = h * 0.5 - strips * stripH / 2 + i * stripH;
      const direction = i % 2 ? 1 : -1;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, top, w, stripH + 2); ctx.clip();
      ctx.translate(direction * progress * size * (0.08 + i * 0.014), progress * progress * size * (0.05 + i * 0.025));
      ctx.rotate(direction * progress * 0.045);
      comboText(ctx, text, w * 0.5, h * 0.5, size, "#ff5d76");
      ctx.restore();
    }
    for (let i = 0; i < 30; i += 1) {
      const angle = hash(i * 2.8) * TAU;
      const distance = progress * size * (0.04 + hash(i) * 0.3);
      ctx.fillStyle = `rgba(255,91,119,${1 - progress})`;
      ctx.fillRect(w * 0.5 + Math.cos(angle) * distance, h * 0.5 + Math.sin(angle) * distance, 2 + hash(i) * 5, 2 + hash(i * 3) * 6);
    }
  }

  ctx.fillStyle = broken ? "#ff778a" : "rgba(255,255,255,0.82)";
  ctx.font = `800 ${Math.max(12, size * 0.035)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(broken ? "COMBO BREAK" : "KEEP THE FLOW", w * 0.5, h * 0.76);
}
