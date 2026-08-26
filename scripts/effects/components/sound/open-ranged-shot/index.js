import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-ranged-shot", category: "sound", draw,
  card: {
    index: "S-103", title: "英雄远射", subtitle: "ACTION / RANGED SHOT",
    summary: "能量射击、远程攻击、科幻武器可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["远射","能量弹","射击","ranged","shot"],
    useCases: ["能量射击","远程攻击","科幻武器"],
    audio: { src: new URL("./assets/ranged_shot_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 ranged_shot_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
