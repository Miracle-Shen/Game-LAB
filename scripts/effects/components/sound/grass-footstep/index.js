import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "grass-footstep", category: "sound", draw,
  card: {
    index: "S-15", title: "草地脚步", subtitle: "MOVEMENT / GRASS STEP",
    summary: "柔软、略带草叶摩擦的单步，适合农场、户外探索和休闲角色移动。",
    audioCategory: "movement", audioCategoryLabel: "移动",
    keywords: ["脚步", "草地", "走路", "户外", "农场", "移动", "footstep", "grass", "walk", "outdoor", "farm", "movement"],
    useCases: ["户外行走", "农场移动", "角色脚步"],
    audio: { src: new URL("./assets/footstep_grass_002.ogg", import.meta.url).href, format: "OGG", duration: 0.69 },
    sourceName: "Kenney Impact Sounds", sourceUrl: "https://kenney.nl/assets/impact-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Impact Sounds 的 footstep_grass_002；适合作为脚步随机池的代表样本。",
  },
});
