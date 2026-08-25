import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "metal-impact", category: "sound", draw,
  card: {
    index: "S-13", title: "金属重击", subtitle: "IMPACT / HEAVY METAL",
    summary: "短促的金属撞击与高频尾响，适合装甲命中、机械落地和机关碰撞。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["金属", "装甲", "机械", "撞击", "落地", "机关", "metal", "armor", "machine", "clang", "impact", "collision"],
    useCases: ["装甲命中", "机械落地", "机关碰撞"],
    audio: { src: new URL("./assets/impactMetal_heavy_002.ogg", import.meta.url).href, format: "OGG", duration: 0.12 },
    sourceName: "Kenney Impact Sounds", sourceUrl: "https://kenney.nl/assets/impact-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Impact Sounds 的 impactMetal_heavy_002；适合与低频冲击叠加。",
  },
});
