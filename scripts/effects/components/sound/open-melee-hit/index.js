import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-melee-hit", category: "sound", draw,
  card: {
    index: "S-102", title: "英雄近战命中", subtitle: "ACTION / MELEE HIT",
    summary: "拳脚命中、武器近战、连招攻击可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["近战","命中","攻击","melee","hit"],
    useCases: ["拳脚命中","武器近战","连招攻击"],
    audio: { src: new URL("./assets/melee_hit_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 melee_hit_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
