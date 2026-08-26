import { clamp, hash, TAU } from "../../../shared/canvas.js";

function drawTower(ctx, x, y, scale, level, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(7,18,26,0.94)";
  ctx.strokeStyle = level > 2 ? "#ffe784" : "#76e6ff";
  ctx.lineWidth = Math.max(1.5, scale * 0.03);
  ctx.shadowColor = level > 2 ? "#ffc53f" : "#36ccec";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.ellipse(0, 0, scale * 0.48, scale * 0.2, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#132d3a";
  ctx.fillRect(-scale * 0.26, -scale * 0.54, scale * 0.52, scale * 0.5);
  ctx.strokeRect(-scale * 0.26, -scale * 0.54, scale * 0.52, scale * 0.5);
  ctx.fillStyle = level > 1 ? "#d9fbff" : "#78ddf1";
  ctx.beginPath();
  ctx.arc(0, -scale * 0.58, scale * (0.19 + level * 0.018), 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#183747";
  ctx.fillRect(scale * 0.08, -scale * 0.64, scale * (0.5 + level * 0.08), scale * 0.12);
  for (let i = 0; i < level; i += 1) {
    ctx.fillStyle = "#ffe06c";
    ctx.beginPath();
    ctx.arc((i - (level - 1) / 2) * scale * 0.15, scale * 0.08, scale * 0.035, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawFeedback(ctx, tower, now, size, intensity) {
  const age = now - tower.time;
  if (age < 0 || age > 1300) return;
  const p = clamp(age / 900, 0, 1);
  const fade = 1 - p;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = tower.action === "upgrade"
    ? `rgba(255,225,96,${fade})`
    : `rgba(90,230,255,${fade})`;
  ctx.lineWidth = 2 + fade * 4;
  ctx.beginPath();
  ctx.ellipse(tower.x, tower.y, size * (0.05 + p * 0.28), size * (0.022 + p * 0.1), 0, 0, TAU);
  ctx.stroke();
  if (tower.action === "upgrade") {
    const beam = ctx.createLinearGradient(0, tower.y - size * 0.55, 0, tower.y);
    beam.addColorStop(0, "rgba(255,238,131,0)");
    beam.addColorStop(0.58, `rgba(255,223,76,${fade * 0.26})`);
    beam.addColorStop(1, "rgba(255,255,235,0)");
    ctx.fillStyle = beam;
    ctx.fillRect(tower.x - size * 0.1, tower.y - size * 0.62, size * 0.2, size * 0.62);
  }
  for (let i = 0; i < Math.floor(22 * intensity); i += 1) {
    const angle = hash(i * 4.2 + tower.time) * TAU;
    const distance = p * size * (0.08 + hash(i) * 0.24);
    ctx.fillStyle = tower.action === "upgrade" ? `rgba(255,225,89,${fade})` : `rgba(88,225,255,${fade})`;
    ctx.fillRect(tower.x + Math.cos(angle) * distance, tower.y + Math.sin(angle) * distance * 0.5 - p * size * 0.12, 2, 2);
  }
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0b1d21");
  bg.addColorStop(1, "#07100f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const step = Math.max(34, size * 0.13);
  ctx.strokeStyle = "rgba(127,207,183,0.1)";
  ctx.lineWidth = 1;
  for (let x = -w; x < w * 2; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h * 0.62, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - h * 0.62, h);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,191,78,0.2)";
  ctx.lineWidth = size * 0.045;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-w * 0.06, h * 0.72);
  ctx.bezierCurveTo(w * 0.28, h * 0.44, w * 0.6, h * 0.86, w * 1.06, h * 0.42);
  ctx.stroke();

  const demo = [
    { x: w * 0.3, y: h * 0.49, level: 2, time: state.now - (t % 3100), action: "upgrade" },
    { x: w * 0.7, y: h * 0.63, level: 1, time: state.now - ((t + 1500) % 3600), action: "place" },
  ];
  const towers = state.custom.placements.length ? state.custom.placements : demo;
  towers.forEach((tower) => {
    const placementAge = state.now - tower.time;
    const rise = tower.action === "place" ? clamp(placementAge / 360, 0, 1) : 1;
    ctx.strokeStyle = `rgba(82,220,255,${0.12 + tower.level * 0.05})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([size * 0.025, size * 0.018]);
    ctx.lineDashOffset = -t * 0.012;
    ctx.beginPath();
    ctx.ellipse(tower.x, tower.y, size * (0.18 + tower.level * 0.018), size * (0.075 + tower.level * 0.008), 0, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    drawTower(ctx, tower.x, tower.y + (1 - rise) * size * 0.12, size * 0.16, tower.level, rise);
    drawFeedback(ctx, tower, state.now, size, intensity);
  });

  if (state.pointer.active) {
    const pulse = 0.5 + Math.sin(t * 0.008) * 0.5;
    ctx.strokeStyle = `rgba(145,244,215,${0.45 + pulse * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(state.pointer.x, state.pointer.y, size * 0.12, size * 0.05, 0, 0, TAU);
    ctx.stroke();
    drawTower(ctx, state.pointer.x, state.pointer.y, size * 0.14, 1, 0.32 + pulse * 0.1);
  }

  ctx.fillStyle = "rgba(193,228,214,0.7)";
  ctx.font = `700 ${Math.max(10, size * 0.03)}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(`DEPLOYED  ${towers.length}`, size * 0.07, size * 0.1);
}
