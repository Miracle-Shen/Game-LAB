import { drawGrid, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#010309";
  ctx.fillRect(0, 0, w, h);
  const idleX = w * 0.5 + Math.sin(t * 0.00035) * w * 0.08;
  const idleY = h * 0.48 + Math.cos(t * 0.00044) * h * 0.05;
  const fx = state.pointer.active ? state.pointer.x : idleX;
  const fy = state.pointer.active ? state.pointer.y : idleY;
  const min = Math.min(w, h);
  const core = ctx.createRadialGradient(fx, fy, 0, fx, fy, min * 0.42);
  core.addColorStop(0, state.pointer.down ? "rgba(255,83,239,0.3)" : "rgba(55,228,255,0.28)");
  core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, w, h);
  drawGrid(ctx, w, h, 0.035);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < Math.floor(220 * intensity); i++) {
    const seed = hash(i * 4.117);
    const angle = seed * TAU + t * (0.00016 + hash(i * 9.77) * 0.00035) * (i % 3 ? 1 : -1);
    const orbit = min * (0.1 + hash(i * 6.19) * 0.58);
    let x = w * 0.5 + Math.cos(angle) * orbit * (1 + Math.sin(angle * 3) * 0.12);
    let y = h * 0.5 + Math.sin(angle) * orbit * 0.52;
    const dx = x - fx;
    const dy = y - fy;
    const distance = Math.max(8, Math.hypot(dx, dy));
    const force = Math.exp(-distance / (min * 0.34)) * min * 0.16 * (state.pointer.down ? -1 : 1);
    x += (dx / distance) * force;
    y += (dy / distance) * force;
    const hue = state.pointer.down ? 302 + seed * 30 : 174 + seed * 68;
    ctx.fillStyle = `hsla(${hue},95%,70%,${0.28 + hash(i * 3.4) * 0.72})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.7 + seed * 2.1, 0, TAU);
    ctx.fill();
  }
  ctx.strokeStyle = state.pointer.down ? "rgba(255,132,241,0.8)" : "rgba(117,237,255,0.82)";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(fx, fy, min * (0.035 + i * 0.035) + Math.sin(t * 0.003 + i) * 3, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}
