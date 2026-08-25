import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "character-meow",
  category: "sound",
  draw,
  card: {
    index: "S-05",
    title: "角色猫叫",
    subtitle: "CHARACTER / MEOW",
    summary: "自然、近距离的猫叫，适合宠物互动、角色回应和收集物提示。",
    audioCategory: "character",
    audioCategoryLabel: "角色",
    keywords: ["猫", "猫叫", "猫咪回应", "宠物", "动物", "角色", "回应", "meow", "cat", "pet", "animal", "character", "voice"],
    useCases: ["宠物互动", "角色回应", "动物提示"],
    audio: { src: new URL("./assets/Meow.wav", import.meta.url).href, format: "WAV", duration: 1.54 },
    sourceName: "Godot Demo / tuberatanka",
    sourceUrl: "https://github.com/godotengine/godot-demo-projects/blob/master/audio/audio_effects/sfx/Meow.wav",
    license: "CC0 1.0",
    status: "READY TO USE",
    notes: "原始音效由 tuberatanka 发布至 Freesound，Godot Audio Effects demo 将其标注为 CC0。",
  },
});
