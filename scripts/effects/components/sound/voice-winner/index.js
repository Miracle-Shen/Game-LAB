import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-winner", category: "sound", draw,
  card: {
    index: "S-62", title: "胜者语音", subtitle: "VOICE / WINNER",
    summary: "醒目的英文“Winner”播报，适合竞技结算、冠军揭晓和淘汰赛胜出。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["胜者","冠军","竞技","结算","播报","winner","voice","champion","victory"],
    useCases: ["竞技结算","冠军揭晓","淘汰赛胜出"],
    audio: { src: new URL("./assets/winner.ogg", import.meta.url).href, format: "OGG", duration: 1.42 },
    sourceName: "Kenney Voiceover Pack: Fighter", sourceUrl: "https://kenney.nl/assets/voiceover-pack-fighter",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack: Fighter 的 winner。",
  },
});
