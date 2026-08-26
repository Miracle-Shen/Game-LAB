import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "tower-placement-pulse",
  category: "game",
  draw,
  createState: () => ({ placements: [], lastAction: 0 }),
  onPointerDown: ({ point, state, now, instance }) => {
    const threshold = Math.min(instance.width, instance.height) * 0.13;
    const existing = state.custom.placements.find((tower) => Math.hypot(tower.x - point.x, tower.y - point.y) < threshold);
    if (existing) {
      existing.level = existing.level % 3 + 1;
      existing.time = now;
      existing.action = "upgrade";
    } else {
      state.custom.placements.push({ x: point.x, y: point.y, level: 1, time: now, action: "place" });
      state.custom.placements = state.custom.placements.slice(-5);
    }
    state.custom.lastAction = now;
  },
  card: {
    index: "G-23", track: "STRATEGY FEEDBACK", tags: ["策略", "塔防", "部署"],
    interaction: "点击空地部署防御塔，再次点击同一座塔进行升级",
    title: "部署脉冲", subtitle: "PLACE / UPGRADE FEEDBACK",
    summary: "建造预览、范围环、落地脉冲、升级光柱与等级标记覆盖塔防和策略游戏的核心反馈。",
    sourceName: "OpenGame Hajimi Defense Demo", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/hajimi/index.html",
    license: "Apache-2.0 reference code", status: "BUILD FEEDBACK",
    notes: "参考 OpenGame 塔防演示的放置、范围和升级反馈语义；地图、塔体与动画均为独立 Canvas 实现。",
  },
});
