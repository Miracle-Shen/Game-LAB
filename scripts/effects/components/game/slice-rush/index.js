import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "slice-rush", category: "game", draw,
  card: {
    index: "G-07", track: "CASUAL GAME",
    interaction: "快速滑过水果，生成切口、果汁与速度轨迹",
    title: "切割冲刺", subtitle: "SWIPE / JUICE TRAIL",
    summary: "连续滑动把触控路径、命中停顿、切片和果汁飞溅串成爽快反馈。",
    sourceName: "Godot Demo Projects", sourceUrl: "https://github.com/godotengine/godot-demo-projects",
    license: "MIT", status: "TOUCH TRAIL",
    notes: "参考 Godot 官方 2D 粒子、拖尾与触控输入示例，所有图形和命中逻辑均为程序化实现。",
  },
});
