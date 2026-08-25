import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "reward-ding",
  category: "sound",
  draw,
  card: {
    index: "S-01",
    title: "奖励清响",
    subtitle: "REWARD / DING",
    summary: "明亮、短促的确认提示，适合金币到账、奖励领取和任务完成。",
    audioCategory: "feedback",
    audioCategoryLabel: "反馈",
    keywords: ["奖励", "金币", "成功", "完成", "解锁", "拾取", "确认", "reward", "coin", "success", "pickup", "ding", "chime"],
    useCases: ["奖励到账", "任务完成", "道具拾取"],
    audio: { src: new URL("./assets/Ding.wav", import.meta.url).href, format: "WAV", duration: 2.8 },
    sourceName: "Godot Demo / MatthewWong",
    sourceUrl: "https://github.com/godotengine/godot-demo-projects/blob/master/audio/audio_effects/sfx/Ding.wav",
    license: "CC0 1.0",
    status: "READY TO USE",
    notes: "原始音效由 MatthewWong 发布至 Freesound，Godot Audio Effects demo 将其标注为 CC0。",
  },
});
