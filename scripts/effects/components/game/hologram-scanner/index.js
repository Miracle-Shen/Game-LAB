import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "hologram-scanner", category: "game", draw,
  card: {
    index: "G-02", track: "HIGH-TECH",
    interaction: "左右拖动扫描线，点击制造信号故障",
    title: "全息扫描舱", subtitle: "HOLOGRAM / DATA SCAN",
    summary: "体积扫描线揭示机械目标，边缘重影和数据噪声随操作发生偏移。",
    sourceName: "Unity VFX Graph Samples", sourceUrl: "https://github.com/Unity-Technologies/VisualEffectGraph-Samples",
    license: "UNITY COMPANION", status: "DATA SCAN ARRAY",
    notes: "参考 Ellen Hologram 与 SpaceshipHoloTable 的视觉构成；仅复刻机制，不复用 Unity 限定代码与素材。",
  },
});
