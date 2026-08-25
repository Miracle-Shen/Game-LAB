import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-game-over", category: "sound", draw,
  card: {
    index: "S-59", title: "游戏结束语音", subtitle: "VOICE / GAME OVER",
    summary: "稳重的英文“Game over”男声，适合回合结束、挑战失败和街机结算。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["游戏结束","回合","失败","街机","男声","game over","voice","defeat","end"],
    useCases: ["回合结束","挑战失败","街机结算"],
    audio: { src: new URL("./assets/game_over.ogg", import.meta.url).href, format: "OGG", duration: 1.38 },
    sourceName: "Kenney Voiceover Pack", sourceUrl: "https://kenney.nl/assets/voiceover-pack",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack Male / game_over。",
  },
});
