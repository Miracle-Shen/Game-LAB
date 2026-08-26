import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "structural-collapse", category: "game", draw,
  createState: () => ({ lastImpact: 0, impactX: 0, impactY: 0 }),
  onPointerDown: ({ point, state, now }) => {
    state.custom.lastImpact = now;
    state.custom.impactX = point.x;
    state.custom.impactY = point.y;
  },
  card: {
    index: "G-33", track: "DESTRUCTION FEEDBACK", tags: ["策略", "破坏", "物理"],
    interaction: "点击城墙移除承重块，触发裂纹、粉尘、碎屑和上层连锁坍塌",
    title: "结构连锁坍塌", subtitle: "DESTRUCTION / COLLAPSE",
    summary: "冲击定位、裂纹传播、支撑失效与分层下落让破坏结果具备重量和因果感。",
    sourceName: "GameCraft-Bench · Siege Engineer", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/strategy-siege-engineer",
    license: "Apache-2.0", status: "STRUCTURAL DAMAGE",
    notes: "依据 Siege Engineer 对承重破坏、砖块裂纹、碎屑和物理坍塌的要求重新实现。",
  },
});
