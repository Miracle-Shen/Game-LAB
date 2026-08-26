import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-cosmic-battle-bgm", category: "sound", draw,
  card: {
    index: "S-119", title: "宇宙战斗配乐", subtitle: "BGM / COSMIC BATTLE",
    summary: "宇宙关卡、Boss 战斗、终局循环可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["配乐","宇宙","战斗","bgm","cosmic"],
    useCases: ["宇宙关卡","Boss 战斗","终局循环"],
    audio: { src: new URL("./assets/level3_bgm.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 level3_bgm.wav；保留原始编码，不做去重或重编码。",
  },
});
