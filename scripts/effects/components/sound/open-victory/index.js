import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-victory", category: "sound", draw,
  card: {
    index: "S-108", title: "英雄胜利", subtitle: "ACTION / VICTORY",
    summary: "Boss 击败、关卡通关、战斗结算可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["英雄","胜利","通关","hero","victory"],
    useCases: ["Boss 击败","关卡通关","战斗结算"],
    audio: { src: new URL("./assets/victory_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 victory_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
