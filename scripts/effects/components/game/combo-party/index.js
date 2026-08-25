import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "combo-party", category: "game", draw,
  onPointerDown: ({ state, now }) => {
    state.custom.combo += 1;
    state.custom.lastCombo = now;
  },
  card: {
    index: "G-08", track: "CASUAL GAME",
    interaction: "连续点击累积 COMBO，达到阈值触发全屏庆典",
    title: "连击庆典", subtitle: "COMBO / CELEBRATION",
    summary: "数字弹性、彩纸、皇冠与屏幕脉冲组成关卡完成和高连击反馈。",
    sourceName: "canvas-confetti", sourceUrl: "https://github.com/catdad/canvas-confetti",
    license: "ISC", status: "COMBO FEEDBACK",
    notes: "参考 canvas-confetti 的粒子参数与 reduced-motion 设计，使用本地 Canvas 发射器独立实现。",
  },
});
