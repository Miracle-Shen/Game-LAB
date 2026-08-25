import { hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  if (state?.mediaLayer) {
    ctx.clearRect(0, 0, w, h);
    const grade = ctx.createLinearGradient(0, 0, 0, h);
    grade.addColorStop(0, "rgba(14, 22, 28, 0.06)");
    grade.addColorStop(0.65, "rgba(213, 117, 45, 0.08)");
    grade.addColorStop(1, "rgba(0, 0, 0, 0.36)");
    ctx.fillStyle = grade;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,236,205,0.62)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 3; i++) {
      const bx = w * 0.2 + i * 34 + Math.sin(t * 0.0003 + i) * 18;
      const by = h * 0.23 + i * 14;
      ctx.beginPath();
      ctx.arc(bx, by, 7, Math.PI * 1.12, Math.PI * 1.85);
      ctx.arc(bx + 14, by, 7, Math.PI * 1.15, Math.PI * 1.88);
      ctx.stroke();
    }
    return;
  }
  const horizon = h * 0.62;
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#170d29");
  sky.addColorStop(0.48, "#a63f46");
  sky.addColorStop(0.7, "#ed8b4e");
  sky.addColorStop(1, "#12111b");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const sunX = w * 0.67;
  const sunY = horizon - h * 0.12 + Math.sin(t * 0.00025) * 4;
  const sunR = Math.min(w, h) * 0.1;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3.5);
  sunGlow.addColorStop(0, "rgba(255,247,206,1)");
  sunGlow.addColorStop(0.28, "rgba(255,180,87,0.5)");
  sunGlow.addColorStop(1, "rgba(255,120,58,0)");
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffe9aa";
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#11131a";
  ctx.beginPath();
  ctx.moveTo(0, horizon + 8);
  for (let x = 0; x <= w; x += w / 10) ctx.lineTo(x, horizon - hash(x * 0.1) * h * 0.16);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
}
