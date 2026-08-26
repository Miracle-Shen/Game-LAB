import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "signal-route-conflict", category: "game", draw,
  createState: () => ({ green: false, lastToggle: 0 }),
  onPointerDown: ({ state, now }) => {
    state.custom.green = !state.custom.green;
    state.custom.lastToggle = now;
  },
  card: {
    index: "G-36", track: "ROUTE FEEDBACK", tags: ["策略", "轨道", "信号"],
    interaction: "点击切换信号灯和道岔，观察冲突区从红色警报恢复为安全通行",
    title: "轨道冲突信号", subtitle: "ROUTE / SIGNAL CONFLICT",
    summary: "路径高亮、占用区、信号灯、道岔状态和碰撞倒计时构成调度游戏的核心反馈。",
    sourceName: "GameCraft-Bench · Signal Rail Dispatcher", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/strategy-signal-rail-dispatcher",
    license: "Apache-2.0", status: "ROUTE CONTROL",
    notes: "依据 Signal Rail Dispatcher 对线路、红绿信号、占用灯和冲突预警的要求重新实现。",
  },
});
