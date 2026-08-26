import { defineEffectComponent } from "../../../component-registry.js";
import { draw, BEAT_DURATION } from "./renderer.js";

export default defineEffectComponent({
  id: "rhythm-judgement", category: "game", draw,
  createState: () => ({ lastHit: 0, grade: "READY", combo: 0, lane: 1 }),
  onPointerDown: ({ point, state, now, instance }) => {
    const beat = ((now - instance.start) % BEAT_DURATION) / BEAT_DURATION;
    const error = Math.min(beat, 1 - beat);
    state.custom.grade = error < 0.07 ? "PERFECT" : error < 0.16 ? "GREAT" : error < 0.28 ? "GOOD" : "MISS";
    state.custom.combo = state.custom.grade === "MISS" ? 0 : state.custom.combo + 1;
    state.custom.lane = Math.max(0, Math.min(3, Math.floor(point.x / instance.width * 4)));
    state.custom.lastHit = now;
  },
  card: {
    index: "G-27", track: "RHYTHM FEEDBACK", tags: ["节奏", "判定", "连击"],
    interaction: "在音符抵达判定线时点击对应轨道，观察四级判定与连击反馈",
    title: "节奏分级判定", subtitle: "RHYTHM / HIT GRADES",
    summary: "Perfect、Great、Good 与 Miss 使用不同尺寸、亮度、震动和碎裂反馈，瞬间传达时机质量。",
    sourceName: "GameCraft-Bench · Rhythm Note Highway", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/rhythm-note-highway",
    license: "Apache-2.0", status: "TIMING GRADES",
    notes: "依据 Rhythm Note Highway 的四级判定、连击和失误反馈要求重新实现。",
  },
});
