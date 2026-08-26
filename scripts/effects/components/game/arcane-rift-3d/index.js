import { defineEffectComponent } from "../../../component-registry.js";
import { createRenderer, draw } from "./renderer.js";

export default defineEffectComponent({
  id: "arcane-rift-3d",
  category: "game",
  draw,
  createRenderer,
  card: {
    index: "G-50",
    track: "REAL-TIME 3D",
    tags: ["科技", "战斗", "粒子"],
    interaction: "移动指针观察裂隙深度，点击任意位置引爆粒子冲击波",
    title: "三维奥术裂隙",
    subtitle: "THREE.JS / QUARKS VFX",
    summary: "真实透视空间中的能量核心、轨道环与批处理粒子共同构成立体技能爆发。",
    sourceName: "three.quarks",
    sourceUrl: "https://github.com/Alchemist0823/three.quarks",
    license: "MIT",
    status: "WEBGL PARTICLE VFX",
    notes: "使用 Three.js 建立三维场景，并以 three.quarks 批处理粒子系统实现持续能量流与点击爆发；纹理由 Canvas 程序化生成，不依赖外部媒体素材。",
  },
});
