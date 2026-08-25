import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "knife-slice", category: "sound", draw,
  card: {
    index: "S-27", title: "刀刃切割", subtitle: "FOLEY / KNIFE SLICE",
    summary: "快速刀刃掠过与切入声，适合水果切割、制作加工和近战攻击。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["刀", "切割", "水果", "切片", "加工", "攻击", "knife", "slice", "cut", "fruit", "craft", "attack"],
    useCases: ["水果切割", "制作加工", "近战挥砍"],
    audio: { src: new URL("./assets/knifeSlice.ogg", import.meta.url).href, format: "OGG", duration: 0.60 },
    sourceName: "Kenney RPG Audio", sourceUrl: "https://kenney.nl/assets/rpg-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney RPG Audio 的 knifeSlice；适合作为切割动作的单次主体声音。",
  },
});
