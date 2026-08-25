import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-combo", category: "sound", draw,
  card: {
    index: "S-61", title: "连击语音", subtitle: "VOICE / COMBO",
    summary: "有力量的英文“Combo”播报，适合连续命中、消除连锁和倍率提升。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["连击","连锁","倍率","命中","播报","combo","voice","chain","multiplier"],
    useCases: ["连续命中","消除连锁","倍率提升"],
    audio: { src: new URL("./assets/combo.ogg", import.meta.url).href, format: "OGG", duration: 1.17 },
    sourceName: "Kenney Voiceover Pack: Fighter", sourceUrl: "https://kenney.nl/assets/voiceover-pack-fighter",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack: Fighter 的 combo。",
  },
});
