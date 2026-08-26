import { clamp, hash, TAU } from "../../../shared/canvas.js";
import { createFighterImageLoader, drawFighterImage, fighterAssetUrlsFromModules } from "../../../shared/fighter-library.js";

const fighterAssetModules = typeof window === "undefined"
  ? {}
  : import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" });
const getFighterImage = createFighterImageLoader(fighterAssetUrlsFromModules(fighterAssetModules));

function drawCracks(ctx, x, y, radius, seed, alpha) {
  ctx.save();
  ctx.strokeStyle = `rgba(193, 240, 216, ${alpha})`;
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 13; i++) {
    const angle = hash(seed * 3.7 + i) * TAU;
    const length = radius * (0.45 + hash(i * 8.2 + seed) * 0.8);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * radius * 0.08, y + Math.sin(angle) * radius * 0.03);
    for (let segment = 1; segment <= 3; segment++) {
      const p = segment / 3;
      const bend = (hash(i * 17 + segment + seed) - 0.5) * radius * 0.17;
      ctx.lineTo(x + Math.cos(angle) * length * p + Math.cos(angle + Math.PI / 2) * bend, y + Math.sin(angle) * length * p * 0.38);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawHammer(ctx, x, y, size, charge, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.72 - charge * 0.65 + Math.sin(t * 0.006) * charge * 0.035);
  ctx.strokeStyle = "#9db3aa";
  ctx.lineWidth = size * 0.11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -size * 0.92);
  ctx.stroke();
  ctx.fillStyle = charge > 0.75 ? "#d9fff0" : "#789589";
  ctx.shadowColor = "#66ffc5";
  ctx.shadowBlur = charge * 28;
  ctx.fillRect(-size * 0.38, -size * 1.16, size * 0.76, size * 0.38);
  ctx.fillStyle = "rgba(15, 31, 27, 0.65)";
  ctx.fillRect(-size * 0.25, -size * 1.08, size * 0.5, size * 0.1);
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const recentInput = state.custom.lastInput && state.now - state.custom.lastInput < 3300;
  const demoPhase = (t % 3800) / 3800;
  const demoCharging = !recentInput && demoPhase < 0.48;
  const charge = state.custom.charging
    ? clamp((state.now - state.custom.chargeStart) / 1400, 0, 1)
    : demoCharging ? clamp(demoPhase / 0.42, 0, 1) : 0;
  const target = recentInput && state.pointer.active
    ? state.pointer
    : { x: w * 0.58, y: h * 0.68 };

  const actualImpacts = state.custom.impacts.filter((impact) => state.now - impact.time < 2400);
  state.custom.impacts = actualImpacts;
  const demoImpactAge = !recentInput && demoPhase >= 0.48 ? (demoPhase - 0.48) * 3800 : Infinity;
  const impacts = actualImpacts.length || recentInput
    ? actualImpacts
    : demoImpactAge < 1900 ? [{ ...target, power: 1, time: state.now - demoImpactAge }] : [];
  const strongest = impacts.reduce((best, impact) => {
    const age = state.now - impact.time;
    const force = impact.power * clamp(1 - age / 480, 0, 1);
    return force > best ? force : best;
  }, 0);
  const shake = strongest * 8;

  ctx.save();
  ctx.translate(Math.sin(state.now * 0.16) * shake, Math.cos(state.now * 0.13) * shake * 0.45);
  const background = ctx.createLinearGradient(0, 0, 0, h);
  background.addColorStop(0, "#06100e");
  background.addColorStop(0.58, "#10221c");
  background.addColorStop(1, "#182119");
  ctx.fillStyle = background;
  ctx.fillRect(-12, -12, w + 24, h + 24);

  ctx.strokeStyle = "rgba(167, 218, 193, 0.09)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) {
    const y = h * (0.58 + i * 0.085);
    ctx.beginPath();
    ctx.moveTo(w * (0.12 - i * 0.035), y);
    ctx.lineTo(w * (0.88 + i * 0.035), y);
    ctx.stroke();
  }

  if (charge > 0) {
    const reticleRadius = size * (0.13 - charge * 0.055);
    ctx.strokeStyle = `rgba(102, 255, 196, ${0.35 + charge * 0.6})`;
    ctx.lineWidth = 1.5 + charge * 2.5;
    ctx.setLineDash([size * 0.025, size * 0.018]);
    ctx.lineDashOffset = -t * 0.02;
    ctx.beginPath();
    ctx.ellipse(target.x, target.y, reticleRadius, reticleRadius * 0.38, 0, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 36 * intensity; i++) {
      const angle = hash(i * 4.9) * TAU + t * 0.0015 * (i % 2 ? 1 : -1);
      const distance = size * (0.05 + (1 - charge) * 0.2 + hash(i) * 0.12);
      const x = target.x + Math.cos(angle) * distance;
      const y = target.y + Math.sin(angle) * distance * 0.56;
      ctx.fillStyle = `rgba(107, 255, 196, ${0.2 + charge * 0.75})`;
      ctx.fillRect(x, y, 1 + hash(i) * 2.5, 1 + hash(i) * 2.5);
    }
    ctx.restore();
  }

  const fighterX = w * 0.34;
  const fighterY = h * 0.7;
  const fighterImage = getFighterImage(state.custom.fighter, charge > 0.2 || impacts.length ? "attack" : "neutral");
  const drewAsset = drawFighterImage(ctx, fighterImage, {
    x: fighterX,
    y: fighterY + size * 0.03,
    size: size * 0.4,
    glow: "#66ffc5",
    blur: 8 + charge * 18,
  });
  if (!drewAsset) {
    ctx.fillStyle = "#07100e";
    ctx.strokeStyle = "rgba(189, 224, 207, 0.68)";
    ctx.lineWidth = Math.max(1.5, size * 0.007);
    ctx.beginPath();
    ctx.arc(fighterX, fighterY - size * 0.15, size * 0.035, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fighterX, fighterY - size * 0.11);
    ctx.lineTo(fighterX, fighterY + size * 0.08);
    ctx.moveTo(fighterX, fighterY - size * 0.05);
    ctx.lineTo(fighterX - size * 0.07, fighterY + size * 0.02);
    ctx.moveTo(fighterX, fighterY + size * 0.07);
    ctx.lineTo(fighterX - size * 0.06, fighterY + size * 0.16);
    ctx.moveTo(fighterX, fighterY + size * 0.07);
    ctx.lineTo(fighterX + size * 0.07, fighterY + size * 0.16);
    ctx.stroke();
  }
  drawHammer(ctx, fighterX + size * 0.055, fighterY - size * 0.02, size * 0.16, charge, t);

  impacts.forEach((impact, impactIndex) => {
    const age = state.now - impact.time;
    const p = clamp(age / 1150, 0, 1);
    const fade = 1 - p;
    const radius = size * impact.power * (0.08 + p * 0.52);
    drawCracks(ctx, impact.x, impact.y, size * (0.22 + impact.power * 0.22), impactIndex + impact.time * 0.001, clamp(1 - age / 2200, 0, 1) * impact.power);
    ctx.strokeStyle = `rgba(137, 255, 207, ${fade * impact.power})`;
    ctx.lineWidth = 2 + fade * 6 * impact.power * intensity;
    ctx.beginPath();
    ctx.ellipse(impact.x, impact.y, radius, radius * 0.28, 0, 0, TAU);
    ctx.stroke();
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const flash = ctx.createRadialGradient(impact.x, impact.y, 0, impact.x, impact.y, size * 0.35);
    flash.addColorStop(0, `rgba(224, 255, 238, ${fade * impact.power * 0.8})`);
    flash.addColorStop(0.22, `rgba(60, 245, 160, ${fade * impact.power * 0.36})`);
    flash.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = flash;
    ctx.fillRect(impact.x - size * 0.4, impact.y - size * 0.4, size * 0.8, size * 0.8);
    for (let i = 0; i < 40 * impact.power * intensity; i++) {
      const angle = hash(i * 5.1 + impact.time) * TAU;
      const speed = size * (0.08 + hash(i * 3.4) * 0.28) * impact.power;
      const flight = Math.min(age / 760, 1);
      const x = impact.x + Math.cos(angle) * speed * flight;
      const y = impact.y + Math.sin(angle) * speed * flight - Math.sin(flight * Math.PI) * size * 0.18 * impact.power;
      ctx.fillStyle = `rgba(139, 255, 203, ${fade})`;
      ctx.fillRect(x, y, 2 + hash(i) * 4, 1.5 + hash(i * 2) * 3);
    }
    ctx.restore();
    if (impact.power > 0.92 && age < 850) {
      ctx.fillStyle = `rgba(220, 255, 236, ${clamp(1 - age / 850, 0, 1)})`;
      ctx.font = `800 ${Math.max(14, size * 0.055)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("MAX CHARGE", impact.x, Math.max(size * 0.12, impact.y - size * 0.24));
    }
  });

  if (charge > 0) {
    ctx.strokeStyle = charge > 0.92 ? "#dbffec" : "rgba(107, 255, 196, 0.78)";
    ctx.lineWidth = 3 + charge * 3;
    ctx.beginPath();
    ctx.arc(fighterX, fighterY - size * 0.02, size * 0.13, -Math.PI / 2, -Math.PI / 2 + TAU * charge);
    ctx.stroke();
  }
  ctx.restore();
}
