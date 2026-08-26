import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "radio-static",
  category: "sound",
  draw,
  card: {
    index: "S-04",
    title: "无线电噪声",
    subtitle: "AMBIENCE / STATIC",
    summary: "持续的模拟静电纹理，适合通讯干扰、故障设备和紧张环境铺底。",
    audioCategory: "bgm",
    audioCategoryLabel: "BGM",
    keywords: ["静电", "噪声", "无线电", "通讯", "干扰", "故障", "环境", "static", "radio", "noise", "interference", "glitch", "ambience"],
    useCases: ["通讯干扰", "设备故障", "环境铺底"],
    audio: { src: new URL("./assets/Static.wav", import.meta.url).href, format: "WAV", duration: 5.59 },
    sourceName: "Godot Demo / dotY21",
    sourceUrl: "https://github.com/godotengine/godot-demo-projects/blob/master/audio/audio_effects/sfx/Static.wav",
    license: "CC0 1.0",
    status: "READY TO USE",
    notes: "原始音效由 dotY21 发布至 Freesound，Godot Audio Effects demo 将其标注为 CC0。",
  },
});
