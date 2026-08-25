import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "damage-hit", category: "sound", draw,
  card: {
    index: "S-38", title: "角色受伤", subtitle: "RETRO / DAMAGE HIT",
    summary: "极短的八位受伤触点，适合扣血、碰刺和连续小伤害反馈。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["受伤","扣血","碰刺","伤害","角色","damage","hit","hurt","health"],
    useCases: ["角色扣血","碰撞陷阱","连续伤害"],
    audio: { src: new URL("./assets/sfx_damage_hit1.wav", import.meta.url).href, format: "WAV", duration: 0.06 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Simple Damage Sounds 分类的 sfx_damage_hit1。",
  },
});
