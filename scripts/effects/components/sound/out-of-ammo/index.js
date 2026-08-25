import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "out-of-ammo", category: "sound", draw,
  card: {
    index: "S-37", title: "弹药耗尽", subtitle: "RETRO / NO AMMO",
    summary: "干脆的空仓提示，适合弹药耗尽、技能冷却和不可用操作。",
    audioCategory: "feedback", audioCategoryLabel: "反馈",
    keywords: ["弹药","空仓","不可用","冷却","失败","no ammo","empty","cooldown","unavailable"],
    useCases: ["弹药耗尽","技能冷却","不可用操作"],
    audio: { src: new URL("./assets/sfx_wpn_noammo1.wav", import.meta.url).href, format: "WAV", duration: 0.10 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Weapons / Out of Ammo 分类的 sfx_wpn_noammo1。",
  },
});
