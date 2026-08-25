import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "retro-jump", category: "sound", draw,
  card: {
    index: "S-29", title: "像素起跳", subtitle: "RETRO / JUMP",
    summary: "短促上扬的八位跳跃声，适合平台角色、弹簧和轻量跃迁动作。",
    audioCategory: "movement", audioCategoryLabel: "移动",
    keywords: ["跳跃","起跳","弹簧","平台","复古","像素","jump","spring","platform","retro"],
    useCases: ["角色起跳","弹簧弹起","平台跳跃"],
    audio: { src: new URL("./assets/sfx_movement_jump1.wav", import.meta.url).href, format: "WAV", duration: 0.14 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Jumping and Landing 分类的 sfx_movement_jump1。",
  },
});
