import { clamp, hash, TAU } from "../../../shared/canvas.js";

const ORBS = [
  [0.17, 0.3], [0.39, 0.2], [0.63, 0.31], [0.82, 0.2],
  [0.77, 0.66], [0.5, 0.75], [0.22, 0.67],
];

export function getOrbPositions(w, h, t) {
  return ORBS.map(([x, y], index) => ({
    x: w * x + Math.sin(t * 0.0007 + index * 1.8) * Math.min(w, h) * 0.018,
    y: h * y + Math.cos(t * 0.0006 + index * 2.1) * Math.min(w, h) * 0.014,
  }));
}

function lightningPath(ctx, from, to, seed, t, amplitude) {
  const segments = 9;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / length;
  const ny = dx / length;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  for (let i = 1; i < segments; i++) {
    const p = i / segments;
    const jitter = (hash(seed * 17 + i * 3.1 + Math.floor(t / 55)) - 0.5) * amplitude * Math.sin(p * Math.PI);
    ctx.lineTo(from.x + dx * p + nx * jitter, from.y + dy * p + ny * jitter);
  }
  ctx.lineTo(to.x, to.y);
}

function drawOrb(ctx, position, radius, active, pulse, index) {
  ctx.save();
  ctx.translate(position.x, position.y);
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2.8);
  halo.addColorStop(0, `rgba(190, 249, 255, ${active ? 0.7 : 0.2})`);
  halo.addColorStop(0.35, `rgba(56, 171, 255, ${active ? 0.32 : 0.08})`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(-radius * 3, -radius * 3, radius * 6, radius * 6);
  ctx.strokeStyle = active ? "rgba(215, 252, 255, 0.95)" : "rgba(104, 172, 208, 0.48)";
  ctx.lineWidth = active ? 2.5 : 1;
  ctx.setLineDash([radius * 0.42, radius * 0.28]);
  ctx.lineDashOffset = pulse * radius * -2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * (1.14 + pulse * 0.08), 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = active ? "#d9fbff" : "#15364c";
  ctx.shadowColor = active ? "#5de7ff" : "transparent";
  ctx.shadowBlur = active ? 18 : 0;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 6 + i * TAU / 6;
    const r = radius * (i % 2 ? 0.7 : 0.82);
    i ? ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r) : ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = active ? "#167b9f" : "rgba(121, 196, 225, 0.38)";
  ctx.beginPath();
  ctx.arc(0, 0, radius * (0.19 + hash(index) * 0.09), 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#03070d";
  ctx.fillRect(0, 0, w, h);
  const size = Math.min(w, h);
  const positions = getOrbPositions(w, h, t);
  const recentInput = state.custom.lastInput && state.now - state.custom.lastInput < 2600;
  const demoCount = 1 + Math.floor((t % 3600) / 520) % ORBS.length;
  const chain = recentInput ? state.custom.chain : Array.from({ length: demoCount }, (_, index) => index);
  const releaseAge = state.custom.releasedAt ? state.now - state.custom.releasedAt : Infinity;
  const completion = recentInput && chain.length === ORBS.length ? clamp(1 - releaseAge / 1200, 0, 1) : 0;

  const background = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
  background.addColorStop(0, `rgba(12, 58, 74, ${0.22 + completion * 0.2})`);
  background.addColorStop(1, "rgba(2, 5, 11, 0)");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(116, 206, 230, 0.16)";
  for (let i = 0; i < 72; i++) {
    const x = hash(i * 5.7) * w;
    const y = hash(i * 9.1) * h;
    const pulse = 0.25 + 0.75 * Math.abs(Math.sin(t * 0.0015 + i));
    ctx.globalAlpha = pulse;
    ctx.fillRect(x, y, 1.3, 1.3);
  }
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 1; i < chain.length; i++) {
    const from = positions[chain[i - 1]];
    const to = positions[chain[i]];
    ctx.strokeStyle = "rgba(49, 157, 255, 0.24)";
    ctx.lineWidth = 14 * intensity;
    lightningPath(ctx, from, to, i, t, size * 0.055);
    ctx.stroke();
    ctx.strokeStyle = "rgba(126, 229, 255, 0.88)";
    ctx.lineWidth = 3.2 * intensity;
    lightningPath(ctx, from, to, i, t, size * 0.046);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  if (recentInput && state.pointer.down && chain.length) {
    const from = positions[chain.at(-1)];
    const to = state.pointer;
    ctx.strokeStyle = "rgba(94, 208, 255, 0.52)";
    ctx.lineWidth = 1.5;
    lightningPath(ctx, from, to, 19, t, size * 0.04);
    ctx.stroke();
  }
  ctx.restore();

  const radius = size * 0.052;
  positions.forEach((position, index) => {
    const activeIndex = chain.indexOf(index);
    drawOrb(ctx, position, radius, activeIndex !== -1, (t * 0.00035 + index * 0.13) % 1, index);
    if (activeIndex !== -1) {
      for (let p = 0; p < 4; p++) {
        const angle = t * 0.002 * (p % 2 ? 1 : -1) + p * TAU / 4;
        ctx.fillStyle = "rgba(145, 238, 255, 0.72)";
        ctx.beginPath();
        ctx.arc(position.x + Math.cos(angle) * radius * 1.4, position.y + Math.sin(angle) * radius * 1.4, 1.4, 0, TAU);
        ctx.fill();
      }
    }
  });

  if (chain.length > 1) {
    ctx.fillStyle = completion > 0 ? "#e9ffff" : "rgba(176, 239, 255, 0.88)";
    ctx.font = `800 ${Math.max(13, size * 0.052)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#4fdcff";
    ctx.shadowBlur = completion * 24;
    ctx.fillText(`CHAIN x${chain.length}`, w * 0.5, h * 0.5);
    ctx.shadowBlur = 0;
  }

  if (completion > 0) {
    ctx.strokeStyle = `rgba(194, 250, 255, ${completion})`;
    ctx.lineWidth = 2 + completion * 5;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, size * (0.12 + (1 - completion) * 0.5), 0, TAU);
    ctx.stroke();
  }
}
