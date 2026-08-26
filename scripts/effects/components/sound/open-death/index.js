import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-death", category: "sound", draw,
  card: {
    index: "S-106", title: "英雄倒下", subtitle: "ACTION / DEATH",
    summary: "角色死亡、战斗失败、生命耗尽可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["倒下","死亡","失败","death","defeat"],
    useCases: ["角色死亡","战斗失败","生命耗尽"],
    audio: { src: new URL("./assets/death_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 death_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
