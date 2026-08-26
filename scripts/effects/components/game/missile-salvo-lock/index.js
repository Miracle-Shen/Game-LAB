import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "missile-salvo-lock", category: "game", draw,
  createState: () => ({ x: 0, y: 0, lastLaunch: 0 }),
  onPointerDown: ({ point, state, now }) => Object.assign(state.custom, { x: point.x, y: point.y, lastLaunch: now }),
  card: {
    index: "G-38", track: "TARGETING SYSTEM", tags: ["科技", "锁定", "弹道"], interaction: "点击目标位置锁定并发射一组导弹",
    title: "导弹齐射锁定", subtitle: "MISSILE / SALVO LOCK", summary: "旋转准星、分批发射、弧形尾迹和错峰命中建立清晰的多目标武器节奏。",
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html", license: "Apache-2.0", status: "TARGET LOCKED",
    notes: "参考 OpenGame 动作演示的远程齐射行为，以原创 Canvas 图形重制。",
  },
});
