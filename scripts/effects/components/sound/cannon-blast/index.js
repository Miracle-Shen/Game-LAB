import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "cannon-blast", category: "sound", draw,
  card: {
    index: "S-36", title: "火炮轰鸣", subtitle: "RETRO / CANNON",
    summary: "厚重的复古火炮发射声，适合塔防炮台、舰船攻击和大型投射物。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["火炮","炮台","塔防","舰船","发射","cannon","turret","shot","blast"],
    useCases: ["塔防炮击","舰船攻击","大型投射物"],
    audio: { src: new URL("./assets/sfx_wpn_cannon1.wav", import.meta.url).href, format: "WAV", duration: 0.90 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Weapons / Cannon 分类的 sfx_wpn_cannon1。",
  },
});
