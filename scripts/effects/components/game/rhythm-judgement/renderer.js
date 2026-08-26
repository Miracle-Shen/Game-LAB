import { clamp, fract, TAU } from "../../../shared/canvas.js";

export const BEAT_DURATION = 900;

const gradeColors = { READY: "#ffffff", PERFECT: "#ffe977", GREAT: "#77eaff", GOOD: "#9d8cff", MISS: "#ff526b" };

export function draw(ctx, w, h, t, intensity, state) {
  const size = Math.min(w, h);
  const laneW = w * 0.13;
  const startX = (w - laneW * 4) / 2;
  const judgeY = h * 0.8;
  const beat = fract(t / BEAT_DURATION);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#100927");
  bg.addColorStop(1, "#060713");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  for (let lane = 0; lane < 4; lane += 1) {
    ctx.fillStyle = lane % 2 ? "rgba(115,87,224,0.08)" : "rgba(78,219,255,0.06)";
    ctx.fillRect(startX + lane * laneW, 0, laneW, h);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.strokeRect(startX + lane * laneW, 0, laneW, h);
  }

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 9; i += 1) {
    const lane = (i * 3 + 1) % 4;
    const p = fract(beat + i * 0.237);
    const y = h * (0.04 + p * 0.76);
    const x = startX + laneW * (lane + 0.5);
    const radius = size * 0.025;
    ctx.fillStyle = lane % 2 ? "rgba(171,121,255,0.85)" : "rgba(75,224,255,0.85)";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.roundRect(x - laneW * 0.36, y - radius, laneW * 0.72, radius * 2, radius); ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.88)";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(startX, judgeY); ctx.lineTo(startX + laneW * 4, judgeY); ctx.stroke();
  for (let lane = 0; lane < 4; lane += 1) {
    ctx.strokeStyle = lane === state.custom.lane ? "#ffffff" : "rgba(255,255,255,0.28)";
    ctx.lineWidth = lane === state.custom.lane ? 3 : 1;
    ctx.beginPath(); ctx.arc(startX + laneW * (lane + 0.5), judgeY, size * 0.035, 0, TAU); ctx.stroke();
  }

  const hitAge = state.custom.lastHit ? state.now - state.custom.lastHit : 9999;
  if (hitAge < 900) {
    const life = clamp(1 - hitAge / 900, 0, 1);
    const grade = state.custom.grade;
    const color = gradeColors[grade];
    const shake = grade === "MISS" ? Math.sin(hitAge * 0.09) * 7 * life : 0;
    const x = startX + laneW * (state.custom.lane + 0.5);
    ctx.save();
    ctx.translate(shake, 0);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, judgeY, size * (0.04 + (1 - life) * 0.18), 0, TAU); ctx.stroke();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.font = `900 ${Math.max(18, size * (grade === "PERFECT" ? 0.07 : 0.058))}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(grade, w * 0.5, h * (0.58 - (1 - life) * 0.08));
    ctx.restore();
  }

  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = `800 ${Math.max(11, size * 0.032)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`${state.custom.combo || 0} COMBO`, w * 0.5, h * 0.94);
}
