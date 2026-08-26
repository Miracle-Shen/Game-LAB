import { clamp, hash, lerp, TAU } from "../../../shared/canvas.js";

const assetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const assetUrls = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.split("/").pop().replace(".png", ""), url]),
);
const imageCache = new Map();

function getImage(key) {
  const src = assetUrls[key];
  if (!src || typeof Image === "undefined") return null;
  if (!imageCache.has(key)) {
    const image = new Image();
    image.src = src;
    imageCache.set(key, image);
  }
  return imageCache.get(key);
}

function easeInOut(value) {
  const progress = clamp(value, 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function pulseAt(age, start, duration) {
  return Math.sin(clamp((age - start) / duration, 0, 1) * Math.PI);
}

function drawCover(ctx, image, w, h) {
  if (!image?.complete || !image.naturalWidth) return false;
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const sourceW = w / scale;
  const sourceH = h / scale;
  ctx.drawImage(image, (image.naturalWidth - sourceW) * 0.5, image.naturalHeight - sourceH, sourceW, sourceH, 0, 0, w, h);
  return true;
}

function drawStickRunner(ctx, x, y, size, moving, detected, t) {
  const stride = moving ? Math.sin(t * 0.019) * size * 0.2 : 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(detected * -0.06);
  ctx.fillStyle = "#0b1114";
  ctx.strokeStyle = detected > 0.05 ? "#ff7180" : "#eef8f3";
  ctx.lineWidth = Math.max(2.5, size * 0.058);
  ctx.lineCap = "round";
  ctx.shadowColor = detected > 0.05 ? "#ff2949" : "#9cfff0";
  ctx.shadowBlur = 8 + detected * 18;
  ctx.beginPath();
  ctx.arc(0, -size * 0.5, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.35);
  ctx.lineTo(0, size * 0.08);
  ctx.moveTo(0, -size * 0.22);
  ctx.lineTo(size * 0.22 + stride * 0.4, -size * 0.05);
  ctx.moveTo(0, -size * 0.2);
  ctx.lineTo(-size * 0.18 - stride * 0.35, 0);
  ctx.moveTo(0, size * 0.06);
  ctx.lineTo(size * 0.2 + stride, size * 0.42);
  ctx.moveTo(0, size * 0.06);
  ctx.lineTo(-size * 0.2 - stride, size * 0.42);
  ctx.stroke();
  ctx.restore();
}

function drawAssetRunner(ctx, runner, x, y, size, moving, detected, t) {
  const pose = moving ? `run_0${Math.floor(t / 145) % 2 + 1}` : "idle_01";
  const image = getImage(`${runner}_${pose}`);
  if (!image?.complete || !image.naturalWidth) return false;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(detected * -0.035);
  ctx.shadowColor = detected > 0.05 ? "#ff2949" : "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 8 + detected * 20;
  ctx.drawImage(image, -size * 0.5, -size * 0.8, size, size);
  ctx.restore();
  return true;
}

function drawScanner(ctx, x, y, size, scanX, scanAlpha, detected) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const cone = ctx.createLinearGradient(scanX, 0, x, 0);
  cone.addColorStop(0, "rgba(255, 48, 78, 0)");
  cone.addColorStop(1, `rgba(255, 54, 79, ${scanAlpha * 0.28})`);
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(scanX, y - size * 0.58);
  ctx.lineTo(scanX, y + size * 1.08);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 104, 121, ${scanAlpha * 0.9})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(scanX, y - size * 0.58);
  ctx.lineTo(scanX, y + size * 1.08);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#141921";
  ctx.strokeStyle = detected > 0.05 ? "#ff7181" : "#b7c2ce";
  ctx.lineWidth = Math.max(2, size * 0.035);
  ctx.shadowColor = "#ff3152";
  ctx.shadowBlur = detected * 18;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-size * 0.12, size * 0.1);
  ctx.lineTo(-size * 0.22, size * 0.32);
  ctx.lineTo(size * 0.16, size * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawDetection(ctx, x, y, size, detected) {
  if (detected <= 0) return;
  ctx.save();
  ctx.globalAlpha = detected;
  ctx.strokeStyle = "#ff6176";
  ctx.lineWidth = Math.max(2, size * 0.012);
  const boxWidth = size * 0.28;
  const boxHeight = size * 0.46;
  ctx.strokeRect(x - boxWidth * 0.5, y - boxHeight * 0.82, boxWidth, boxHeight);
  const corner = size * 0.055;
  ctx.lineWidth *= 2;
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const cornerX = x + sx * boxWidth * 0.5;
    const cornerY = y - boxHeight * 0.32 + sy * boxHeight * 0.5;
    ctx.beginPath();
    ctx.moveTo(cornerX, cornerY - sy * corner);
    ctx.lineTo(cornerX, cornerY);
    ctx.lineTo(cornerX - sx * corner, cornerY);
    ctx.stroke();
  }
  ctx.fillStyle = "#ff7486";
  ctx.shadowColor = "#ff294c";
  ctx.shadowBlur = 14;
  ctx.font = `900 ${Math.max(14, size * 0.048)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("MOTION DETECTED", x, y - size * 0.52);
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const cycle = 3200;
  const manualAge = state.custom.lastScan ? state.now - state.custom.lastScan : Infinity;
  const age = manualAge < cycle ? manualAge : t % cycle;
  const scanProgress = easeInOut((age - 300) / 1050);
  const detected = easeInOut((age - 990) / 170) * (1 - easeInOut((age - 2700) / 380));
  const impact = pulseAt(age, 990, 360);
  const moving = age < 1040;
  const runnerX = w > 700 ? w * 0.56 : w * 0.42;
  const runnerY = h * (w > 700 ? 0.77 : 0.64);
  const scannerX = w * 0.88;
  const scannerY = h * 0.25;
  const scanX = lerp(w * 0.81, w * 0.18, scanProgress);
  const shake = impact * size * 0.009 * intensity;
  const shakeX = Math.sin(state.now * 0.55) * shake;

  const background = getImage("field_bg");
  if (!drawCover(ctx, background, w, h)) {
    ctx.fillStyle = "#bce7e5";
    ctx.fillRect(0, 0, w, h * 0.52);
    ctx.fillStyle = "#d8aa78";
    ctx.fillRect(0, h * 0.52, w, h * 0.48);
  }
  ctx.fillStyle = `rgba(36, 5, 16, ${0.27 + scanProgress * 0.2})`;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(shakeX, 0);
  drawScanner(ctx, scannerX, scannerY, size * 0.42, scanX, 0.72 + intensity * 0.2, detected);

  if (moving) {
    ctx.strokeStyle = "rgba(240, 250, 245, 0.24)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i += 1) {
      const lineY = runnerY - size * (0.2 + hash(i) * 0.2);
      ctx.beginPath();
      ctx.moveTo(runnerX - size * (0.15 + i * 0.045), lineY);
      ctx.lineTo(runnerX - size * (0.06 + i * 0.035), lineY);
      ctx.stroke();
    }
  }

  const runner = state.custom.runner || "stick";
  const runnerSize = size * 0.31;
  if (runner === "stick" || !drawAssetRunner(ctx, runner, runnerX, runnerY, runnerSize * 1.35, moving, detected, t)) {
    drawStickRunner(ctx, runnerX, runnerY, runnerSize, moving, detected, t);
  }
  drawDetection(ctx, runnerX, runnerY, size, detected);

  const signalX = w * 0.08;
  const signalY = h * (w > 700 ? 0.11 : 0.25);
  ctx.fillStyle = "rgba(30, 6, 13, 0.72)";
  ctx.beginPath();
  ctx.arc(signalX, signalY, size * 0.044, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#ff4a64";
  ctx.shadowColor = "#ff294b";
  ctx.shadowBlur = 14 + intensity * 8;
  ctx.beginPath();
  ctx.arc(signalX, signalY, size * 0.026, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255, 235, 238, 0.88)";
  ctx.font = `800 ${Math.max(9, size * 0.025)}px ui-monospace, monospace`;
  ctx.textAlign = "left";
  ctx.fillText("RED LIGHT", signalX + size * 0.055, signalY + size * 0.009);

  const status = age < 300 ? "STOP" : detected > 0.05 ? "MOVEMENT VIOLATION" : "SCANNING";
  ctx.fillStyle = detected > 0.05 ? "#ff7183" : "rgba(238, 246, 247, 0.76)";
  ctx.textAlign = w > 700 ? "right" : "center";
  ctx.fillText(status, w > 700 ? w * 0.94 : scannerX, w > 700 ? h * 0.1 : scannerY + size * 0.22);

  if (impact > 0) {
    ctx.fillStyle = `rgba(255, 55, 81, ${impact * 0.17})`;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}
