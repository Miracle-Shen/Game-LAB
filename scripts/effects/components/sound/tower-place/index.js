import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "tower-place", category: "sound", draw,
  card: {
    index: "S-71", title: "塔防部署", subtitle: "BUILD / TOWER PLACE",
    summary: "短促而结实的木质落地声，适合防御塔、建筑和路障完成部署。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["塔防", "建造", "部署", "放置", "建筑", "炮塔", "tower", "build", "place", "deploy"],
    useCases: ["防御塔放置", "建筑落成", "路障部署"],
    audio: { src: new URL("./assets/impactWood_heavy_000.ogg", import.meta.url).href, format: "OGG", duration: 0.31 },
    sourceName: "Kenney Impact Sounds", sourceUrl: "https://kenney.nl/assets/impact-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Impact Sounds 的 impactWood_heavy_000；用于为部署动作提供明确的落地重量。",
  },
});
