import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-ready", category: "sound", draw,
  card: {
    index: "S-55", title: "准备语音", subtitle: "VOICE / READY",
    summary: "清晰的英文“Ready”女声，适合开局预备、倒计时前奏和竞速起跑。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["准备","开局","倒计时","竞速","女声","ready","voice","start","countdown"],
    useCases: ["开局预备","倒计时前奏","竞速起跑"],
    audio: { src: new URL("./assets/ready.ogg", import.meta.url).href, format: "OGG", duration: 0.50 },
    sourceName: "Kenney Voiceover Pack", sourceUrl: "https://kenney.nl/assets/voiceover-pack",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack Female / ready。",
  },
});
