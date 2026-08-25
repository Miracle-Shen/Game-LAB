import { clamp, fract, hash, lerp, TAU } from "../../../shared/canvas.js";

function drawCoin(ctx, x, y, radius, phase, alpha = 1) {
  const turn = Math.cos(phase);
  const faceWidth = radius * (0.26 + Math.abs(turn) * 0.74);
  const edge = Math.sign(turn || 1) * radius * 0.16;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = "rgba(255, 190, 45, 0.92)";
  ctx.shadowBlur = radius * 1.25;

  ctx.fillStyle = "#9b5706";
  ctx.beginPath();
  ctx.ellipse(edge, 0, faceWidth, radius, 0, 0, TAU);
  ctx.fill();

  const face = ctx.createRadialGradient(-faceWidth * 0.38, -radius * 0.42, radius * 0.08, 0, 0, radius);
  face.addColorStop(0, "#fff7aa");
  face.addColorStop(0.34, "#ffd84d");
  face.addColorStop(0.76, "#f2a900");
  face.addColorStop(1, "#a95b00");
  ctx.fillStyle = face;
  ctx.strokeStyle = "rgba(255, 241, 143, 0.95)";
  ctx.lineWidth = Math.max(1, radius * 0.11);
  ctx.beginPath();
  ctx.ellipse(0, 0, faceWidth, radius, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();

  if (faceWidth > radius * 0.46) {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(139, 77, 0, 0.72)";
    ctx.lineWidth = Math.max(1, radius * 0.12);
    ctx.beginPath();
    ctx.ellipse(0, 0, faceWidth * 0.62, radius * 0.65, 0, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 245, 166, 0.92)";
    ctx.lineWidth = Math.max(1, radius * 0.1);
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.38);
    ctx.lineTo(0, radius * 0.38);
    ctx.stroke();
  }
  ctx.restore();
}

export function draw(ctx, w, h, t, intensity, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#081633");
  sky.addColorStop(0.48, "#55315e");
  sky.addColorStop(1, "#07080f");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const horizon = h * 0.34;
  const center = w / 2;
  ctx.fillStyle = "rgba(5,7,16,0.86)";
  for (let i = 0; i < 15; i++) {
    const buildingWidth = 18 + hash(i * 4.1) * 54;
    const buildingHeight = 28 + hash(i * 9.3) * h * 0.24;
    const x = (i / 14) * w - buildingWidth / 2;
    ctx.fillRect(x, horizon - buildingHeight, buildingWidth, buildingHeight);
    ctx.fillStyle = "rgba(117,220,255,0.32)";
    for (let windowY = horizon - buildingHeight + 9; windowY < horizon - 8; windowY += 13) {
      ctx.fillRect(x + 7, windowY, 3, 4);
    }
    ctx.fillStyle = "rgba(5,7,16,0.86)";
  }
  ctx.fillStyle = "#0b0d18";
  ctx.beginPath();
  ctx.moveTo(w * 0.37, horizon); ctx.lineTo(w * 0.63, horizon); ctx.lineTo(w * 0.92, h); ctx.lineTo(w * 0.08, h); ctx.fill();
  ctx.strokeStyle = "rgba(87,223,255,0.48)";
  for (const side of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(center + side * w * 0.13, horizon); ctx.lineTo(center + side * w * 0.42, h); ctx.stroke();
  }
  for (let i = 0; i < 12; i++) {
    const z = fract(i / 12 + t * 0.00048 * intensity);
    const y = horizon + Math.pow(z, 2.2) * (h - horizon);
    const roadHalf = lerp(w * 0.12, w * 0.42, Math.pow(z, 1.7));
    ctx.strokeStyle = `rgba(240,240,250,${0.08 + z * 0.38})`;
    ctx.beginPath(); ctx.moveTo(center - roadHalf, y); ctx.lineTo(center + roadHalf, y); ctx.stroke();
  }
  const lane = state.pointer.active ? clamp((state.pointer.x / w - 0.5) * 2, -1, 1) : Math.sin(t * 0.0006) * 0.5;
  const runnerX = center + lane * w * 0.19;
  const jumpProgress = clamp((state.now - (state.custom.lastJump || 0)) / 720, 0, 1);
  const jump = state.custom.lastJump ? Math.sin(jumpProgress * Math.PI) * h * 0.13 : 0;
  const runnerY = h * 0.7 - jump;
  ctx.save();
  ctx.translate(runnerX, runnerY);
  ctx.fillStyle = "#f4f1ff";
  ctx.shadowColor = "#72eaff";
  ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(0, -25, 10, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#f4f1ff"; ctx.lineWidth = 7; ctx.beginPath();
  const stride = Math.sin(t * 0.012);
  ctx.moveTo(0, -15); ctx.lineTo(0, 18);
  ctx.moveTo(0, -4); ctx.lineTo(-16, 10 + stride * 8);
  ctx.moveTo(0, -4); ctx.lineTo(16, 10 - stride * 8);
  ctx.moveTo(0, 18); ctx.lineTo(-12, 40 - stride * 10);
  ctx.moveTo(0, 18); ctx.lineTo(12, 40 + stride * 10);
  ctx.stroke();
  ctx.restore();

  const coinLanes = [-1, -1, -1, 0, 0, 0, 1, 1, 1, 0, 0, -1, -1, 0, 1, 1, 0, 0];
  for (let i = 0; i < coinLanes.length; i++) {
    const z = fract(i / coinLanes.length + t * 0.0003 * intensity);
    const y = horizon + Math.pow(z, 2) * (h - horizon);
    const x = center + coinLanes[i] * lerp(w * 0.035, w * 0.2, z);
    const bob = Math.sin(t * 0.004 + i * 0.8) * (2 + z * 4);
    drawCoin(ctx, x, y + bob, 4 + z * 10, t * 0.005 + i * 0.72, 0.5 + z * 0.5);
  }

  const lastPickup = state.custom.lastPickup || 0;
  const pickupAge = state.now - lastPickup;
  if (lastPickup && pickupAge >= 0 && pickupAge < 680) {
    const progress = pickupAge / 680;
    const fade = 1 - progress;
    const pickupY = runnerY - 30 - progress * h * 0.12;
    drawCoin(ctx, runnerX, pickupY, 13 + progress * 8, t * 0.009, fade);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 16; i++) {
      const angle = i / 16 * TAU + hash(i * 6.4) * 0.35;
      const distance = progress * (28 + hash(i * 3.1) * 58);
      const particleX = runnerX + Math.cos(angle) * distance;
      const particleY = pickupY + Math.sin(angle) * distance;
      ctx.fillStyle = `rgba(255, ${190 + Math.floor(hash(i) * 55)}, 62, ${fade})`;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 1.5 + (1 - progress) * 2.5, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = "#fff5a8";
    ctx.font = `700 ${Math.max(14, Math.min(w, h) * 0.028)}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("+1", runnerX + 30, pickupY - 8);
    ctx.restore();
  }
}
