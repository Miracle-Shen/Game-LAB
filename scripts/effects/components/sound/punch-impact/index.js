import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "punch-impact", category: "sound", draw,
  card: {
    index: "S-12", title: "重拳命中", subtitle: "IMPACT / HEAVY PUNCH",
    summary: "厚实的低频肉体冲击，适合角色攻击、Boss 受击和强力碰撞。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["拳击", "重击", "命中", "受击", "战斗", "碰撞", "punch", "hit", "heavy", "combat", "impact", "boss"],
    useCases: ["角色攻击", "Boss 受击", "强力碰撞"],
    audio: { src: new URL("./assets/impactPunch_heavy_001.ogg", import.meta.url).href, format: "OGG", duration: 0.54 },
    sourceName: "Kenney Impact Sounds", sourceUrl: "https://kenney.nl/assets/impact-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Impact Sounds 的 impactPunch_heavy_001；保留明显低频主体。",
  },
});
