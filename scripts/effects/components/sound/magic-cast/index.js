import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "magic-cast", category: "sound", draw,
  card: {
    index: "S-66", title: "魔法施放", subtitle: "MAGIC / SPELL CAST",
    summary: "明亮上扬的法术能量释放，适合技能施放、符文激活和传送触发。",
    audioCategory: "magic", audioCategoryLabel: "魔法",
    keywords: ["魔法", "法术", "施法", "技能", "符文", "能量", "传送", "magic", "spell", "cast", "rune", "teleport"],
    useCases: ["技能施放", "符文激活", "传送触发"],
    audio: { src: new URL("./assets/spell_01.ogg", import.meta.url).href, format: "OGG", duration: 0.63 },
    sourceName: "80 CC0 RPG SFX", sourceUrl: "https://opengameart.org/content/80-cc0-rpg-sfx",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 rubberduck 的 80 CC0 RPG SFX：spell_01；保留原始 OGG。",
  },
});
