import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-sci-fi-bgm", category: "sound", draw,
  card: {
    index: "S-120", title: "科幻潜入配乐", subtitle: "BGM / SCI-FI INFILTRATION",
    summary: "科幻基地、潜入行动、俯视射击可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["配乐","科幻","潜入","bgm","sci fi"],
    useCases: ["科幻基地","潜入行动","俯视射击"],
    audio: { src: new URL("./assets/global_bgm.mp3", import.meta.url).href, format: "MP3", duration: 58.8 },
    sourceName: "OpenGame · Mandalorian Protocol", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/starWars/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Mandalorian Protocol 官方演示的 global_bgm.wav；保留原始编码，不做去重或重编码。",
  },
});
