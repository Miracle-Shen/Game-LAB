import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "plasma-fluid", category: "game", draw,
  card: {
    index: "G-04", track: "HIGH-TECH", tags: ["科技", "流体", "拖拽"],
    interaction: "按住并拖动，向场中注入高能等离子",
    title: "等离子流体", subtitle: "FLUID / VELOCITY SPLAT",
    summary: "指针轨迹注入速度和颜色，光带在流场中卷曲、扩散并相互混合。",
    sourceName: "WebGL Fluid Simulation", sourceUrl: "https://github.com/PavelDoGreat/WebGL-Fluid-Simulation",
    license: "MIT", status: "VELOCITY FIELD",
    notes: "参考 GPU Gems 流体求解与交互 splat 思路；此处用轻量 Canvas 流线场复刻响应方式。",
  },
});
