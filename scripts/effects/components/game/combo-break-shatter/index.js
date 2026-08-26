import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "combo-break-shatter", category: "game", draw,
  createState: () => ({ combo: 12, lastEvent: 0, broken: false }),
  onPointerDown: ({ state, now }) => {
    state.custom.broken = !state.custom.broken;
    state.custom.combo = state.custom.broken ? 0 : Math.max(2, state.custom.combo + 4);
    state.custom.lastEvent = now;
  },
  card: {
    index: "G-35", track: "SCORE FEEDBACK", tags: ["节奏", "连击", "碎裂"],
    interaction: "点击在连击增长与失误碎裂之间切换，观察倍率数字的弹性和解体",
    title: "连击断裂", subtitle: "COMBO / BREAK SHATTER",
    summary: "倍率弹跳、颜色升阶、断裂切片和碎片坠落明确区分连击延续与重置。",
    sourceName: "GameCraft-Bench · Rhythm Note Highway", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/rhythm-note-highway",
    license: "Apache-2.0", status: "COMBO BREAK",
    notes: "依据 Rhythm Note Highway 对连击增长、倍率变化和 Miss 碎裂反馈的要求重新实现。",
  },
});
