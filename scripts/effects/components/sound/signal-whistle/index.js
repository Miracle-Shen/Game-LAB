import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "signal-whistle",
  category: "sound",
  draw,
  card: {
    index: "S-06",
    title: "哨声信号",
    subtitle: "SIGNAL / WHISTLE",
    summary: "穿透力强的人声哨音，适合召唤、比赛开场、远距离提醒和 NPC 信号。",
    audioCategory: "signal",
    audioCategoryLabel: "信号",
    keywords: ["哨声", "口哨", "召唤", "开场", "提醒", "信号", "whistle", "call", "start", "alert", "signal", "npc"],
    useCases: ["比赛开场", "召唤伙伴", "远距离提醒"],
    audio: { src: new URL("./assets/Whistle.wav", import.meta.url).href, format: "WAV", duration: 1.52 },
    sourceName: "Godot Demo / OwlStorm",
    sourceUrl: "https://github.com/godotengine/godot-demo-projects/blob/master/audio/audio_effects/sfx/Whistle.wav",
    license: "CC0 1.0",
    status: "READY TO USE",
    notes: "原始音效由 OwlStorm 发布至 Freesound，Godot Audio Effects demo 将其标注为 CC0。",
  },
});
