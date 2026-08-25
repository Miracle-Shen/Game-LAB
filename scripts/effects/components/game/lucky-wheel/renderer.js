import { clamp, hash, TAU } from "../../../shared/canvas.js";

const sparkUrl = new URL("./assets/spark-particle.png", import.meta.url).href;
let spark;

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#130f25";
  ctx.fillRect(0, 0, w, h);
  if (!spark && typeof Image !== "undefined") { spark = new Image(); spark.src = sparkUrl; }
  const elapsed = state.custom.lastSpin ? state.now - state.custom.lastSpin : t % 4200;
  const phase = clamp(elapsed / 3000, 0, 1);
  const eased = 1 - Math.pow(1 - phase, 4);
  const rotation = state.custom.spinCount * 1.17 + eased * TAU * 4.7;
  const cx = w * 0.5;
  const cy = h * 0.52;
  const radius = Math.min(w, h) * 0.28;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  const colors = ["#ff5b72", "#ffc857", "#47d8c5", "#7c6cff", "#4ca7ff", "#ff8f42", "#61db73", "#ed67c5"];
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, radius, i * TAU / colors.length, (i + 1) * TAU / colors.length); ctx.closePath(); ctx.fill();
  });
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.stroke();
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(cx, cy - radius - 7); ctx.lineTo(cx - 14, cy - radius - 34); ctx.lineTo(cx + 14, cy - radius - 34); ctx.fill();
  const winFlash = phase > 0.9 ? (phase - 0.9) * 10 : 0;
  for (let i = 0; i < 24 * intensity; i++) {
    const angle = hash(i * 4.3) * TAU;
    const distance = radius * (1.18 + hash(i) * 0.45);
    const size = 8 + hash(i * 2.7) * 18;
    ctx.globalAlpha = winFlash;
    if (spark?.complete) ctx.drawImage(spark, cx + Math.cos(angle) * distance - size / 2, cy + Math.sin(angle) * distance - size / 2, size, size);
  }
  ctx.globalAlpha = 1;
}
