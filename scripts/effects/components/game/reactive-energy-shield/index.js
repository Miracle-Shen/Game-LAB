import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "reactive-energy-shield", category: "game", draw,
  card: {
    index: "G-03", track: "HIGH-TECH",
    interaction: "在护盾任意位置点击，叠加冲击波与裂纹",
    title: "反应式能量盾", subtitle: "HEX SHIELD / IMPACT",
    summary: "冲击点沿六边形网格传导，波纹、裂纹和色散形成多层受击反馈。",
    sourceName: "VfxGraphAssets", sourceUrl: "https://github.com/keijiro/VfxGraphAssets",
    license: "UNLICENSE", status: "IMPACT RESPONSE",
    notes: "参考 VFX Graph 节点、Shader 与粒子组合方式，浏览器版本使用程序化六边形网格独立实现。",
  },
});
