import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "target-vortex",
  category: "game",
  draw,
  createState: () => ({ lastTarget: 0, targetX: 0, targetY: 0 }),
  onPointerDown: ({ point, state, now }) => {
    state.custom.targetX = point.x;
    state.custom.targetY = point.y;
    state.custom.lastTarget = now;
  },
  card: {
    index: "G-22", track: "ABILITY TARGETING", tags: ["战斗", "技能", "锁定"],
    interaction: "移动指针预览目标，点击后让漩涡在新位置聚能并坍缩",
    title: "目标漩涡", subtitle: "TARGET / VORTEX LOCK",
    summary: "旋转弧段、向心粒子、目标刻度与核心坍缩组成可复用的锁定、传送和技能前摇。",
    sourceName: "OpenGame ScreenEffectHelper", sourceUrl: "https://github.com/leigest519/OpenGame/blob/main/agent-test/templates/modules/platformer/src/behaviors/ScreenEffectHelper.ts",
    license: "Apache-2.0", status: "TARGET LOCK",
    notes: "参考 OpenGame createVortex 与 createChargeEffect 的阶段结构，所有图形和目标交互均重新实现。",
  },
});
