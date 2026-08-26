import { clamp, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  const s = Math.min(w, h); const x = state.custom.x || w * 0.55; const y = state.custom.y || h * 0.64;
  const age = state.custom.lastImpact ? state.now - state.custom.lastImpact : t % 2600; const p = clamp(age / 1050, 0, 1); const fade = 1 - p;
  const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, "#17223a"); bg.addColorStop(1, "#080c14"); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(126,151,183,.13)"; ctx.lineWidth = 1;
  for (let i = -8; i < 10; i += 1) { ctx.beginPath(); ctx.moveTo(w * .5, h * .28); ctx.lineTo(w * .5 + i * s * .15, h); ctx.stroke(); }
  for (let i = 0; i < 7; i += 1) { const yy = h * .3 + i * i * s * .016; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(w, yy); ctx.stroke(); }
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i += 1) { const q = clamp(p - i * .11, 0, 1); ctx.strokeStyle = `rgba(${255-i*34},${168+i*22},82,${fade * (.8-i*.18)})`; ctx.lineWidth = s * (.014 - i * .003); ctx.beginPath(); ctx.ellipse(x, y, s * (.05 + q * (.36 + i * .06)), s * (.02 + q * (.12 + i * .02)), 0, 0, TAU); ctx.stroke(); }
  for (let i = 0; i < 18 * intensity; i += 1) { const a = hash(i * 8.31) * TAU; const d = s * p * (.08 + hash(i + 20) * .32); ctx.fillStyle = `rgba(255,190,99,${fade})`; ctx.save(); ctx.translate(x + Math.cos(a) * d, y + Math.sin(a) * d * .36 - Math.sin(p * Math.PI) * s * .12 * hash(i)); ctx.rotate(a); ctx.fillRect(-s*.012, -s*.005, s*.024, s*.01); ctx.restore(); }
  ctx.restore();
  ctx.strokeStyle = `rgba(255,222,156,${.3 + fade*.6})`; ctx.lineWidth = 2;
  for (let i=0;i<7;i+=1) { const a = i / 7 * TAU + .2; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x + Math.cos(a)*s*(.1+p*.18), y + Math.sin(a)*s*(.04+p*.07)); ctx.stroke(); }
}
