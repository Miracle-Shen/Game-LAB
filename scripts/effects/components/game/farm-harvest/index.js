import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "farm-harvest", category: "game", draw,
  createState: () => ({ harvestCount: 0 }),
  onPointerDown: ({ state }) => { state.custom.harvestCount += 1; },
  card: {
    index: "G-13", track: "CLASSIC GAME",
    interaction: "点击田地收获作物，触发成熟波、金币和叶片粒子",
    title: "农场丰收", subtitle: "FARM / HARVEST",
    summary: "作物摇摆、分区成熟和收获飞散适合种植、模拟经营与放置类游戏。",
    sourceName: "Godot Demo Projects", sourceUrl: "https://github.com/godotengine/godot-demo-projects",
    license: "MIT", status: "HARVEST WAVE",
    notes: "田块绘制与收获状态封装在组件内部，可替换为真实作物坐标和成熟度。",
  },
});
