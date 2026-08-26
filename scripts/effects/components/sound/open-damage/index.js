import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-damage", category: "sound", draw,
  card: {
    index: "S-105", title: "英雄受伤", subtitle: "ACTION / DAMAGE",
    summary: "角色受伤、生命扣减、重击反馈可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["受伤","伤害","英雄","damage","hurt"],
    useCases: ["角色受伤","生命扣减","重击反馈"],
    audio: { src: new URL("./assets/damage_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 damage_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
