import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "glass-break",
  category: "sound",
  draw,
  card: {
    index: "S-03",
    title: "玻璃碎裂",
    subtitle: "IMPACT / GLASS BREAK",
    summary: "高频碎片与清脆冲击，适合护盾破裂、容器击碎和场景破坏。",
    audioCategory: "impact",
    audioCategoryLabel: "冲击",
    keywords: ["玻璃", "碎裂", "破坏", "击碎", "撞碎", "护盾", "护盾破裂", "爆裂", "glass", "break", "shatter", "impact", "destroy", "shield"],
    useCases: ["护盾破裂", "物体击碎", "场景破坏"],
    audio: { src: new URL("./assets/glass_breaking.wav", import.meta.url).href, format: "WAV", duration: 1.61 },
    sourceName: "Godot Demo / chewiesmissus",
    sourceUrl: "https://github.com/godotengine/godot-demo-projects/blob/master/audio/audio_effects/sfx/glass_breaking.wav",
    license: "CC0 1.0",
    status: "READY TO USE",
    notes: "原始音效由 chewiesmissus 发布至 Freesound，Godot Audio Effects demo 将其标注为 CC0。",
  },
});
