import { clamp, hash, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules, getFighterPair } from "../../../shared/fighter-library.js";

const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function drawStickFighter(ctx, x, y, size, facing, color, knockedOut, winner) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  if (knockedOut) ctx.rotate(-1.08);
  ctx.strokeStyle = color;
  ctx.fillStyle = "#090a0e";
  ctx.lineWidth = Math.max(2, size * 0.052);
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = winner ? 18 : 8;
  ctx.beginPath();
  ctx.arc(0, -size * 0.43, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.28);
  ctx.lineTo(0, size * 0.16);
  ctx.moveTo(0, -size * 0.12);
  ctx.lineTo(size * (winner ? 0.48 : 0.27), -size * (winner ? 0.28 : 0.02));
  ctx.moveTo(0, -size * 0.1);
  ctx.lineTo(-size * 0.25, size * 0.02);
  ctx.moveTo(0, size * 0.15);
  ctx.lineTo(size * 0.24, size * 0.49);
  ctx.moveTo(0, size * 0.15);
  ctx.lineTo(-size * 0.25, size * 0.49);
  ctx.stroke();
  ctx.restore();
}

function drawAssetFighter(ctx, fighter, x, y, size, facing, color, knockedOut, winner) {
  const pose = winner ? "attack" : knockedOut ? "hurt" : "neutral";
  const image = getFighterImage(fighter, pose);
  const renderSize = size * (knockedOut ? 1.06 : 1);
  if (!drawFighterImage(ctx, image, {
    x,
    y,
    size: renderSize,
    facing,
    rotation: knockedOut ? -facing * 0.08 : 0,
    alpha: knockedOut ? 0.88 : 1,
    glow: color,
    blur: winner ? 28 : 12,
  })) {
    drawStickFighter(ctx, x, y, size * 0.58, facing, color, knockedOut, winner);
  }
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const manual = state.custom.lastFinish && state.now - state.custom.lastFinish < 5000;
  const age = manual ? state.now - state.custom.lastFinish : t % 3300;
  const winner = manual ? state.custom.winner : Math.floor(t / 3300) % 2 ? -1 : 1;
  const impact = clamp(1 - age / 520, 0, 1);
  const titleIn = clamp((age - 95) / 260, 0, 1);
  const hold = clamp(1 - Math.max(0, age - 2100) / 700, 0, 1);
  const shake = age < 310 ? impact * 13 * intensity : 0;

  ctx.save();
  ctx.translate(Math.sin(state.now * 0.34) * shake, Math.cos(state.now * 0.29) * shake * 0.45);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#171419");
  bg.addColorStop(0.54, "#3b2024");
  bg.addColorStop(1, "#0d090d");
  ctx.fillStyle = bg;
  ctx.fillRect(-18, -18, w + 36, h + 36);

  ctx.fillStyle = "rgba(255,237,192,0.045)";
  for (let i = 0; i < 12; i += 1) {
    const width = w * (0.02 + hash(i) * 0.08);
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(hash(i * 7.8) * TAU);
    ctx.fillRect(size * 0.08, -width * 0.5, size * 0.72, width);
    ctx.restore();
  }

  const loserTilt = age < 140 ? 0 : clamp((age - 140) / 420, 0, 1);
  const leftWins = winner < 0;
  const pair = getFighterPair(state.custom.fighterPair);
  const leftY = h * (leftWins ? 0.64 : 0.68 + loserTilt * 0.06);
  const rightY = h * (!leftWins ? 0.64 : 0.68 + loserTilt * 0.06);
  if (pair) {
    drawAssetFighter(ctx, pair[0], w * 0.28, leftY, size * 0.48, 1, "#59d9ff", !leftWins && loserTilt > 0.25, leftWins);
    drawAssetFighter(ctx, pair[1], w * 0.72, rightY, size * 0.48, -1, "#ff7a71", leftWins && loserTilt > 0.25, !leftWins);
  } else {
    drawStickFighter(ctx, w * 0.31, leftY, size * 0.24, 1, "#59d9ff", !leftWins && loserTilt > 0.25, leftWins);
    drawStickFighter(ctx, w * 0.69, rightY, size * 0.24, -1, "#ff7a71", leftWins && loserTilt > 0.25, !leftWins);
  }

  if (impact > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const hitX = w * 0.5;
    const hitY = h * 0.48;
    const flash = ctx.createRadialGradient(hitX, hitY, 0, hitX, hitY, size * 0.5);
    flash.addColorStop(0, `rgba(255,255,255,${impact})`);
    flash.addColorStop(0.16, `rgba(255,201,72,${impact * 0.7})`);
    flash.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = flash;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < Math.floor(34 * intensity); i += 1) {
      const angle = hash(i * 9.4) * TAU;
      const distance = size * (0.06 + (1 - impact) * (0.2 + hash(i) * 0.38));
      ctx.fillStyle = `rgba(255,${145 + hash(i) * 90},52,${impact})`;
      ctx.fillRect(hitX + Math.cos(angle) * distance, hitY + Math.sin(angle) * distance, 2 + hash(i) * 5, 2);
    }
    ctx.restore();
  }

  if (titleIn > 0 && hold > 0) {
    const scale = 1.34 - titleIn * 0.34;
    ctx.save();
    ctx.translate(w * 0.5, h * 0.38);
    ctx.scale(scale, scale);
    ctx.rotate(-0.065);
    ctx.globalAlpha = hold;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `1000 ${Math.max(54, size * 0.27)}px Impact, system-ui, sans-serif`;
    ctx.lineWidth = Math.max(3, size * 0.018);
    ctx.strokeStyle = "#2b0b08";
    ctx.shadowColor = "#ff7b21";
    ctx.shadowBlur = 20;
    ctx.strokeText("K.O.", 0, 0);
    const letters = ctx.createLinearGradient(0, -size * 0.14, 0, size * 0.12);
    letters.addColorStop(0, "#fff7bd");
    letters.addColorStop(0.45, "#ffbf39");
    letters.addColorStop(1, "#e63d1e");
    ctx.fillStyle = letters;
    ctx.fillText("K.O.", 0, 0);
    ctx.restore();
  }

  if (age > 720 && hold > 0) {
    ctx.fillStyle = leftWins ? "#a4ebff" : "#ffaea5";
    ctx.font = `800 ${Math.max(12, size * 0.044)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.globalAlpha = clamp((age - 720) / 300, 0, 1) * hold;
    ctx.fillText(leftWins ? "PLAYER ONE WINS" : "PLAYER TWO WINS", w * 0.5, h * 0.79);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
