import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

const breakSoundUrl = new URL("./assets/sfx_break.wav", import.meta.url).href;
let breakSound;

function playBreakSound() {
  if (typeof Audio === "undefined") return;
  breakSound ??= new Audio(breakSoundUrl);
  breakSound.currentTime = 0;
  breakSound.volume = 0.72;
  breakSound.play().catch(() => {});
}

export default defineEffectComponent({
  id: "breakable-obstacle", category: "game", draw,
  createState: () => ({ durability: 3, lastHit: 0, variant: 0 }),
  onPointerDown: ({ state, now }) => {
    if (state.custom.durability <= 0) {
      state.custom.durability = 3;
      state.custom.variant = (state.custom.variant + 1) % 2;
    } else {
      state.custom.durability -= 1;
      if (state.custom.durability === 0) playBreakSound();
    }
    state.custom.lastHit = now;
  },
  card: {
    index: "G-45", track: "WORLD INTERACTION", tags: ["策略", "破坏", "障碍"], interaction: "连续点击击碎障碍，完全破坏后再次点击重置",
    title: "可破坏障碍", subtitle: "BREAKABLE / OBSTACLE", summary: "OpenGame 原版纸箱与鞋堆素材结合耐久分段、裂纹、碎片飞散和地块解锁反馈。",
    sourceName: "OpenGame · Hajimi Defense", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/hajimi/index.html", license: "Apache-2.0", status: "BREAKABLE OBJECT",
    notes: "使用 OpenGame Hajimi Defense 官方演示的 obstacle_box.png、obstacle_shoe.png 与 sfx_break.wav；裂纹、碎片和耐久反馈由 Canvas 补充实现。",
  },
});
