import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "portal-warp", category: "sound", draw,
  card: {
    index: "S-31", title: "传送门跃迁", subtitle: "RETRO / PORTAL WARP",
    summary: "带扫描感的复古传送过程，适合切换场景、角色传送和关卡入口。",
    audioCategory: "digital", audioCategoryLabel: "电子",
    keywords: ["传送","跃迁","入口","切场","复古","像素","portal","warp","teleport","transition"],
    useCases: ["角色传送","关卡入口","场景切换"],
    audio: { src: new URL("./assets/sfx_movement_portal1.wav", import.meta.url).href, format: "WAV", duration: 1.40 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Portals and Transitions 分类的 sfx_movement_portal1。",
  },
});
