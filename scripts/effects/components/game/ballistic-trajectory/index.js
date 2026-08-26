import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "ballistic-trajectory", category: "game", draw,
  createState: () => ({ lastFire: 0, targetX: 0, targetY: 0 }),
  onPointerDown: ({ point, state, now }) => {
    state.custom.targetX = point.x;
    state.custom.targetY = point.y;
    state.custom.lastFire = now;
  },
  card: {
    index: "G-28", track: "AIMING FEEDBACK", tags: ["策略", "瞄准", "弹道"],
    interaction: "移动指针调整预测落点，点击发射并观察弹道、旋转和命中尘屑",
    title: "弹道预测线", subtitle: "AIM / PROJECTILE ARC",
    summary: "虚线抛物线、风向偏移、落点准星与飞行残迹构成投射武器的完整瞄准反馈。",
    sourceName: "GameCraft-Bench · Siege Engineer", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/strategy-siege-engineer",
    license: "Apache-2.0", status: "TRAJECTORY PREVIEW",
    notes: "依据 Siege Engineer 对角度、力度、弹道预览、风偏和落点反馈的要求重新实现。",
  },
});
