import { fract, hash, TAU } from "../../../shared/canvas.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const ease = (value) => {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
};

function drawSky(ctx, w, h, horizon, chapter, energy, pitch, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, horizon * 1.15);
  sky.addColorStop(0, chapter > 2.6 ? "#07182b" : "#02070f");
  sky.addColorStop(0.56, chapter > 1.7 ? "#123552" : "#09243a");
  sky.addColorStop(1, chapter > 2.8 ? "#7f6a63" : "#294f63");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon + 2);

  const dawn = clamp((chapter - 2.35) / 1.35, 0, 1);
  const horizonGlow = ctx.createRadialGradient(
    w * lerp(0.42, 0.68, pitch),
    horizon,
    0,
    w * 0.58,
    horizon,
    Math.max(w, h) * 0.62,
  );
  horizonGlow.addColorStop(0, `rgba(246,187,128,${0.08 + dawn * 0.23 + energy * 0.025})`);
  horizonGlow.addColorStop(0.42, `rgba(68,151,179,${0.08 + energy * 0.035})`);
  horizonGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = horizonGlow;
  ctx.fillRect(0, 0, w, horizon + h * 0.08);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const starVisibility = 1 - dawn * 0.8;
  for (let i = 0; i < 88; i += 1) {
    const x = hash(i * 17.13) * w;
    const y = hash(i * 31.77) * horizon * 0.78;
    const pulse = 0.55 + Math.sin(t * 0.0015 + i * 2.4) * 0.45;
    const alpha = (0.08 + hash(i * 3.1) * 0.35) * pulse * starVisibility;
    ctx.fillStyle = `rgba(204,235,246,${alpha})`;
    ctx.fillRect(x, y, i % 11 === 0 ? 1.8 : 1, i % 11 === 0 ? 1.8 : 1);
  }
  ctx.restore();
}

function mountainPoint(index, layer, w, horizon) {
  const x = (index / 9) * w;
  const ridge = hash(index * 7.17 + layer * 13.2);
  const shoulder = Math.sin(index * 1.73 + layer) * 0.5 + 0.5;
  return {
    x,
    y: horizon - (0.02 + ridge * 0.085 + shoulder * 0.035) * w / (1 + layer * 0.7),
  };
}

function drawMountains(ctx, w, h, horizon, chapter, pitch, t) {
  for (let layer = 2; layer >= 0; layer -= 1) {
    const depth = layer / 2;
    const offset = Math.sin(t * 0.00007 + layer) * w * 0.008 + (pitch - 0.5) * layer * 8;
    ctx.beginPath();
    ctx.moveTo(-w * 0.08, horizon + h * 0.05);
    for (let i = -1; i <= 10; i += 1) {
      const point = mountainPoint(i, layer, w, horizon);
      const y = lerp(horizon - h * 0.018, point.y, 0.42 + chapter * 0.13);
      ctx.lineTo(point.x + offset, y);
    }
    ctx.lineTo(w * 1.08, horizon + h * 0.06);
    ctx.closePath();
    ctx.fillStyle = layer === 0
      ? "rgba(3,13,20,.94)"
      : `rgba(${8 + layer * 7},${25 + layer * 11},${34 + layer * 14},${0.78 - depth * 0.18})`;
    ctx.fill();

    ctx.strokeStyle = `rgba(146,205,215,${0.05 + (2 - layer) * 0.025})`;
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }
}

function drawMoon(ctx, w, h, horizon, chapter, progress, energy, pitch, completed) {
  const rise = ease(clamp((chapter - 0.55) / 1.45, 0, 1));
  const finale = ease(clamp(chapter - 2.7, 0, 1));
  const radius = Math.min(w, h) * lerp(0.068, 0.105, clamp((chapter - 0.65) / 1.7, 0, 1));
  const cx = lerp(w * 0.51, w * 0.68, finale);
  const pitchLift = (pitch - 0.5) * h * 0.095;
  const cy = lerp(horizon + radius * 0.75, h * 0.235 - pitchLift, rise);
  const visible = 0.12 + rise * 0.88;

  const halo = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * (3.2 + energy * 0.3));
  halo.addColorStop(0, `rgba(255,244,204,${0.34 + energy * 0.08})`);
  halo.addColorStop(0.2, `rgba(255,211,144,${0.16 + energy * 0.05})`);
  halo.addColorStop(0.52, "rgba(126,207,221,.07)");
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(cx - radius * 3.5, cy - radius * 3.5, radius * 7, radius * 7);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.shadowBlur = 28 + energy * 26;
  ctx.shadowColor = "rgba(255,221,158,.78)";
  const moonFill = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.34, 0, cx, cy, radius);
  moonFill.addColorStop(0, "rgba(255,255,238,.98)");
  moonFill.addColorStop(0.68, "rgba(255,229,177,.94)");
  moonFill.addColorStop(1, `rgba(238,183,121,${0.78 + visible * 0.2})`);
  ctx.fillStyle = moonFill;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * (0.84 + progress * 0.16), 0, TAU);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#826c58";
  [[-0.22, -0.18, 0.13], [0.2, 0.08, 0.09], [-0.06, 0.28, 0.07]].forEach(([ox, oy, r]) => {
    ctx.beginPath();
    ctx.ellipse(cx + radius * ox, cy + radius * oy, radius * r * 1.7, radius * r, -0.35, 0, TAU);
    ctx.fill();
  });
  ctx.restore();

  if (completed) {
    ctx.strokeStyle = "rgba(255,231,177,.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.42, 0, TAU);
    ctx.stroke();
  }

  return { cx, cy, radius };
}

function waterY(x, row, horizon, h, t, energy, pitch) {
  const depth = row / 25;
  const base = horizon + Math.pow(depth, 1.7) * (h - horizon + 28);
  const perspective = lerp(0.002, 0.019, depth);
  const amplitude = (1.2 + depth * depth * 12) * (0.72 + energy * 0.62);
  return base
    + Math.sin(x * perspective + t * (0.001 + depth * 0.0007) + row * 0.92) * amplitude
    + Math.sin(x * perspective * 2.13 - t * 0.00076 + pitch * 4) * amplitude * 0.28;
}

function drawWater(ctx, w, h, horizon, moon, chapter, progress, energy, pitch, t) {
  const water = ctx.createLinearGradient(0, horizon, 0, h);
  water.addColorStop(0, "#0a2b3b");
  water.addColorStop(0.42, chapter > 2.4 ? "#102d3c" : "#061b29");
  water.addColorStop(1, "#01070d");
  ctx.fillStyle = water;
  ctx.fillRect(0, horizon, w, h - horizon);

  const pathStrength = ease(clamp((chapter - 1.18) / 1.25, 0, 1));
  for (let row = 0; row < 26; row += 1) {
    const depth = row / 25;
    const step = lerp(10, 28, depth);
    const lineAlpha = 0.055 + depth * 0.13 + energy * 0.025;
    ctx.lineWidth = 0.7 + depth * 1.2;
    ctx.strokeStyle = `rgba(${lerp(105, 145, depth)},${lerp(196, 222, depth)},${lerp(210, 224, depth)},${lineAlpha})`;
    ctx.beginPath();
    for (let x = -step; x <= w + step; x += step) {
      const y = waterY(x, row, horizon, h, t, energy, pitch);
      x === -step ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (pathStrength > 0.01 && row > 1) {
      const center = moon.cx + Math.sin(row * 1.7 + t * 0.00045) * w * 0.025 * depth;
      const width = moon.radius * lerp(0.2, 3.8, depth) * (0.7 + energy * 0.32) * pathStrength;
      const segments = 2 + Math.floor(depth * 7);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.strokeStyle = `rgba(255,220,154,${(0.035 + depth * 0.23) * pathStrength})`;
      ctx.lineWidth = 1 + depth * 3.2;
      for (let segment = 0; segment < segments; segment += 1) {
        const seed = hash(row * 19.1 + segment * 7.3);
        const span = width * (0.12 + seed * 0.3);
        const x = center + (hash(segment * 41.7 + row) - 0.5) * width;
        const y = waterY(x, row, horizon, h, t, energy, pitch);
        ctx.beginPath();
        ctx.moveTo(x - span, y);
        ctx.lineTo(x + span, y + Math.sin(segment + t * 0.002) * depth * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  const tide = ease(clamp(chapter / 0.95, 0, 1));
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = `rgba(173,232,234,${0.17 + energy * 0.09})`;
  ctx.lineWidth = 1.2 + energy;
  ctx.beginPath();
  for (let x = -10; x <= w + 10; x += 7) {
    const y = horizon + h * (0.046 + tide * 0.025)
      + Math.sin(x * 0.011 + t * 0.0017) * (3 + energy * 6)
      + Math.sin(x * 0.027 - t * 0.0011) * 1.8;
    x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  if (chapter > 1.75) drawGlints(ctx, w, h, horizon, moon.cx, t, energy, progress, chapter);
}

function drawGlints(ctx, w, h, horizon, moonX, t, energy, progress, chapter) {
  const amount = Math.floor(32 + progress * 44 + energy * 32 + clamp(chapter - 2, 0, 1) * 52);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < amount; i += 1) {
    const seed = hash(i * 9.317);
    const life = fract(seed + t * (0.000055 + hash(i * 3.11) * 0.00008));
    const depth = hash(i * 5.93);
    const spread = lerp(w * 0.05, w * 0.34, depth);
    const x = moonX + (hash(i * 7.31) - 0.5) * spread + Math.sin(t * 0.001 + i) * 8;
    const y = horizon + Math.pow(depth, 1.55) * (h - horizon) - life * (10 + depth * 30);
    const alpha = Math.sin(life * Math.PI) * (0.18 + energy * 0.28) * (0.55 + depth * 0.45);
    ctx.fillStyle = i % 5 === 0 ? `rgba(255,240,202,${alpha})` : `rgba(137,224,231,${alpha * 0.72})`;
    ctx.fillRect(x, y, 1 + depth * 5, 0.7 + depth * 1.2);
  }
  ctx.restore();
}

function drawReeds(ctx, w, h, t, energy) {
  ctx.save();
  ctx.translate(0, h);
  ctx.strokeStyle = "rgba(1,7,9,.92)";
  ctx.fillStyle = "rgba(1,7,9,.95)";
  ctx.lineWidth = 1.4;
  for (let side = 0; side < 2; side += 1) {
    for (let i = 0; i < 22; i += 1) {
      const seed = hash(i * 9.4 + side * 50);
      const x = side ? w - seed * w * 0.16 : seed * w * 0.16;
      const height = h * (0.06 + hash(i * 2.2) * 0.14);
      const sway = Math.sin(t * 0.0008 + i) * (2 + energy * 3);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.quadraticCurveTo(x + sway * 0.35, -height * 0.55, x + sway, -height);
      ctx.stroke();
      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.ellipse(x + sway, -height, 1.7, 6, sway * 0.025, 0, TAU);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

function drawTransition(ctx, w, h, burst) {
  if (burst <= 0.01) return;
  const travel = 1 - burst;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const wash = ctx.createRadialGradient(w * 0.5, h * 0.48, 0, w * 0.5, h * 0.48, Math.max(w, h) * 0.72);
  wash.addColorStop(0, `rgba(255,243,211,${burst * burst * 0.48})`);
  wash.addColorStop(0.2, `rgba(111,225,235,${burst * 0.18})`);
  wash.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = `rgba(241,247,229,${burst * 0.46})`;
  for (let ripple = 0; ripple < 3; ripple += 1) {
    const rippleTravel = clamp(travel - ripple * 0.08, 0, 1);
    ctx.lineWidth = 0.8 + burst * (2.8 - ripple * 0.5);
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.64, rippleTravel * w * 0.48, rippleTravel * h * 0.045, 0, 0, TAU);
    ctx.stroke();
  }
  for (let i = 0; i < 44; i += 1) {
    const angle = hash(i * 12.7) * TAU;
    const distance = travel * Math.min(w, h) * (0.08 + hash(i * 4.2) * 0.58);
    const x = w * 0.5 + Math.cos(angle) * distance * 1.7;
    const y = h * 0.62 + Math.sin(angle) * distance * 0.32;
    ctx.fillStyle = i % 3 === 0 ? `rgba(255,219,151,${burst * 0.8})` : `rgba(129,231,233,${burst * 0.62})`;
    ctx.fillRect(x, y, 1 + burst * 3, 1 + burst * 1.5);
  }
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const live = state?.custom || {};
  const isPreview = !live.detailActive;
  const cycle = (t % 14400) / 3600;
  const cue = isPreview ? Math.floor(cycle) : clamp(live.activeCue || 0, 0, 3);
  const progress = isPreview ? fract(cycle) : clamp(live.cueProgress || 0, 0, 1);
  const level = isPreview ? 0.34 + Math.sin(t * 0.004) * 0.12 : clamp(live.level || 0, 0, 1);
  const pitch = isPreview ? 0.52 + Math.sin(t * 0.0011) * 0.28 : clamp(((live.pitch || 64) - 48) / 36, 0, 1);
  const burst = clamp(live.burst || 0, 0, 1);
  const completed = Boolean(live.completed);
  const chapter = completed ? 4 : cue + ease(progress);
  const energy = clamp((0.28 + level * 1.32 + burst * 0.58) * intensity, 0.18, 2.15);
  const horizon = h * lerp(0.61, 0.54, clamp(chapter / 4, 0, 1)) + (pitch - 0.5) * h * 0.022;

  ctx.fillStyle = "#01050a";
  ctx.fillRect(0, 0, w, h);
  drawSky(ctx, w, h, horizon, chapter, energy, pitch, t);
  drawMountains(ctx, w, h, horizon, chapter, pitch, t);
  const moon = drawMoon(ctx, w, h, horizon, chapter, progress, energy, pitch, completed);
  drawWater(ctx, w, h, horizon, moon, chapter, progress, energy, pitch, t);

  const mist = ctx.createLinearGradient(0, horizon - h * 0.05, 0, horizon + h * 0.08);
  mist.addColorStop(0, "rgba(166,221,225,0)");
  mist.addColorStop(0.5, `rgba(166,221,225,${0.035 + energy * 0.018})`);
  mist.addColorStop(1, "rgba(166,221,225,0)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, horizon - h * 0.05, w, h * 0.14);

  drawReeds(ctx, w, h, t, energy);
  drawTransition(ctx, w, h, burst);

  const vignette = ctx.createRadialGradient(w * 0.52, h * 0.48, Math.min(w, h) * 0.18, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.72, "rgba(0,2,5,.08)");
  vignette.addColorStop(1, "rgba(0,2,5,.72)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  live.burst = burst * 0.9;
}
