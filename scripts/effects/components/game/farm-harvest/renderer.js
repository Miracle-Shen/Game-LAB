import { clamp, hash, roundedRect } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#79d9f3"); sky.addColorStop(0.52, "#b8e8d4"); sky.addColorStop(0.53, "#74ba68"); sky.addColorStop(1, "#285b3d");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffe07a"; ctx.beginPath(); ctx.arc(w * 0.82, h * 0.18, Math.min(w, h) * 0.07, 0, Math.PI * 2); ctx.fill();
  const cols = 5; const rows = 3; const plotW = w * 0.12; const plotH = h * 0.12;
  const gapX = plotW * 0.16; const gapY = plotH * 0.18;
  const startX = (w - (cols * plotW + (cols - 1) * gapX)) / 2; const startY = h * 0.48;
  const hits = state.impulses.filter((hit) => state.now - hit.time < 1800);
  const activeHits = hits.length ? hits : [{ x: w * 0.5, y: h * 0.62, time: state.now - (t % 2600) }];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (plotW + gapX); const y = startY + row * (plotH + gapY);
      let harvest = 0;
      activeHits.forEach((hit) => {
        const age = state.now - hit.time;
        const wave = clamp(age / 900, 0, 1) * Math.min(w, h) * 0.6;
        harvest = Math.max(harvest, Math.max(0, 1 - Math.abs(Math.hypot(x + plotW / 2 - hit.x, y + plotH / 2 - hit.y) - wave) / (plotW * 0.8)));
      });
      ctx.fillStyle = row % 2 ? "#8f5b39" : "#7b492f"; roundedRect(ctx, x, y, plotW, plotH, 4); ctx.fill();
      for (let crop = 0; crop < 3; crop++) {
        const px = x + plotW * (0.22 + crop * 0.28); const py = y + plotH * 0.55 - harvest * 16;
        ctx.strokeStyle = "#2f8a48"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py + plotH * 0.25); ctx.lineTo(px, py - plotH * 0.18); ctx.stroke();
        ctx.fillStyle = crop % 2 ? "#ffbd3f" : "#f15d48"; ctx.beginPath(); ctx.arc(px, py - plotH * 0.24, plotH * 0.15 * (1 + harvest * 0.3), 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  activeHits.forEach((hit) => {
    const progress = clamp((state.now - hit.time) / 1500, 0, 1);
    for (let i = 0; i < Math.floor(24 * intensity); i++) {
      const angle = -Math.PI / 2 + (hash(i * 5.1) - 0.5) * 2.2;
      const speed = 40 + hash(i) * 100;
      ctx.fillStyle = i % 2 ? "#ffe062" : "#8be071";
      ctx.beginPath(); ctx.arc(hit.x + Math.cos(angle) * speed * progress, hit.y + Math.sin(angle) * speed * progress + progress * progress * 50, 2 + hash(i * 2.2) * 4, 0, Math.PI * 2); ctx.fill();
    }
  });
}
