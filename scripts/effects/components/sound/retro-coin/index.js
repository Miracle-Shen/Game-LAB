import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "retro-coin", category: "sound", draw,
  card: {
    index: "S-28", title: "八位金币", subtitle: "RETRO / COIN PICKUP",
    summary: "清脆的复古金币拾取声，适合平台跳跃、收集路线和结算加分。",
    audioCategory: "feedback", audioCategoryLabel: "反馈",
    keywords: ["金币","拾取","收集","加分","复古","像素","coin","pickup","collect","retro"],
    useCases: ["金币拾取","分数增加","连续收集"],
    audio: { src: new URL("./assets/sfx_coin_single1.wav", import.meta.url).href, format: "WAV", duration: 0.42 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Coins 分类的 sfx_coin_single1；单枚拾取反馈短而明确。",
  },
});
