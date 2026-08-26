import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "monster-roar", category: "sound", draw,
  card: {
    index: "S-67", title: "怪物咆哮", subtitle: "CHARACTER / MONSTER ROAR",
    summary: "粗粝低沉的怪物吼叫，适合首领登场、敌人警觉和近距离威吓。",
    audioCategory: "character", audioCategoryLabel: "角色",
    keywords: ["怪物", "咆哮", "怒吼", "首领", "敌人", "警觉", "威吓", "monster", "roar", "boss", "enemy", "creature"],
    useCases: ["首领登场", "敌人警觉", "近距离威吓"],
    audio: { src: new URL("./assets/creature_roar_02.ogg", import.meta.url).href, format: "OGG", duration: 1.04 },
    sourceName: "80 CC0 RPG SFX", sourceUrl: "https://opengameart.org/content/80-cc0-rpg-sfx",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 rubberduck 的 80 CC0 RPG SFX：creature_roar_02；适合中型或大型生物。",
  },
});
