import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-go", category: "sound", draw,
  card: {
    index: "S-56", title: "开始语音", subtitle: "VOICE / GO",
    summary: "直接的英文“Go”女声，适合比赛开始、限时挑战和操作放行。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["开始","比赛","限时","放行","女声","go","voice","start","race"],
    useCases: ["比赛开始","限时挑战","操作放行"],
    audio: { src: new URL("./assets/go.ogg", import.meta.url).href, format: "OGG", duration: 0.60 },
    sourceName: "Kenney Voiceover Pack", sourceUrl: "https://kenney.nl/assets/voiceover-pack",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack Female / go。",
  },
});
