import { defineEffectComponent } from "../../../component-registry.js";
import { chooseDestination, createCartographerState, draw } from "./renderer.js";

export default defineEffectComponent({
  id: "fog-of-war-reveal", category: "game", draw,
  createState: createCartographerState,
  onPointerDown: ({ point, state, now, instance }) => {
    instance.canvas.closest(".detail-view")?.classList.add("is-cartography-active");
    chooseDestination(point, state, now, instance.width, instance.height);
  },
  onPointerMove: ({ point, state, instance }) => {
    if (!state.pointer.down) return;
    chooseDestination(point, state, state.now, instance.width, instance.height);
  },
  card: {
    index: "G-29", track: "EXPLORATION FEEDBACK", tags: ["策略", "探索", "地图"],
    interaction: "点击或拖动规划路线；抵达地标后再次点击进行注记，回到营地售卖地图并补给",
    title: "战争迷雾揭示", subtitle: "FOG OF WAR / REVEAL",
    summary: "在永久揭雾地图上规划路线，管理食物、墨水、绳索与生命，注记地标后返城出售地图。",
    sourceName: "GameCraft-Bench · Open-World Cartographer", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/openworld-cartographer",
    license: "Apache-2.0", status: "MAP REVEAL",
    notes: "复用官方 Apache-2.0 任务中的地形、资源、注记、售图和装备成长规则；仓库未提供媒体资产，因此画面由 Canvas 原创绘制。",
  },
});
