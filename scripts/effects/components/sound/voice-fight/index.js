import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "voice-fight", category: "sound", draw,
  card: {
    index: "S-74", title: "开战播报", subtitle: "VOICE / FIGHT",
    summary: "强势的英文“Fight”开战播报，适合格斗回合、竞技开局和首领战触发。",
    audioCategory: "voice", audioCategoryLabel: "语音",
    keywords: ["开战", "战斗", "回合", "格斗", "竞技", "首领", "fight", "battle", "round", "voice"],
    useCases: ["格斗回合开始", "竞技对局开场", "首领战触发"],
    audio: { src: new URL("./assets/fight.ogg", import.meta.url).href, format: "OGG", duration: 0.93 },
    sourceName: "Kenney Voiceover Pack: Fighter", sourceUrl: "https://kenney.nl/assets/voiceover-pack-fighter",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Voiceover Pack: Fighter 的 fight；补充现有 Ready、Go 与 Winner 之外的强战斗语义。",
  },
});
