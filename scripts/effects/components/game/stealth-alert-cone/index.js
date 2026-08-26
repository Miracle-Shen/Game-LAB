import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "stealth-alert-cone", category: "game", draw,
  createState: () => ({ lastAlert: 0, targetX: 0, targetY: 0 }),
  onPointerDown: ({ point, state, now }) => {
    state.custom.lastAlert = now;
    state.custom.targetX = point.x;
    state.custom.targetY = point.y;
  },
  card: {
    index: "G-26", track: "STEALTH FEEDBACK", tags: ["探索", "潜行", "警报"],
    interaction: "移动角色观察巡逻视锥，点击触发暴露、警戒升级和搜索脉冲",
    title: "潜行警戒视锥", subtitle: "STEALTH / DETECTION ALERT",
    summary: "扫动视锥、暴露计量、警戒变色和搜索波纹构成潜行游戏的可读风险反馈。",
    sourceName: "GameCraft-Bench · Shadow Courier", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/platformer-stealth-shadow-courier",
    license: "Apache-2.0", status: "DETECTION ALERT",
    notes: "依据 Shadow Courier 对巡逻视锥、警告态和警报升级的要求重新实现。",
  },
});
