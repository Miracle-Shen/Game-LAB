import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-spit", category: "sound", draw,
  card: {
    index: "S-78", title: "短促喷射", subtitle: "PROJECTILE / SPIT",
    summary: "黏液喷射、小型弹丸、卡通攻击可使用的 OpenGame 演示原声音效。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["喷射","吐射","弹丸","spit","projectile"],
    useCases: ["黏液喷射","小型弹丸","卡通攻击"],
    audio: { src: new URL("./assets/sfx_spit.wav", import.meta.url).href, format: "WAV", duration: 0.3 },
    sourceName: "OpenGame · Hajimi Defense", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/hajimi/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Hajimi Defense 官方演示的 sfx_spit.wav；保留原始编码，不做去重或重编码。",
  },
});
