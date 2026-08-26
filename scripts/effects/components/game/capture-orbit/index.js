import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "capture-orbit", category: "game", draw,
  createState: () => ({ lastThrow: 0, attempts: 0, targetX: 0, targetY: 0 }),
  onPointerDown: ({ point, state, now }) => {
    state.custom.lastThrow = now;
    state.custom.attempts += 1;
    state.custom.targetX = point.x;
    state.custom.targetY = point.y;
  },
  card: {
    index: "G-31", track: "CAPTURE FEEDBACK", tags: ["探索", "捕获", "投掷"],
    interaction: "点击目标投出捕获球，交替演示摇晃失败与星环成功反馈",
    title: "捕获轨迹与摇晃", subtitle: "CAPTURE / THROW & SHAKE",
    summary: "抛物线投掷、目标吸入、容器摇晃和成功星环组成生物捕获的完整闭环。",
    sourceName: "GameCraft-Bench · Open-World Creature Collection", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/openworld-pokemon",
    license: "Apache-2.0", status: "CAPTURE LOOP",
    notes: "依据 openworld-pokemon 的可见投掷弧线与捕获摇晃要求重新实现，不使用任何 Pokémon 素材或名称。",
  },
});
