import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "projectile-hit-chain", category: "game", draw,
  createState: () => ({ combo: 0, firedAt: 0 }),
  onPointerDown: ({ state, now }) => { state.custom.combo = state.custom.combo % 9 + 1; state.custom.firedAt = now; },
  card: {
    index: "G-47", track: "PROJECTILE FEEDBACK", tags: ["战斗", "弹丸", "连击"], interaction: "点击发射弹丸并叠加连续命中倍率",
    title: "弹丸命中连锁", subtitle: "PROJECTILE / HIT CHAIN", summary: "飞行尾迹、命中环、伤害跳字与连击倍率把快速塔防射击组织成连续节拍。",
    sourceName: "OpenGame · Hajimi Defense", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/hajimi/index.html", license: "Apache-2.0", status: "CHAIN ACTIVE",
    notes: "参考 OpenGame 塔防演示的弹丸和连续命中反馈，以原创 Canvas 图形重制。",
  },
});
