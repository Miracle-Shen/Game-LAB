import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-congratulations", category: "sound", draw,
  card: {
    index: "S-58", title: "恭喜语音", subtitle: "VOICE / CONGRATULATIONS",
    summary: "完整的英文“Congratulations”女声，适合大奖结算、章节完成和里程碑达成。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["恭喜","大奖","完成","里程碑","女声","congratulations","voice","reward","complete"],
    useCases: ["大奖结算","章节完成","里程碑达成"],
    audio: { src: new URL("./assets/congratulations.ogg", import.meta.url).href, format: "OGG", duration: 1.30 },
    sourceName: "Kenney Voiceover Pack", sourceUrl: "https://kenney.nl/assets/voiceover-pack",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack Female / congratulations。",
  },
});
