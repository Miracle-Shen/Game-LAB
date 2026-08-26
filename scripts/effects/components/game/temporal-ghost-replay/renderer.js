import { clamp, fract, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules } from "../../../shared/fighter-library.js";

const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function drawRunner(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.09);
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, -size * 0.42, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.27);
  ctx.lineTo(0, size * 0.1);
  ctx.lineTo(-size * 0.22, size * 0.43);
  ctx.moveTo(0, size * 0.08);
  ctx.lineTo(size * 0.24, size * 0.38);
  ctx.moveTo(0, -size * 0.12);
  ctx.lineTo(size * 0.28, size * 0.03);
  ctx.stroke();
  ctx.restore();
}

function drawSelectedRunner(ctx, fighter, x, y, size, color, alpha) {
  const image = getFighterImage(fighter, "neutral");
  if (!drawFighterImage(ctx, image, {
    x,
    y,
    size: size * 2.3,
    alpha,
    glow: color,
    blur: 10,
    anchorY: 0.62,
  })) {
    drawRunner(ctx, x, y, size, color, alpha);
  }
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const manual = state.custom.lastRewind && state.now - state.custom.lastRewind < 4500;
  const age = manual ? state.now - state.custom.lastRewind : t % 3600;
  const progress = fract(t / 3600);
  const loops = state.custom.loops || 1;

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#071429");
  bg.addColorStop(1, "#101026");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(112,195,255,0.1)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += size * 0.09) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += size * 0.09) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  ctx.strokeStyle = "rgba(111,217,255,0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 60; i += 1) {
    const p = i / 60;
    const x = w * (0.12 + p * 0.76);
    const y = h * (0.58 + Math.sin(p * TAU * 1.35) * 0.16);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const colors = ["#7feaff", "#8f8cff", "#ff7ec8", "#ffd66e"];
  for (let i = loops - 1; i >= 0; i -= 1) {
    const p = fract(progress - (i + 1) * 0.095);
    const x = w * (0.12 + p * 0.76);
    const y = h * (0.58 + Math.sin(p * TAU * 1.35) * 0.16);
    drawSelectedRunner(ctx, state.custom.fighter, x, y, size * 0.13, colors[i], 0.22 + i * 0.08);
  }
  const x = w * (0.12 + progress * 0.76);
  const y = h * (0.58 + Math.sin(progress * TAU * 1.35) * 0.16);
  drawSelectedRunner(ctx, state.custom.fighter, x, y, size * 0.14, "#ffffff", 0.95);

  ctx.fillStyle = "rgba(3,8,21,0.76)";
  ctx.fillRect(w * 0.08, h * 0.84, w * 0.84, size * 0.045);
  ctx.fillStyle = "#69e7ff";
  ctx.fillRect(w * 0.08, h * 0.84, w * 0.84 * progress, size * 0.045);
  for (let i = 0; i <= 4; i += 1) {
    ctx.fillStyle = i < loops ? colors[i] : "rgba(255,255,255,0.2)";
    ctx.beginPath(); ctx.arc(w * (0.08 + i * 0.21), h * 0.862, size * 0.012, 0, TAU); ctx.fill();
  }

  if (age < 720) {
    const rewind = clamp(1 - age / 720, 0, 1);
    const scanX = w * clamp(age / 520, 0, 1);
    ctx.fillStyle = `rgba(152,246,255,${rewind * 0.15})`;
    ctx.fillRect(0, 0, scanX, h);
    const scan = ctx.createLinearGradient(scanX - size * 0.1, 0, scanX + size * 0.04, 0);
    scan.addColorStop(0, "rgba(91,223,255,0)");
    scan.addColorStop(1, `rgba(220,252,255,${rewind * 0.85})`);
    ctx.fillStyle = scan;
    ctx.fillRect(scanX - size * 0.1, 0, size * 0.14, h);
    ctx.fillStyle = `rgba(228,253,255,${rewind})`;
    ctx.font = `800 ${Math.max(13, size * 0.045)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("REWIND", w * 0.5, h * 0.17);
  }
}
