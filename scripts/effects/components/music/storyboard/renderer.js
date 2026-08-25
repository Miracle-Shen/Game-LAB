import { fract, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  const sceneTime = ((t * 0.00015) % 3 + 3) % 3;
  const scene = Math.floor(sceneTime);
  const progress = fract(t * 0.00015);
  const skies = [["#09172a", "#24485d"], ["#1b1230", "#a74959"], ["#07161b", "#174956"]];
  if (state?.mediaLayer) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `rgba(240,240,250,${0.02 + (1 - progress) * 0.1})`;
    ctx.fillRect(0, 0, w, h);
    const margin = Math.min(w, h) * 0.07;
    ctx.strokeStyle = "rgba(240,240,250,0.3)";
    ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
    return;
  }
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, skies[scene][0]);
  sky.addColorStop(1, skies[scene][1]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = scene === 1 ? "#f3b16a" : "rgba(213,235,239,0.72)";
  ctx.beginPath();
  ctx.arc(w * (0.24 + scene * 0.24), h * 0.27, Math.min(w, h) * 0.06, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#06090c";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.65);
  ctx.lineTo(w * 0.25, h * (0.48 + scene * 0.04));
  ctx.lineTo(w * 0.52, h * 0.68);
  ctx.lineTo(w * 0.78, h * (0.48 - scene * 0.03));
  ctx.lineTo(w, h * 0.65);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
}
