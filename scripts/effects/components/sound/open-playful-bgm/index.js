import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-playful-bgm", category: "sound", draw,
  card: {
    index: "S-110", title: "轻快塔防配乐", subtitle: "BGM / PLAYFUL DEFENSE",
    summary: "塔防循环、休闲战斗、轻快场景可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["配乐","轻快","塔防","bgm","playful"],
    useCases: ["塔防循环","休闲战斗","轻快场景"],
    audio: { src: new URL("./assets/bgm_playful.wav", import.meta.url).href, format: "WAV", duration: 20 },
    sourceName: "OpenGame · Hajimi Defense", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/hajimi/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Hajimi Defense 官方演示的 bgm_playful.wav；保留原始编码，不做去重或重编码。",
  },
});
