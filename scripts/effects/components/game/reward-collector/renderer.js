import { clamp, hash, TAU } from "../../../shared/canvas.js";

const sparkUrl = new URL("./assets/spark-particle.png", import.meta.url).href;
let spark;

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#08141a";
  ctx.fillRect(0, 0, w, h);
  if (!spark && typeof Image !== "undefined") { spark = new Image(); spark.src = sparkUrl; }
  const target = { x: w * 0.82, y: h * 0.31 };
  const hit = state.impulses.at(-1) || { x: w * 0.35, y: h * 0.7, time: state.now - (t % 2600) };
  const age = state.now - hit.time;
  for (let i = 0; i < Math.floor(18 * intensity); i++) {
    const delay = i * 42;
    const progress = clamp((age - delay) / 900, 0, 1);
    const startX = hit.x + (hash(i * 3.1) - 0.5) * 120;
    const startY = hit.y + (hash(i * 7.2) - 0.5) * 80;
    const x = startX + (target.x - startX) * progress;
    const y = startY + (target.y - startY) * progress - Math.sin(progress * Math.PI) * h * 0.22;
    const size = 7 + hash(i) * 9;
    ctx.fillStyle = i % 3 === 0 ? "#64e4ff" : "#ffd15c";
    ctx.beginPath(); ctx.arc(x, y, size, 0, TAU); ctx.fill();
    if (spark?.complete) {
      ctx.globalAlpha = 1 - progress;
      ctx.drawImage(spark, x - size * 1.5, y - size * 1.5, size * 3, size * 3);
      ctx.globalAlpha = 1;
    }
  }
  const pulse = age > 700 && age < 1200 ? Math.sin(clamp((age - 700) / 500, 0, 1) * Math.PI) : 0;
  ctx.save();
  ctx.translate(target.x, target.y);
  ctx.scale(1 + pulse * 0.18, 1 + pulse * 0.18);
  ctx.fillStyle = "rgba(7,16,24,0.86)"; ctx.strokeStyle = "#ffd15c"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-54, -24, 108, 48, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#ffd15c"; ctx.font = "700 18px Arial"; ctx.textAlign = "center"; ctx.fillText(`${state.custom.collected}`, 8, 7);
  ctx.beginPath(); ctx.arc(-28, 0, 9, 0, TAU); ctx.fill();
  ctx.restore();
}
