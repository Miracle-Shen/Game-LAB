import { clamp, hash, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules, getFighterPair } from "../../../shared/fighter-library.js";

const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function drawFighter(ctx, x, y, size, facing, pose, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.strokeStyle = color;
  ctx.fillStyle = "#090b10";
  ctx.lineWidth = Math.max(2, size * 0.055);
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 9;
  ctx.beginPath();
  ctx.arc(0, -size * 0.43, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.29);
  ctx.lineTo(-size * 0.04, size * 0.18);
  ctx.moveTo(-size * 0.02, -size * 0.12);
  ctx.lineTo(size * (0.34 + pose * 0.3), -size * (0.14 + pose * 0.06));
  ctx.moveTo(-size * 0.02, -size * 0.08);
  ctx.lineTo(-size * 0.28, size * 0.07);
  ctx.moveTo(-size * 0.04, size * 0.18);
  ctx.lineTo(size * 0.2, size * 0.48);
  ctx.moveTo(-size * 0.04, size * 0.18);
  ctx.lineTo(-size * 0.27, size * 0.48);
  ctx.stroke();
  ctx.restore();
}

function drawCombatant(ctx, fighter, x, y, size, facing, pose, color) {
  const image = getFighterImage(fighter, pose > 0.2 ? "attack" : pose < -0.08 ? "hurt" : "neutral");
  if (!drawFighterImage(ctx, image, {
    x,
    y,
    size: size * 2.05,
    facing,
    rotation: pose < -0.08 ? -facing * 0.06 : 0,
    glow: color,
    blur: 12,
  })) {
    drawFighter(ctx, x, y, size, facing, pose, color);
  }
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const manual = state.custom.lastHit && state.now - state.custom.lastHit < 4200;
  const age = manual ? state.now - state.custom.lastHit : t % 2400;
  const impact = clamp(1 - age / 620, 0, 1);
  const freeze = age < 76 ? 1 : 0;
  const hitX = manual && state.custom.hitX ? state.custom.hitX : w * 0.59;
  const hitY = manual && state.custom.hitY ? state.custom.hitY : h * 0.52;
  const shake = age > 76 && age < 330 ? (1 - (age - 76) / 254) * 10 * intensity : 0;

  ctx.save();
  ctx.translate(Math.sin(state.now * 0.31) * shake, Math.cos(state.now * 0.27) * shake * 0.5);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0c0d12");
  bg.addColorStop(0.62, "#18151d");
  bg.addColorStop(1, "#261217");
  ctx.fillStyle = bg;
  ctx.fillRect(-16, -16, w + 32, h + 32);

  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  for (let i = 0; i < 7; i += 1) {
    const y = h * (0.58 + i * 0.07);
    ctx.beginPath();
    ctx.moveTo(w * (0.2 - i * 0.045), y);
    ctx.lineTo(w * (0.8 + i * 0.045), y);
    ctx.stroke();
  }

  const attackerX = w * 0.35 + (freeze ? size * 0.06 : 0);
  const pair = getFighterPair(state.custom.fighterPair);
  if (pair) {
    drawCombatant(ctx, pair[0], attackerX, h * 0.68, size * 0.22, 1, impact, "#8ee9ff");
    drawCombatant(ctx, pair[1], w * 0.66 + impact * size * 0.035, h * 0.68, size * 0.22, -1, -impact * 0.3, "#ff7e86");
  } else {
    drawFighter(ctx, attackerX, h * 0.64, size * 0.22, 1, impact, "#8ee9ff");
    drawFighter(ctx, w * 0.66 + impact * size * 0.035, h * 0.64, size * 0.22, -1, -impact * 0.3, "#ff7e86");
  }

  if (impact > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const flash = ctx.createRadialGradient(hitX, hitY, 0, hitX, hitY, size * 0.37);
    flash.addColorStop(0, `rgba(255,255,255,${0.92 * impact})`);
    flash.addColorStop(0.08, `rgba(255,197,91,${0.72 * impact})`);
    flash.addColorStop(0.34, `rgba(255,70,62,${0.2 * impact})`);
    flash.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = flash;
    ctx.fillRect(0, 0, w, h);
    ctx.translate(hitX, hitY);
    ctx.rotate(-0.16);
    for (let i = 0; i < Math.floor(26 * intensity); i += 1) {
      const angle = hash(i * 4.73) * TAU;
      const inner = size * (0.03 + hash(i * 9.1) * 0.05);
      const outer = inner + size * (0.08 + hash(i * 2.7) * 0.22) * (1.1 - impact * 0.3);
      ctx.strokeStyle = i % 4 ? `rgba(255,176,75,${impact})` : `rgba(255,255,255,${impact})`;
      ctx.lineWidth = 1 + hash(i) * 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (age < 900) {
    const rise = clamp(age / 900, 0, 1);
    const alpha = clamp(1 - rise * 1.05, 0, 1);
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = `900 ${Math.max(20, size * 0.078)}px system-ui, sans-serif`;
    ctx.fillStyle = `rgba(255,238,172,${alpha})`;
    ctx.shadowColor = "#ff542e";
    ctx.shadowBlur = 12;
    const damage = 24 + (manual ? state.custom.combo : 2) * 13;
    ctx.fillText(`-${damage}`, hitX + size * 0.06, hitY - size * (0.08 + rise * 0.18));
    ctx.restore();
  }

  if (freeze) {
    ctx.fillStyle = `rgba(255,255,255,${0.17 * impact})`;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}
