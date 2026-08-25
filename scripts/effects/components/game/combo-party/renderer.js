import { casualPalette, hash, roundedRect } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#1c1032";
  ctx.fillRect(0, 0, w, h);
  const combo = state.custom.combo;
  const pulse = 1 + Math.max(0, 1 - (state.now - state.custom.lastCombo) / 420) * 0.18;
  const bursts = state.impulses.length ? state.impulses : [{ x: w / 2, y: h * 0.58, time: state.now - (t % 1900) }];
  bursts.filter((hit) => state.now - hit.time < 2100).forEach((hit, index) => {
    const age = (state.now - hit.time) * 0.001;
    for (let i = 0; i < Math.floor(52 * intensity); i++) {
      const angle = -Math.PI / 2 + (hash(i * 8.2 + index) - 0.5) * Math.PI * 1.5;
      const speed = 70 + hash(i * 3.3) * 180;
      const size = 3 + hash(i) * 7;
      ctx.save();
      ctx.translate(hit.x + Math.cos(angle) * speed * age, hit.y + Math.sin(angle) * speed * age + age * age * 95);
      ctx.rotate(age * (2 + hash(i) * 8));
      ctx.fillStyle = casualPalette[i % casualPalette.length];
      ctx.fillRect(-size / 2, -size / 4, size, size / 2);
      ctx.restore();
    }
  });
  ctx.save();
  ctx.translate(w / 2, h * 0.46);
  ctx.scale(pulse, pulse);
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `700 ${Math.min(w, h) * 0.2}px Arial`;
  ctx.fillText(`${combo}×`, 0, 0);
  ctx.restore();
  const meterW = Math.min(w * 0.48, 340);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  roundedRect(ctx, w / 2 - meterW / 2, h * 0.68, meterW, 6, 3);
  ctx.fill();
  ctx.fillStyle = "#ffc857";
  roundedRect(ctx, w / 2 - meterW / 2, h * 0.68, meterW * ((combo % 5 || 5) / 5), 6, 3);
  ctx.fill();
}
