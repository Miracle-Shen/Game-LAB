import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-carrier-battle-bgm", category: "sound", draw,
  card: {
    index: "S-118", title: "空中基地配乐", subtitle: "BGM / CARRIER BATTLE",
    summary: "空中基地、科技关卡、动作循环可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["配乐","基地","战斗","bgm","carrier"],
    useCases: ["空中基地","科技关卡","动作循环"],
    audio: { src: new URL("./assets/level2_bgm.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 level2_bgm.wav；保留原始编码，不做去重或重编码。",
  },
});
