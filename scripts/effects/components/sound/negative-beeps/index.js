import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "negative-beeps",
  category: "sound",
  draw,
  card: {
    index: "S-02",
    title: "错误蜂鸣",
    subtitle: "UI / NEGATIVE BEEPS",
    summary: "连续的电子负反馈，适合无效操作、资源不足和关卡失败提示。",
    audioCategory: "feedback",
    audioCategoryLabel: "反馈",
    keywords: ["错误", "失败", "拒绝", "无效", "资源不足", "警告", "error", "fail", "denied", "invalid", "warning", "negative"],
    useCases: ["操作失败", "购买失败", "资源不足"],
    audio: { src: new URL("./assets/negative_beeps.wav", import.meta.url).href, format: "WAV", duration: 1.23 },
    sourceName: "Godot Demo / themusicalnomad",
    sourceUrl: "https://github.com/godotengine/godot-demo-projects/blob/master/audio/audio_effects/sfx/negative_beeps.wav",
    license: "CC0 1.0",
    status: "READY TO USE",
    notes: "原始音效由 themusicalnomad 发布至 Freesound，Godot Audio Effects demo 将其标注为 CC0。",
  },
});
