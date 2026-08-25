import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "retro-fanfare", category: "sound", draw,
  card: {
    index: "S-33", title: "过关号角", subtitle: "RETRO / FANFARE",
    summary: "紧凑的八位庆祝号角，适合关卡完成、成就解锁和小型胜利。",
    audioCategory: "feedback", audioCategoryLabel: "反馈",
    keywords: ["过关","胜利","庆祝","成就","号角","fanfare","victory","complete","achievement"],
    useCases: ["关卡完成","成就解锁","小型胜利"],
    audio: { src: new URL("./assets/sfx_sounds_fanfare1.wav", import.meta.url).href, format: "WAV", duration: 0.52 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Fanfares 分类的 sfx_sounds_fanfare1。",
  },
});
