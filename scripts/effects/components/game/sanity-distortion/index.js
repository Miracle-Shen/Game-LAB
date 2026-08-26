import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "sanity-distortion", category: "game", draw,
  createState: () => ({ sanity: 1, lastPulse: 0 }),
  onPointerDown: ({ state, now }) => {
    state.custom.sanity = state.custom.sanity <= 0.2 ? 1 : state.custom.sanity - 0.2;
    state.custom.lastPulse = now;
  },
  card: {
    index: "G-32", track: "HORROR FEEDBACK", tags: ["探索", "恐怖", "扭曲"],
    interaction: "连续点击降低理智值，观察暗角、色差、假影和界面失真逐级增强",
    title: "低理智视觉干扰", subtitle: "SANITY / HALLUCINATION",
    summary: "动态暗角、通道错位、噪点、虚假轮廓和呼吸式曝光表现不可见的心理状态。",
    sourceName: "GameCraft-Bench · Open-World Ghost Hunting", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/openworld-ghost",
    license: "Apache-2.0", status: "SANITY DISTORTION",
    notes: "依据 Open-World Ghost Hunting 的低理智幻觉、假读数和闪烁光源要求重新实现。",
  },
});
