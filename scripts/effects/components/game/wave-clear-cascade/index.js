import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "wave-clear-cascade", category: "game", draw,
  createState: () => ({ wave: 1, clearedAt: 0 }),
  onPointerDown: ({ state, now }) => { state.custom.wave += 1; state.custom.clearedAt = now; },
  card: {
    index: "G-46", track: "ROUND REWARD", tags: ["奖励", "塔防", "清场"], interaction: "点击完成当前波次并触发级联清场",
    title: "波次清场级联", subtitle: "WAVE / CLEAR CASCADE", summary: "敌群按路径顺序消散，奖励粒子回流并以大号波次横幅收束阶段战斗。",
    sourceName: "OpenGame · Hajimi Defense", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/hajimi/index.html", license: "Apache-2.0", status: "WAVE CLEARED",
    notes: "参考 OpenGame 塔防演示的波次结束反馈，以原创 Canvas 单位与路径重制。",
  },
});
