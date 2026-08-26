import { clamp, hash, lerp, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules } from "../../../shared/fighter-library.js";

const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function easeOutCubic(value) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
}

function pulseAt(age, start, duration) {
  const progress = clamp((age - start) / duration, 0, 1);
  return Math.sin(progress * Math.PI);
}

function drawArena(ctx, w, h, t, intensity, shakeX, shakeY) {
  ctx.save();
  ctx.translate(shakeX, shakeY);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#070c18");
  sky.addColorStop(0.56, "#14243b");
  sky.addColorStop(1, "#090b12");
  ctx.fillStyle = sky;
  ctx.fillRect(-18, -18, w + 36, h + 36);

  ctx.fillStyle = "rgba(91, 127, 166, 0.12)";
  for (let i = 0; i < 12; i += 1) {
    const buildingWidth = w * (0.05 + hash(i * 2.4) * 0.07);
    const buildingHeight = h * (0.13 + hash(i * 6.8) * 0.23);
    const x = i * w * 0.095 - w * 0.04;
    ctx.fillRect(x, h * 0.69 - buildingHeight, buildingWidth, buildingHeight);
  }

  const floor = ctx.createLinearGradient(0, h * 0.68, 0, h);
  floor.addColorStop(0, "#172031");
  floor.addColorStop(1, "#06080d");
  ctx.fillStyle = floor;
  ctx.fillRect(-18, h * 0.68, w + 36, h * 0.34);
  ctx.strokeStyle = "rgba(105, 185, 222, 0.13)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) {
    const y = h * 0.7 + i * h * 0.04;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let i = 0; i < 11; i += 1) {
    const drift = (t * 0.02 * intensity + i * w * 0.13) % (w * 1.3);
    ctx.strokeStyle = `rgba(116, 224, 255, ${0.04 + hash(i) * 0.08})`;
    ctx.beginPath();
    ctx.moveTo(w - drift, h * 0.7);
    ctx.lineTo(w - drift - w * 0.15, h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStickCaster(ctx, x, y, size, charge, firing) {
  const lean = firing ? size * 0.08 : 0;
  ctx.save();
  ctx.translate(x + lean, y);
  ctx.strokeStyle = "#d8f7ff";
  ctx.fillStyle = "#071019";
  ctx.lineWidth = Math.max(2.5, size * 0.052);
  ctx.lineCap = "round";
  ctx.shadowColor = "#5de8ff";
  ctx.shadowBlur = 10 + charge * 18;
  ctx.beginPath();
  ctx.arc(0, -size * 0.52, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.37);
  ctx.lineTo(0, size * 0.06);
  ctx.moveTo(0, -size * 0.27);
  ctx.lineTo(size * 0.38, -size * 0.23);
  ctx.moveTo(0, -size * 0.23);
  ctx.lineTo(size * 0.35, -size * 0.16);
  ctx.moveTo(0, size * 0.04);
  ctx.lineTo(-size * 0.2, size * 0.43);
  ctx.moveTo(0, size * 0.04);
  ctx.lineTo(size * 0.23, size * 0.43);
  ctx.stroke();
  ctx.restore();
}

function drawCaster(ctx, fighter, x, y, size, charge, firing) {
  if (fighter !== "stick") {
    const pose = firing ? "attack" : "neutral";
    const image = getFighterImage(fighter, pose);
    if (drawFighterImage(ctx, image, {
      x,
      y,
      size: size * 1.55,
      facing: 1,
      glow: "#67e9ff",
      blur: 10 + charge * 20,
      anchorY: 0.73,
    })) return;
  }
  drawStickCaster(ctx, x, y, size, charge, firing);
}

function drawEnemy(ctx, x, y, size, phase, dissolve, marked) {
  const flicker = 0.82 + Math.sin(phase) * 0.08;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = (1 - dissolve) * flicker;
  ctx.strokeStyle = marked ? "#ffb15f" : "#8495ab";
  ctx.fillStyle = "#111620";
  ctx.lineWidth = Math.max(2, size * 0.055);
  ctx.shadowColor = marked ? "#ff6b3d" : "#3c536d";
  ctx.shadowBlur = marked ? 15 : 7;
  ctx.beginPath();
  ctx.arc(0, -size * 0.44, size * 0.12, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.3);
  ctx.lineTo(0, size * 0.11);
  ctx.moveTo(0, -size * 0.18);
  ctx.lineTo(-size * 0.2, size * 0.02);
  ctx.moveTo(0, -size * 0.18);
  ctx.lineTo(size * 0.24, -size * 0.04);
  ctx.moveTo(0, size * 0.1);
  ctx.lineTo(-size * 0.17, size * 0.42);
  ctx.moveTo(0, size * 0.1);
  ctx.lineTo(size * 0.18, size * 0.42);
  ctx.stroke();

  if (marked && dissolve < 0.92) {
    ctx.strokeStyle = `rgba(255, 177, 95, ${0.55 * (1 - dissolve)})`;
    ctx.lineWidth = 1;
    const bracket = size * 0.32;
    ctx.strokeRect(-bracket, -size * 0.7, bracket * 2, size * 1.18);
  }
  ctx.restore();

  if (dissolve > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 10; i += 1) {
      const angle = hash(i * 6.7 + x) * TAU;
      const distance = dissolve * size * (0.2 + hash(i * 4.2) * 0.85);
      ctx.fillStyle = `rgba(255, ${130 + hash(i) * 100}, 70, ${dissolve * (1 - dissolve)})`;
      ctx.fillRect(x + Math.cos(angle) * distance, y - size * 0.2 + Math.sin(angle) * distance, 2 + hash(i) * 3, 2);
    }
    ctx.restore();
  }
}

function drawCharge(ctx, x, y, size, t, charge) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 22; i += 1) {
    const angle = hash(i * 4.8) * TAU + t * 0.001 * (i % 2 ? 1 : -1);
    const distance = size * (0.11 + (1 - charge) * (0.2 + hash(i) * 0.3));
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance;
    ctx.fillStyle = `rgba(${i % 3 ? "86, 224, 255" : "255, 221, 124"}, ${0.15 + charge * 0.7})`;
    ctx.beginPath();
    ctx.arc(px, py, 1 + charge * 2.2, 0, TAU);
    ctx.fill();
  }
  const core = ctx.createRadialGradient(x, y, 0, x, y, size * 0.13);
  core.addColorStop(0, `rgba(255, 255, 255, ${0.7 + charge * 0.3})`);
  core.addColorStop(0.2, `rgba(104, 235, 255, ${0.55 + charge * 0.4})`);
  core.addColorStop(1, "rgba(67, 126, 255, 0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, size * (0.055 + charge * 0.065), 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawBeam(ctx, originX, originY, w, h, targetY, age, intensity, beamAlpha) {
  const sweep = easeOutCubic((age - 930) / 760);
  const currentTargetY = targetY + lerp(-h * 0.11, h * 0.08, sweep);
  const angle = Math.atan2(currentTargetY - originY, w - originX);
  const length = Math.hypot(w - originX, currentTargetY - originY) + w * 0.18;
  const beamWidth = Math.min(w, h) * (0.105 + intensity * 0.035);

  ctx.save();
  ctx.translate(originX, originY);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = beamAlpha;
  ctx.shadowColor = "#65dcff";
  ctx.shadowBlur = beamWidth * 0.85;

  const outer = ctx.createLinearGradient(0, -beamWidth, 0, beamWidth);
  outer.addColorStop(0, "rgba(42, 95, 255, 0)");
  outer.addColorStop(0.22, "rgba(74, 181, 255, 0.56)");
  outer.addColorStop(0.5, "rgba(232, 253, 255, 0.98)");
  outer.addColorStop(0.78, "rgba(116, 104, 255, 0.54)");
  outer.addColorStop(1, "rgba(94, 75, 255, 0)");
  ctx.fillStyle = outer;
  ctx.fillRect(0, -beamWidth, length, beamWidth * 2);

  ctx.shadowBlur = beamWidth * 0.35;
  ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
  ctx.fillRect(0, -beamWidth * 0.16, length, beamWidth * 0.32);
  ctx.restore();
  return currentTargetY;
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const cycle = 4100;
  const manualAge = state.custom.lastCast ? state.now - state.custom.lastCast : Infinity;
  const age = manualAge < cycle ? manualAge : t % cycle;
  const charge = easeOutCubic(age / 720);
  const lock = clamp((age - 430) / 330, 0, 1) * (1 - clamp((age - 1060) / 180, 0, 1));
  const beamIn = easeOutCubic((age - 880) / 130);
  const beamOut = 1 - easeOutCubic((age - 1980) / 430);
  const beamAlpha = clamp(beamIn * beamOut, 0, 1);
  const impact = pulseAt(age, 930, 260) + pulseAt(age, 1370, 300) * 0.72;
  const dissolve = clamp((age - 1180) / 920, 0, 1);
  const clearLabel = clamp((age - 1840) / 240, 0, 1) * (1 - clamp((age - 3150) / 500, 0, 1));
  const targetY = state.custom.y ? clamp(state.custom.y, h * 0.32, h * 0.65) : h * 0.48;
  const originX = w * 0.285;
  const originY = h * 0.57;
  const shake = beamAlpha * impact * size * 0.018 * intensity;
  const shakeX = Math.sin(state.now * 0.59) * shake;
  const shakeY = Math.cos(state.now * 0.47) * shake * 0.55;

  drawArena(ctx, w, h, t, intensity, shakeX, shakeY);
  ctx.save();
  ctx.translate(shakeX, shakeY);

  ctx.fillStyle = `rgba(38, 219, 255, ${0.08 + lock * 0.12})`;
  ctx.fillRect(0, targetY - 1, w, 2);
  ctx.strokeStyle = `rgba(255, 179, 88, ${lock * 0.85})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(w * 0.9, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  const enemyData = [
    [0.68, -0.02, 0.15],
    [0.79, 0.05, 0.18],
    [0.89, -0.055, 0.14],
  ];
  enemyData.forEach(([x, yOffset, scale], index) => {
    drawEnemy(ctx, w * x, h * 0.75 + h * yOffset, size * scale, t * 0.006 + index, dissolve, lock > 0.15);
  });

  const firing = beamAlpha > 0.02;
  drawCaster(ctx, state.custom.fighter || "stick", w * 0.18, h * 0.77, size * 0.34, charge, firing);
  drawCharge(ctx, originX, originY, size, t, charge * (1 - beamIn * 0.72));

  let beamY = targetY;
  if (beamAlpha > 0) {
    beamY = drawBeam(ctx, originX, originY, w, h, targetY, age, intensity, beamAlpha);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const hitX = w * 0.79;
    const burst = ctx.createRadialGradient(hitX, beamY, 0, hitX, beamY, size * (0.13 + impact * 0.18));
    burst.addColorStop(0, `rgba(255, 255, 255, ${0.82 * beamAlpha})`);
    burst.addColorStop(0.25, `rgba(102, 226, 255, ${0.72 * beamAlpha})`);
    burst.addColorStop(0.58, `rgba(255, 128, 68, ${impact * 0.54})`);
    burst.addColorStop(1, "rgba(54, 88, 255, 0)");
    ctx.fillStyle = burst;
    ctx.fillRect(hitX - size * 0.35, beamY - size * 0.35, size * 0.7, size * 0.7);
    for (let i = 0; i < 28; i += 1) {
      const angle = hash(i * 7.2) * TAU;
      const distance = size * (0.05 + impact * (0.16 + hash(i) * 0.24));
      ctx.fillStyle = `rgba(255, ${145 + hash(i * 2.1) * 90}, 75, ${beamAlpha * (0.4 + impact * 0.6)})`;
      ctx.fillRect(hitX + Math.cos(angle) * distance, beamY + Math.sin(angle) * distance, 2 + hash(i) * 5, 2);
    }
    ctx.restore();
  }

  if (beamAlpha > 0.2) {
    ctx.save();
    ctx.globalAlpha = beamAlpha;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff3b0";
    ctx.shadowColor = "#ff653c";
    ctx.shadowBlur = 12;
    ctx.font = `900 ${Math.max(16, size * 0.052)}px system-ui, sans-serif`;
    ctx.fillText("9999", w * 0.79, beamY - size * 0.16);
    ctx.restore();
  }

  ctx.fillStyle = "rgba(235, 249, 255, 0.9)";
  ctx.font = `800 ${Math.max(10, size * 0.027)}px ui-monospace, monospace`;
  ctx.textAlign = "left";
  const phaseLabel = age < 720 ? "ULTIMATE // CHARGING" : age < 1000 ? "TARGET // LOCKED" : age < 2050 ? "BEAM // SWEEPING" : "SYSTEM // COOLING";
  ctx.fillText(phaseLabel, w * 0.05, h * 0.09);

  const meterWidth = Math.min(w * 0.29, 190);
  ctx.fillStyle = "rgba(117, 164, 201, 0.18)";
  ctx.fillRect(w * 0.05, h * 0.115, meterWidth, 4);
  ctx.fillStyle = age < 880 ? "#6ce8ff" : "#ffbf62";
  ctx.fillRect(w * 0.05, h * 0.115, meterWidth * (age < 880 ? charge : beamOut), 4);

  if (clearLabel > 0) {
    ctx.save();
    ctx.globalAlpha = clearLabel;
    ctx.textAlign = "right";
    ctx.fillStyle = "#f6fbff";
    ctx.font = `900 ${Math.max(19, size * 0.06)}px system-ui, sans-serif`;
    ctx.fillText("AREA CLEARED", w * 0.94, h * 0.2);
    ctx.font = `700 ${Math.max(9, size * 0.022)}px ui-monospace, monospace`;
    ctx.fillStyle = "#74e8ff";
    ctx.fillText("ULTIMATE IMPACT CONFIRMED", w * 0.94, h * 0.235);
    ctx.restore();
  }
  ctx.restore();
}
