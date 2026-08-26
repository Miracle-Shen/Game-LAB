import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "elimination-persistence", category: "game", draw,
  createState: () => ({ markers: [] }),
  onPointerDown: ({ point, state, now }) => { state.custom.markers.push({ x: point.x, y: point.y, time: now }); state.custom.markers = state.custom.markers.slice(-10); },
  card: {
    index: "G-44", track: "WORLD MEMORY", tags: ["探索", "淘汰", "持久痕迹"], interaction: "点击场地留下不会立即消失的淘汰标记",
    title: "淘汰痕迹留存", subtitle: "ELIMINATION / PERSISTENCE", summary: "短时冲击结束后仍保留弱化标记，让场地记住危险位置并传达本局历史。",
    sourceName: "OpenGame · Red Light Green Light", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/squidGame/index.html", license: "Apache-2.0", status: "WORLD MEMORY",
    notes: "参考 OpenGame 生存演示的淘汰结果留存，以非写实的原创警示标记重制。",
  },
});
