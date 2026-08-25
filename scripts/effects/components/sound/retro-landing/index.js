import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "retro-landing", category: "sound", draw,
  card: {
    index: "S-30", title: "像素落地", subtitle: "RETRO / LANDING",
    summary: "极短的像素落地触点，适合角色着地、方块归位和小型碰撞。",
    audioCategory: "movement", audioCategoryLabel: "移动",
    keywords: ["落地","着地","方块","碰撞","复古","像素","landing","ground","block","retro"],
    useCases: ["角色落地","方块归位","轻型碰撞"],
    audio: { src: new URL("./assets/sfx_movement_jump10_landing.wav", import.meta.url).href, format: "WAV", duration: 0.07 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Jumping and Landing 分类的 sfx_movement_jump10_landing。",
  },
});
