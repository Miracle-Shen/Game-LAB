import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-high-score", category: "sound", draw,
  card: {
    index: "S-60", title: "新纪录语音", subtitle: "VOICE / NEW HIGH SCORE",
    summary: "英文“New high score”女声，适合排行榜刷新、个人纪录和无尽模式结算。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["新纪录","最高分","排行","无尽模式","女声","high score","record","leaderboard","voice"],
    useCases: ["排行榜刷新","个人纪录","无尽模式结算"],
    audio: { src: new URL("./assets/new_highscore.ogg", import.meta.url).href, format: "OGG", duration: 1.14 },
    sourceName: "Kenney Voiceover Pack", sourceUrl: "https://kenney.nl/assets/voiceover-pack",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack Female / new_highscore。",
  },
});
