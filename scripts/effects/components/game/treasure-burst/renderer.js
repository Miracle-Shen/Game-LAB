import { clamp, hash, TAU } from "../../../shared/canvas.js";

const textureUrls = {
  fire: new URL("./assets/fire-particle.png", import.meta.url).href,
  smoke: new URL("./assets/smoke-particle.png", import.meta.url).href,
  spark: new URL("./assets/spark-particle.png", import.meta.url).href,
};
const textures = new Map();

function texture(name) {
  if (typeof Image === "undefined") return null;
  if (!textures.has(name)) {
    const image = new Image();
    image.src = textureUrls[name];
    textures.set(name, image);
  }
  return textures.get(name);
}

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#170d0b";
  ctx.fillRect(0, 0, w, h);
  const elapsed = state.custom.lastOpen ? state.now - state.custom.lastOpen : t % 2600;
  const progress = clamp(elapsed / 1200, 0, 1);
  const cx = w * 0.5;
  const cy = h * 0.61;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.48);
  glow.addColorStop(0, `rgba(255,190,62,${0.42 * (1 - progress)})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  const smoke = texture("smoke");
  const spark = texture("spark");
  for (let i = 0; i < Math.floor(42 * intensity); i++) {
    const angle = -Math.PI / 2 + (hash(i * 6.1) - 0.5) * 2.4;
    const speed = 80 + hash(i * 3.7) * 220;
    const x = cx + Math.cos(angle) * speed * progress;
    const y = cy + Math.sin(angle) * speed * progress + progress * progress * 120;
    const size = 8 + hash(i) * 22;
    ctx.globalAlpha = 1 - progress;
    if (i % 4 === 0 && smoke?.complete) ctx.drawImage(smoke, x - size, y - size, size * 2, size * 2);
    else if (spark?.complete) ctx.drawImage(spark, x - size / 2, y - size / 2, size, size);
    else { ctx.fillStyle = i % 3 ? "#ffd15c" : "#ff7b38"; ctx.fillRect(x, y, size * 0.32, size); }
  }
  ctx.globalAlpha = 1;
  const chestW = Math.min(w, h) * 0.28;
  const chestH = chestW * 0.58;
  ctx.fillStyle = "#7d351d";
  ctx.fillRect(cx - chestW / 2, cy - chestH / 2, chestW, chestH);
  ctx.fillStyle = "#e6a83b";
  ctx.fillRect(cx - chestW / 2, cy - chestH * 0.12, chestW, chestH * 0.14);
  ctx.save();
  ctx.translate(cx, cy - chestH / 2);
  ctx.rotate(-Math.sin(Math.min(progress, 1) * Math.PI) * 0.6);
  ctx.fillStyle = "#9b4826";
  ctx.fillRect(-chestW / 2, -chestH * 0.34, chestW, chestH * 0.34);
  ctx.restore();
  ctx.fillStyle = "#ffe07a";
  ctx.fillRect(cx - chestW * 0.06, cy - chestH * 0.1, chestW * 0.12, chestH * 0.24);
  for (let i = 0; i < 12; i++) {
    const angle = hash(i * 4.2) * TAU;
    ctx.fillStyle = "#ffd15c";
    ctx.beginPath(); ctx.arc(cx + Math.cos(angle) * progress * chestW, cy - chestH * 0.25 + Math.sin(angle) * progress * chestH, 4 + hash(i) * 5, 0, TAU); ctx.fill();
  }
}
