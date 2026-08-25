import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "reward-collector", category: "game", draw,
  createState: () => ({ collected: 24, lastCollect: 0 }),
  onPointerDown: ({ state, now }) => { state.custom.collected += 1; state.custom.lastCollect = now; },
  card: {
    index: "G-16", track: "CASUAL REWARD",
    interaction: "点击任意位置，把奖励沿弧线吸入右上角计数器",
    title: "奖励归仓", subtitle: "COLLECT / HUD FLY-IN",
    summary: "奖励从命中点分批起飞、弧线汇聚并撞击计数器，适合金币、体力与活动道具。",
    sourceName: "Godot 2D Particles Demo", sourceUrl: "https://github.com/godotengine/godot-demo-projects/tree/master/2d/particles",
    license: "MIT", status: "HUD COLLECTION",
    notes: "复用 Godot 官方火花贴图作为飞行拖尾；收集路径、分批延迟和计数器回弹由独立组件状态驱动。",
  },
});
