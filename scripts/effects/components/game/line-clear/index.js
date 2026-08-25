import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "line-clear", category: "game", draw,
  card: {
    index: "G-11", track: "CLASSIC GAME",
    interaction: "点击棋盘位置，触发横纵火箭和粒子清屏",
    title: "棋盘横扫", subtitle: "MATCH / LINE CLEAR",
    summary: "交叉火箭、行列高亮和消除粒子适用于消消乐中的强力道具反馈。",
    sourceName: "PixiJS Particle Emitter", sourceUrl: "https://github.com/pixijs-userland/particle-emitter",
    license: "MIT", status: "BOOSTER CLEAR",
    notes: "与连消瀑布分离为独立组件，专注处理火箭、炸弹等棋盘增益道具。",
  },
});
