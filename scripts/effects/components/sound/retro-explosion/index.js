import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "retro-explosion", category: "sound", draw,
  card: {
    index: "S-35", title: "像素爆炸", subtitle: "RETRO / HARD EXPLOSION",
    summary: "带颗粒噪声的硬质复古爆炸，适合炸弹、障碍清除和像素战斗。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["爆炸","炸弹","清除","战斗","复古","像素","explosion","bomb","blast","retro"],
    useCases: ["炸弹爆破","障碍清除","像素战斗"],
    audio: { src: new URL("./assets/sfx_exp_short_hard1.wav", import.meta.url).href, format: "WAV", duration: 0.60 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Explosions / Short 分类的 sfx_exp_short_hard1。",
  },
});
