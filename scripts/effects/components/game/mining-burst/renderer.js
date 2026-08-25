import { casualPalette, clamp, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#080a12";
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.52;
  const cy = h * 0.51;
  const radius = Math.min(w, h) * 0.25;
  const hits = state.impulses.filter((hit) => state.now - hit.time < 1900);
  const activeHits = hits.length ? hits : [{ x: cx + radius * 0.2, y: cy - radius * 0.15, time: state.now - (t % 2300) }];
  const cave = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.2);
  cave.addColorStop(0, "rgba(73,45,112,0.32)");
  cave.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cave;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < 11; i++) {
    const angle = -Math.PI / 2 + i * TAU / 11;
    const rr = radius * (0.82 + hash(i * 7.1) * 0.28);
    i ? ctx.lineTo(Math.cos(angle) * rr, Math.sin(angle) * rr) : ctx.moveTo(Math.cos(angle) * rr, Math.sin(angle) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = "#293047";
  ctx.fill();
  for (let i = 0; i < 13; i++) {
    const angle = hash(i * 4.8) * TAU;
    const rr = radius * (0.16 + hash(i * 9.3) * 0.62);
    const shard = radius * (0.045 + hash(i) * 0.045);
    ctx.fillStyle = i % 3 === 0 ? "#ff59dc" : i % 2 ? "#48e9ff" : "#9b7dff";
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * rr, Math.sin(angle) * rr - shard);
    ctx.lineTo(Math.cos(angle) * rr + shard, Math.sin(angle) * rr + shard);
    ctx.lineTo(Math.cos(angle) * rr - shard, Math.sin(angle) * rr + shard);
    ctx.fill();
  }
  ctx.restore();
  activeHits.forEach((hit, index) => {
    const progress = clamp((state.now - hit.time) / 1250, 0, 1);
    ctx.strokeStyle = `rgba(157,233,255,${1 - progress})`;
    ctx.beginPath();
    ctx.arc(hit.x, hit.y, 10 + progress * radius * 0.72, 0, TAU);
    ctx.stroke();
    for (let i = 0; i < Math.floor(34 * intensity); i++) {
      const angle = hash(i * 5.2 + index) * TAU;
      const distance = progress * radius * (0.35 + hash(i * 8.1) * 0.85);
      ctx.fillStyle = casualPalette[(i + 3) % casualPalette.length];
      ctx.fillRect(hit.x + Math.cos(angle) * distance, hit.y + Math.sin(angle) * distance, 3, 3);
    }
  });
  ctx.fillStyle = "rgba(240,240,250,0.72)";
  ctx.textAlign = "center";
  ctx.font = `700 ${Math.max(10, Math.min(w, h) * 0.025)}px Arial`;
  ctx.fillText(`ORE DEPTH ${Math.min(5, state.custom.miningPower || 1)}/5`, cx, cy + radius * 1.36);
}
