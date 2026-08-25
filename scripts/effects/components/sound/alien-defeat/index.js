import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "alien-defeat", category: "sound", draw,
  card: {
    index: "S-41", title: "外星生物败退", subtitle: "RETRO / ALIEN DEFEAT",
    summary: "变调明显的外星生物失败声，适合怪物消失、异形受击和科幻敌人退场。",
    audioCategory: "character", audioCategoryLabel: "角色",
    keywords: ["外星","怪物","异形","败退","科幻","alien","monster","defeat","creature"],
    useCases: ["怪物败退","异形受击","科幻敌人退场"],
    audio: { src: new URL("./assets/sfx_deathscream_alien1.wav", import.meta.url).href, format: "WAV", duration: 1.50 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Death Screams / Alien 分类的 sfx_deathscream_alien1。",
  },
});
