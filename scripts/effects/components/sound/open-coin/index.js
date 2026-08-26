import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-coin", category: "sound", draw,
  card: {
    index: "S-107", title: "英雄金币", subtitle: "REWARD / COIN",
    summary: "金币拾取、战利品收集、分数奖励可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["金币","收集","奖励","coin","pickup"],
    useCases: ["金币拾取","战利品收集","分数奖励"],
    audio: { src: new URL("./assets/coin_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 coin_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
