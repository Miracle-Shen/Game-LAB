import { clamp, hash, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules } from "../../../shared/fighter-library.js";

export const PARRY_CYCLE = 2600;
const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function drawFighter(ctx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "#0b111b";
  ctx.strokeStyle = "rgba(211, 232, 255, 0.78)";
  ctx.lineWidth = Math.max(1.5, scale * 0.025);
  ctx.beginPath();
  ctx.arc(0, -scale * 0.42, scale * 0.15, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -scale * 0.26);
  ctx.lineTo(0, scale * 0.32);
  ctx.moveTo(0, -scale * 0.02);
  ctx.lineTo(-scale * 0.28, scale * 0.16);
  ctx.moveTo(0, -scale * 0.02);
  ctx.lineTo(scale * 0.24, scale * 0.1);
  ctx.moveTo(0, scale * 0.3);
  ctx.lineTo(-scale * 0.18, scale * 0.58);
  ctx.moveTo(0, scale * 0.3);
  ctx.lineTo(scale * 0.2, scale * 0.58);
  ctx.stroke();
  ctx.restore();
}

function drawSelectedFighter(ctx, fighter, cx, cy, size, result, resultAge) {
  const pose = resultAge < 900
    ? result === "miss" ? "hurt" : result === "idle" ? "neutral" : "attack"
    : "neutral";
  const image = getFighterImage(fighter, pose);
  if (!drawFighterImage(ctx, image, {
    x: cx,
    y: cy,
    size: size * 0.38,
    glow: result === "perfect" && resultAge < 900 ? "#ffe08a" : "#8bceff",
    blur: resultAge < 900 ? 18 : 8,
  })) {
    drawFighter(ctx, cx, cy, size * 0.17);
  }
}

function drawShield(ctx, cx, cy, radius, glow) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = `rgba(11, 20, 31, ${0.9 - glow * 0.15})`;
  ctx.strokeStyle = glow > 0.5 ? "#ffe08a" : "rgba(139, 206, 255, 0.82)";
  ctx.lineWidth = 2 + glow * 4;
  ctx.shadowColor = glow > 0.5 ? "#ffb638" : "#4ea9ff";
  ctx.shadowBlur = 12 + glow * 26;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + i * TAU / 6;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const resultAge = state.custom.resultTime ? state.now - state.custom.resultTime : Infinity;
  const missShake = state.custom.result === "miss" && resultAge < 360 ? (1 - resultAge / 360) * 8 : 0;
  ctx.save();
  ctx.translate(Math.sin(resultAge * 0.19) * missShake, Math.cos(resultAge * 0.15) * missShake * 0.45);
  const background = ctx.createLinearGradient(0, 0, 0, h);
  background.addColorStop(0, "#080b13");
  background.addColorStop(0.62, "#101725");
  background.addColorStop(1, "#1d1217");
  ctx.fillStyle = background;
  ctx.fillRect(-12, -12, w + 24, h + 24);

  const cx = w * 0.5;
  const cy = h * 0.62;
  const size = Math.min(w, h);
  const phase = (t % PARRY_CYCLE) / PARRY_CYCLE;
  const danger = clamp((phase - 0.08) / 0.68, 0, 1);
  const windowGlow = Math.max(0, 1 - Math.abs(phase - 0.74) / 0.105);
  const incomingRadius = size * (0.43 - danger * 0.3);

  ctx.strokeStyle = "rgba(201, 218, 242, 0.07)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = h * (0.74 + i * 0.075);
    ctx.beginPath();
    ctx.moveTo(w * (0.12 - i * 0.03), y);
    ctx.lineTo(w * (0.88 + i * 0.03), y);
    ctx.stroke();
  }

  const overheadY = h * (0.2 + danger * 0.23);
  ctx.save();
  ctx.translate(cx, overheadY);
  ctx.rotate(-0.8 + danger * 1.65);
  ctx.strokeStyle = `rgba(255, 91, 80, ${0.4 + danger * 0.6})`;
  ctx.lineWidth = Math.max(5, size * 0.035);
  ctx.lineCap = "round";
  ctx.shadowColor = "#ff3d42";
  ctx.shadowBlur = 12 + danger * 22;
  ctx.beginPath();
  ctx.moveTo(-size * 0.15, 0);
  ctx.lineTo(size * 0.16, 0);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 232, 220, 0.95)";
  ctx.lineWidth = Math.max(1, size * 0.007);
  ctx.stroke();
  ctx.restore();

  drawSelectedFighter(ctx, state.custom.fighter, cx, cy + size * 0.12, size, state.custom.result, resultAge);
  drawShield(ctx, cx, cy, size * 0.085, windowGlow);

  ctx.strokeStyle = windowGlow > 0.15
    ? `rgba(255, 211, 94, ${0.3 + windowGlow * 0.7})`
    : `rgba(255, 79, 82, ${0.2 + danger * 0.6})`;
  ctx.lineWidth = 1.5 + windowGlow * 4;
  ctx.setLineDash([size * 0.035, size * 0.022]);
  ctx.lineDashOffset = -t * 0.025;
  ctx.beginPath();
  ctx.arc(cx, cy, incomingRadius, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);

  const resultPower = clamp(1 - resultAge / 900, 0, 1);
  if (resultPower > 0 && state.custom.result !== "miss") {
    const perfect = state.custom.result === "perfect";
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.45);
    flash.addColorStop(0, `rgba(255, 250, 220, ${resultPower * 0.88})`);
    flash.addColorStop(0.13, `rgba(${perfect ? "255, 185, 45" : "77, 185, 255"}, ${resultPower * 0.52})`);
    flash.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = flash;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = `rgba(255, 232, 151, ${resultPower})`;
    ctx.lineWidth = 2 + resultPower * 5 * intensity;
    ctx.beginPath();
    ctx.arc(cx, cy, size * (0.08 + (1 - resultPower) * 0.42), 0, TAU);
    ctx.stroke();
    for (let i = 0; i < 34 * intensity; i++) {
      const angle = hash(i * 7.3) * TAU;
      const travel = (1 - resultPower) * size * (0.2 + hash(i) * 0.38);
      ctx.fillStyle = `rgba(255, ${175 + hash(i) * 75}, 95, ${resultPower})`;
      ctx.fillRect(cx + Math.cos(angle) * travel, cy + Math.sin(angle) * travel, 1.5 + hash(i * 2.1) * 3, 1.5);
    }
    ctx.restore();
  }

  if (resultPower > 0.08) {
    const labels = { perfect: "PERFECT", block: "BLOCK", miss: "MISS" };
    ctx.fillStyle = state.custom.result === "miss" ? "#ff5b62" : state.custom.result === "perfect" ? "#ffe38b" : "#9bd9ff";
    ctx.font = `800 ${Math.max(17, size * 0.085)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = clamp(resultPower * 1.5, 0, 1);
    ctx.fillText(labels[state.custom.result], cx, h * 0.25 - (1 - resultPower) * 18);
    if (state.custom.streak > 1) {
      ctx.font = `700 ${Math.max(10, size * 0.035)}px system-ui, sans-serif`;
      ctx.fillText(`x${state.custom.streak}`, cx, h * 0.32);
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
