import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "near-miss-warning", category: "game", draw,
  createState: () => ({ lastReroute: 0, waypointX: 0, waypointY: 0 }),
  onPointerDown: ({ point, state, now }) => {
    state.custom.lastReroute = now;
    state.custom.waypointX = point.x;
    state.custom.waypointY = point.y;
  },
  card: {
    index: "G-34", track: "PROXIMITY FEEDBACK", tags: ["策略", "航线", "预警"],
    interaction: "点击设置新航路点，化解两条航线交汇产生的近失警告",
    title: "近失冲突警告", subtitle: "PROXIMITY / NEAR MISS",
    summary: "预测航线、接近环、最短距离连线与分级警报用于空管、竞速和编队游戏。",
    sourceName: "GameCraft-Bench · Air Control", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/simulation-air-control",
    license: "Apache-2.0", status: "CONFLICT WARNING",
    notes: "依据 Air Control 对路径绘制、飞机接近和冲突警报的要求重新实现。",
  },
});
