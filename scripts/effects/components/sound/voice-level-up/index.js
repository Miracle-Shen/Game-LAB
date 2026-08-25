import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-level-up", category: "sound", draw,
  card: {
    index: "S-57", title: "升级语音", subtitle: "VOICE / LEVEL UP",
    summary: "清晰的英文“Level up”女声，适合角色升级、通行证推进和技能成长。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["升级","成长","技能","通行证","女声","level up","voice","upgrade","progress"],
    useCases: ["角色升级","通行证推进","技能成长"],
    audio: { src: new URL("./assets/level_up.ogg", import.meta.url).href, format: "OGG", duration: 0.78 },
    sourceName: "Kenney Voiceover Pack", sourceUrl: "https://kenney.nl/assets/voiceover-pack",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack Female / level_up。",
  },
});
