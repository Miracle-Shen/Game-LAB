import { fract, hash } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  if (state?.mediaLayer) ctx.clearRect(0, 0, w, h);
  else {
    ctx.fillStyle = "#071018";
    ctx.fillRect(0, 0, w, h);
  }
  const wash = ctx.createLinearGradient(0, 0, w, h);
  wash.addColorStop(0, "rgba(18,55,79,0.08)");
  wash.addColorStop(1, `rgba(77,112,139,${state?.mediaLayer ? 0.12 : 0.25})`);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = "round";
  const count = Math.floor(100 * intensity);
  for (let i = 0; i < count; i++) {
    const seed = hash(i * 9.9);
    const speed = 0.00025 + seed * 0.00032;
    const y = fract(hash(i * 4.7) + t * speed) * (h + 70) - 50;
    const x = hash(i * 7.4) * (w + 100) - 50;
    const length = 10 + seed * 30;
    ctx.strokeStyle = `rgba(155,205,235,${0.18 + seed * 0.42})`;
    ctx.lineWidth = 0.7 + seed;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - length * 0.25, y + length);
    ctx.stroke();
  }
}
