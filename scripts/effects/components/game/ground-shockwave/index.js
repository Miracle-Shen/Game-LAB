import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "ground-shockwave", category: "game", draw,
  createState: () => ({ x: 0, y: 0, lastImpact: 0 }),
  onPointerDown: ({ point, state, now }) => Object.assign(state.custom, { x: point.x, y: point.y, lastImpact: now }),
  card: {
    index: "G-37", track: "COMBAT IMPACT", tags: ["战斗", "冲击", "范围技能"], interaction: "点击任意地面位置触发冲击波",
    title: "地面冲击波", subtitle: "GROUND / SHOCKWAVE", summary: "同心震荡环、裂纹、碎屑与短促压暗组成可复用的范围技能落点反馈。",
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html", license: "Apache-2.0", status: "IMPACT READY",
    notes: "参考 OpenGame 动作演示的落地重击语义，以原创 Canvas 几何图形重制。",
  },
});
