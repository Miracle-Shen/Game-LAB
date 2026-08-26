import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-city-battle-bgm", category: "sound", draw,
  card: {
    index: "S-117", title: "城市战斗配乐", subtitle: "BGM / CITY BATTLE",
    summary: "城市关卡、横版战斗、动作循环可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["配乐","城市","战斗","bgm","city"],
    useCases: ["城市关卡","横版战斗","动作循环"],
    audio: { src: new URL("./assets/level1_bgm.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 level1_bgm.wav；保留原始编码，不做去重或重编码。",
  },
});
