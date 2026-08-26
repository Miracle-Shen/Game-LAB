import { clamp, hash, lerp, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules } from "../../../shared/fighter-library.js";

const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function easeOutExpo(value) {
  return value >= 1 ? 1 : 1 - 2 ** (-10 * value);
}

function drawRunner(ctx, x, y, size, angle, alpha, color, ghost = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = ghost ? 15 : 22;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size * 0.22, -size * 0.24, size * 0.13, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.34, -size * 0.06);
  ctx.lineTo(-size * 0.28, -size * 0.2);
  ctx.lineTo(-size * 0.12, size * 0.04);
  ctx.lineTo(-size * 0.42, size * 0.25);
  ctx.lineTo(size * 0.03, size * 0.16);
  ctx.lineTo(size * 0.28, size * 0.34);
  ctx.lineTo(size * 0.4, size * 0.24);
  ctx.lineTo(size * 0.18, 0);
  ctx.closePath();
  ctx.fill();
  if (!ghost) {
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = Math.max(1, size * 0.035);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSelectedRunner(ctx, fighter, x, y, size, angle, alpha, color, ghost, facing) {
  const image = getFighterImage(fighter, "attack");
  if (!drawFighterImage(ctx, image, {
    x,
    y,
    size: size * 2.35,
    facing,
    rotation: angle,
    alpha,
    glow: color,
    blur: ghost ? 15 : 22,
    anchorY: 0.6,
  })) {
    drawRunner(ctx, x, y, size, angle, alpha, color, ghost);
  }
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const manual = state.custom.lastDash && state.now - state.custom.lastDash < 4300;
  let fromX;
  let fromY;
  let toX;
  let toY;
  let age;
  if (manual) {
    ({ fromX, fromY, toX, toY } = state.custom);
    age = state.now - state.custom.lastDash;
  } else {
    const cycle = t % 2600;
    const reverse = Math.floor(t / 2600) % 2;
    fromX = w * (reverse ? 0.72 : 0.28);
    fromY = h * 0.62;
    toX = w * (reverse ? 0.28 : 0.72);
    toY = h * 0.42;
    age = cycle;
  }
  const progress = easeOutExpo(clamp(age / 560, 0, 1));
  const arc = Math.sin(progress * Math.PI) * size * 0.14;
  const currentX = lerp(fromX, toX, progress);
  const currentY = lerp(fromY, toY, progress) - arc;
  state.custom.currentX = currentX;
  state.custom.currentY = currentY;
  const angle = Math.atan2(toY - fromY, toX - fromX) * 0.22;
  const facing = toX >= fromX ? 1 : -1;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#080b16");
  bg.addColorStop(0.55, "#16122a");
  bg.addColorStop(1, "#220f25");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(180,119,255,0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) {
    const y = h * (0.16 + i * 0.09);
    const offset = (t * (0.08 + i * 0.012)) % (w * 0.34);
    ctx.beginPath();
    ctx.moveTo(offset - w * 0.36, y);
    ctx.lineTo(offset + w * (0.05 + hash(i) * 0.16), y);
    ctx.stroke();
  }

  const ghostCount = Math.floor(9 * intensity);
  for (let i = ghostCount; i >= 1; i -= 1) {
    const delayed = clamp((age - i * 38) / 560, 0, 1);
    if (delayed <= 0 || age > 1080) continue;
    const ghostProgress = easeOutExpo(delayed);
    const ghostX = lerp(fromX, toX, ghostProgress);
    const ghostY = lerp(fromY, toY, ghostProgress) - Math.sin(ghostProgress * Math.PI) * size * 0.14;
    const alpha = (1 - i / (ghostCount + 1)) * clamp(1 - (age - 500) / 580, 0, 1) * 0.42;
    const scale = 1 - i * 0.035;
    drawSelectedRunner(ctx, state.custom.fighter, ghostX, ghostY, size * 0.18 * scale, angle, alpha, i % 2 ? "#f95cff" : "#48d9ff", true, facing);
  }

  if (age < 850) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < Math.floor(24 * intensity); i += 1) {
      const p = clamp(progress - hash(i * 3.1) * 0.42, 0, 1);
      const x = lerp(fromX, toX, p);
      const y = lerp(fromY, toY, p) - Math.sin(p * Math.PI) * size * 0.14;
      ctx.fillStyle = `rgba(${i % 2 ? "247,79,255" : "65,217,255"},${(1 - p) * 0.52})`;
      ctx.fillRect(x - size * (0.02 + hash(i) * 0.08), y + (hash(i * 6.2) - 0.5) * size * 0.08, size * 0.03, 1.5);
    }
    ctx.restore();
  }

  drawSelectedRunner(ctx, state.custom.fighter, currentX, currentY, size * 0.18, angle, 1, "#eef8ff", false, facing);
  ctx.fillStyle = "rgba(208,218,255,0.7)";
  ctx.font = `700 ${Math.max(10, size * 0.032)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(age < 680 ? "DASH" : "READY", w * 0.5, h * 0.88);
}
