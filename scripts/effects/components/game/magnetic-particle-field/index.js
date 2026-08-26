import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "magnetic-particle-field",
  category: "game",
  draw,
  card: {
    index: "G-01", track: "HIGH-TECH", tags: ["科技", "粒子", "交互"],
    interaction: "移动指针扭曲力场，按住后切换为引力模式",
    title: "磁场粒子核心", subtitle: "GPGPU PARTICLE FIELD",
    summary: "数百颗粒子围绕能量核心运行，指针实时改变轨道与磁场方向。",
    sourceName: "Three.js Examples", sourceUrl: "https://github.com/mrdoob/three.js",
    license: "MIT", status: "LIVE FORCE FIELD",
    notes: "参考 Three.js 的 WebGL / WebGPU 粒子与计算示例，以独立 Canvas 粒子系统实现指针引力和排斥。",
  },
});
