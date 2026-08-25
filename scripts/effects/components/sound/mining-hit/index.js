import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "mining-hit", category: "sound", draw,
  card: {
    index: "S-14", title: "矿镐命中", subtitle: "IMPACT / MINING HIT",
    summary: "石质主体与工具敲击并存，适合挖矿、岩石破坏和资源采集。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["挖矿", "矿镐", "石头", "岩石", "采集", "敲击", "mining", "pickaxe", "stone", "rock", "harvest", "hit"],
    useCases: ["矿石开采", "岩石破坏", "资源采集"],
    audio: { src: new URL("./assets/impactMining_001.ogg", import.meta.url).href, format: "OGG", duration: 0.87 },
    sourceName: "Kenney Impact Sounds", sourceUrl: "https://kenney.nl/assets/impact-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Impact Sounds 的 impactMining_001；可直接对应挖矿循环中的单次命中。",
  },
});
