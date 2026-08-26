import { clamp, hash, lerp, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules } from "../../../shared/fighter-library.js";

const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function easeOutCubic(value) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
}

function quadraticPoint(start, control, end, progress) {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
    y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
  };
}

function getProjectilePoint(age, start, apex, hit) {
  if (age <= 650) {
    return quadraticPoint(start, { x: start.x + (apex.x - start.x) * 0.5, y: apex.y - 42 }, apex, easeOutCubic(age / 650));
  }
  return quadraticPoint(apex, { x: apex.x + 30, y: apex.y - 82 }, hit, easeOutCubic((age - 650) / 540));
}

function drawArena(ctx, w, h) {
  const background = ctx.createLinearGradient(0, 0, 0, h);
  background.addColorStop(0, "#100c18");
  background.addColorStop(0.62, "#211225");
  background.addColorStop(1, "#08090e");
  ctx.fillStyle = background;
  ctx.fillRect(-16, -16, w + 32, h + 32);

  ctx.fillStyle = "rgba(151, 91, 154, 0.08)";
  for (let i = 0; i < 8; i += 1) {
    const x = i * w * 0.15 - w * 0.05;
    const height = h * (0.1 + hash(i * 4.7) * 0.21);
    ctx.fillRect(x, h * 0.7 - height, w * 0.09, height);
  }

  ctx.fillStyle = "rgba(5, 7, 12, 0.72)";
  ctx.fillRect(-16, h * 0.7, w + 32, h * 0.32);
  ctx.strokeStyle = "rgba(207, 153, 214, 0.12)";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.7);
  ctx.lineTo(w, h * 0.7);
  ctx.stroke();
}

function drawStickCaster(ctx, x, y, size, phase, hit) {
  const recoil = hit * size * 0.12;
  ctx.save();
  ctx.translate(x - recoil, y);
  ctx.rotate(-hit * 0.14);
  ctx.strokeStyle = hit > 0.1 ? "#ff8b95" : "#f6dc8d";
  ctx.fillStyle = "#0c0d13";
  ctx.lineWidth = Math.max(2.5, size * 0.052);
  ctx.lineCap = "round";
  ctx.shadowColor = hit > 0.1 ? "#ff405f" : "#efbe53";
  ctx.shadowBlur = 9 + hit * 22;
  ctx.beginPath();
  ctx.arc(0, -size * 0.5, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.35);
  ctx.lineTo(0, size * 0.08);
  ctx.moveTo(0, -size * 0.24);
  ctx.lineTo(size * (0.34 - hit * 0.18), -size * (0.2 + hit * 0.12));
  ctx.moveTo(0, -size * 0.2);
  ctx.lineTo(-size * 0.2, -size * 0.02);
  ctx.moveTo(0, size * 0.06);
  ctx.lineTo(-size * 0.2, size * 0.42);
  ctx.moveTo(0, size * 0.06);
  ctx.lineTo(size * 0.22, size * (0.4 - hit * 0.08));
  ctx.stroke();
  ctx.restore();
}

function drawCaster(ctx, fighter, x, y, size, age, hit) {
  if (fighter !== "stick") {
    const pose = hit > 0.08 ? "hurt" : age < 1120 ? "attack" : "neutral";
    const image = getFighterImage(fighter, pose);
    if (drawFighterImage(ctx, image, {
      x: x - hit * size * 0.1,
      y,
      size: size * 1.55,
      facing: 1,
      rotation: -hit * 0.08,
      glow: hit > 0.08 ? "#ff4f6d" : "#efc35e",
      blur: 10 + hit * 18,
      anchorY: 0.73,
    })) return;
  }
  drawStickCaster(ctx, x, y, size, age * 0.01, hit);
}

function drawTargetDummy(ctx, x, y, size, fade) {
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.strokeStyle = "#6b7c91";
  ctx.lineWidth = Math.max(2, size * 0.045);
  ctx.setLineDash([4, 6]);
  ctx.strokeRect(x - size * 0.3, y - size * 0.68, size * 0.6, size * 1.12);
  ctx.setLineDash([]);
  ctx.fillStyle = "#111720";
  ctx.beginPath();
  ctx.arc(x, y - size * 0.42, size * 0.12, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x - size * 0.1, y - size * 0.27, size * 0.2, size * 0.4, size * 0.05);
  ctx.fill();
  ctx.fillStyle = "rgba(180, 202, 225, 0.72)";
  ctx.font = `700 ${Math.max(8, size * 0.1)}px ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.fillText("TARGET", x, y + size * 0.31);
  ctx.restore();
}

function drawTrail(ctx, age, start, apex, hit, color) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 11; i >= 0; i -= 1) {
    const sampleAge = Math.max(0, age - i * 28);
    if (sampleAge > 1190) continue;
    const point = getProjectilePoint(sampleAge, start, apex, hit);
    const alpha = (1 - i / 12) * 0.55;
    ctx.fillStyle = color.replace("ALPHA", alpha.toFixed(3));
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2 + (11 - i) * 0.45, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawImpact(ctx, point, size, progress, intensity) {
  if (progress <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const burst = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * (0.08 + progress * 0.19));
  burst.addColorStop(0, `rgba(255, 255, 255, ${0.92 * progress})`);
  burst.addColorStop(0.25, `rgba(255, 91, 116, ${0.82 * progress})`);
  burst.addColorStop(1, "rgba(255, 37, 77, 0)");
  ctx.fillStyle = burst;
  ctx.fillRect(point.x - size * 0.3, point.y - size * 0.3, size * 0.6, size * 0.6);
  for (let i = 0; i < Math.floor(20 * intensity); i += 1) {
    const angle = hash(i * 5.3) * TAU;
    const distance = size * progress * (0.08 + hash(i * 7.9) * 0.25);
    ctx.fillStyle = `rgba(255, ${60 + hash(i) * 100}, 92, ${progress})`;
    ctx.fillRect(point.x + Math.cos(angle) * distance, point.y + Math.sin(angle) * distance, 2 + hash(i) * 4, 2);
  }
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const cycle = 3300;
  const manualAge = state.custom.lastAnswer ? state.now - state.custom.lastAnswer : Infinity;
  const age = manualAge < cycle ? manualAge : t % cycle;
  const verdictIn = easeOutCubic((age - 430) / 150);
  const verdictOut = 1 - easeOutCubic((age - 2320) / 420);
  const verdict = clamp(verdictIn * verdictOut, 0, 1);
  const returnProgress = clamp((age - 650) / 540, 0, 1);
  const impactProgress = Math.sin(clamp((age - 1110) / 480, 0, 1) * Math.PI);
  const damageProgress = easeOutCubic((age - 1120) / 300);
  const shake = impactProgress * size * 0.018 * intensity;
  const shakeX = Math.sin(state.now * 0.61) * shake;
  const shakeY = Math.cos(state.now * 0.47) * shake * 0.55;
  const casterX = w * 0.24;
  const casterY = h * 0.76;
  const start = { x: w * 0.315, y: h * 0.56 };
  const apex = { x: w * 0.57, y: h * 0.37 };
  const hitPoint = { x: w * 0.245, y: h * 0.56 };

  drawArena(ctx, w, h);
  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawTargetDummy(ctx, w * 0.8, h * 0.72, size * 0.22, 0.45 - returnProgress * 0.22);

  const healthWidth = Math.min(w * 0.28, 180);
  const healthX = w * 0.1;
  const healthY = h * 0.16;
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(healthX, healthY, healthWidth, 7);
  ctx.fillStyle = damageProgress > 0 ? "#ff526d" : "#efc75f";
  ctx.fillRect(healthX, healthY, healthWidth * lerp(0.74, 0.5, damageProgress), 7);
  ctx.fillStyle = "rgba(244, 235, 244, 0.82)";
  ctx.font = `700 ${Math.max(9, size * 0.024)}px ui-monospace, monospace`;
  ctx.textAlign = "left";
  ctx.fillText("PLAYER HP", healthX, healthY - 9);

  const hitPose = clamp((age - 1080) / 240, 0, 1) * (1 - clamp((age - 1860) / 420, 0, 1));
  drawCaster(ctx, state.custom.fighter || "stick", casterX, casterY, size * 0.35, age, hitPose);

  if (age < 1230) {
    const projectile = getProjectilePoint(age, start, apex, hitPoint);
    const returning = age >= 650;
    drawTrail(ctx, age, start, apex, hitPoint, returning ? "rgba(255, 76, 108, ALPHA)" : "rgba(255, 220, 104, ALPHA)");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = returning ? "#ff355f" : "#ffd968";
    ctx.shadowBlur = size * 0.07;
    ctx.fillStyle = returning ? "#ff6b82" : "#fff1a6";
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, size * (0.018 + returnProgress * 0.008), 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  if (verdict > 0) {
    ctx.save();
    ctx.translate(apex.x, apex.y - size * 0.12);
    ctx.scale(0.82 + verdict * 0.18, 0.82 + verdict * 0.18);
    ctx.globalAlpha = verdict;
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff6b7e";
    ctx.shadowColor = "#ff264f";
    ctx.shadowBlur = 16;
    ctx.font = `900 ${Math.max(20, size * 0.066)}px system-ui, sans-serif`;
    ctx.fillText("WRONG", 0, 0);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 221, 226, 0.88)";
    ctx.font = `700 ${Math.max(9, size * 0.023)}px ui-monospace, monospace`;
    ctx.fillText("ATTACK REVERSED", 0, size * 0.052);
    ctx.restore();
  }

  drawImpact(ctx, hitPoint, size, impactProgress, intensity);
  if (damageProgress > 0 && age < 2250) {
    ctx.save();
    ctx.globalAlpha = 1 - clamp((age - 1700) / 550, 0, 1);
    ctx.fillStyle = "#ff8091";
    ctx.shadowColor = "#ff294f";
    ctx.shadowBlur = 12;
    ctx.font = `900 ${Math.max(19, size * 0.06)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("-24", casterX + size * 0.04, casterY - size * 0.47 - damageProgress * size * 0.09);
    ctx.restore();
  }

  ctx.fillStyle = "rgba(244, 235, 244, 0.78)";
  ctx.font = `800 ${Math.max(9, size * 0.025)}px ui-monospace, monospace`;
  ctx.textAlign = "right";
  const status = age < 430 ? "ANSWER SUBMITTED" : age < 1110 ? "WRONG ANSWER" : "SELF DAMAGE";
  ctx.fillText(status, w * 0.94, h * 0.1);
  ctx.restore();
}
