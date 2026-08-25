import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "defeat-trombone",
  category: "sound",
  draw,
  card: {
    index: "S-07",
    title: "失败长号",
    subtitle: "FEEDBACK / SAD TROMBONE",
    summary: "夸张的下行长号段落，适合喜剧式失败、落榜和低风险惩罚反馈。",
    audioCategory: "feedback",
    audioCategoryLabel: "反馈",
    keywords: ["失败", "落榜", "遗憾", "搞笑", "惩罚", "结束", "defeat", "lose", "failure", "sad", "trombone", "comedy"],
    useCases: ["关卡失败", "喜剧落败", "挑战结束"],
    audio: { src: new URL("./assets/sad_trombone.wav", import.meta.url).href, format: "WAV", duration: 5.21 },
    sourceName: "Godot Demo / kirbydx",
    sourceUrl: "https://github.com/godotengine/godot-demo-projects/blob/master/audio/audio_effects/sfx/sad_trombone.wav",
    license: "CC0 1.0",
    status: "READY TO USE",
    notes: "原始音效由 kirbydx 发布至 Freesound，Godot Audio Effects demo 将其标注为 CC0。",
  },
});
