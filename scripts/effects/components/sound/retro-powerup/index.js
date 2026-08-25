import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "retro-powerup", category: "sound", draw,
  card: {
    index: "S-39", title: "像素强化", subtitle: "RETRO / POWER UP",
    summary: "上扬展开的复古强化声，适合升级、临时增益和道具激活。",
    audioCategory: "feedback", audioCategoryLabel: "反馈",
    keywords: ["强化","升级","增益","道具","复古","power up","upgrade","buff","item"],
    useCases: ["角色强化","获得增益","道具激活"],
    audio: { src: new URL("./assets/sfx_sounds_powerup1.wav", import.meta.url).href, format: "WAV", duration: 0.84 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Positive Sounds 分类的 sfx_sounds_powerup1。",
  },
});
