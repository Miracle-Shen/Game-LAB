import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "cover-depth-fade", category: "game", draw,
  createState: () => ({ x: 0, y: 0 }),
  onPointerMove: ({ point, state }) => Object.assign(state.custom, point),
  onPointerDown: ({ point, state }) => Object.assign(state.custom, point),
  card: {
    index: "G-48", track: "DEPTH READABILITY", tags: ["探索", "遮挡", "潜入"], interaction: "移动指针控制角色穿过掩体，观察前景自动淡化",
    title: "掩体遮挡淡化", subtitle: "COVER / DEPTH FADE", summary: "角色进入前景建筑后自动降低遮挡物不透明度并描边，使俯视场景中的位置始终可读。",
    sourceName: "OpenGame · Mandalorian Protocol", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/starWars/index.html", license: "Apache-2.0", status: "DEPTH RESOLVED",
    notes: "参考 OpenGame 科幻演示的俯视遮挡关系，以原创 Canvas 场景重制。",
  },
});
