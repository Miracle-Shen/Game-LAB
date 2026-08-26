import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-ultimate", category: "sound", draw,
  card: {
    index: "S-109", title: "终极技能", subtitle: "ACTION / ULTIMATE",
    summary: "大招释放、全屏技能、能量爆发可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["终极技能","大招","爆发","ultimate","special"],
    useCases: ["大招释放","全屏技能","能量爆发"],
    audio: { src: new URL("./assets/ultimate_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 ultimate_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
