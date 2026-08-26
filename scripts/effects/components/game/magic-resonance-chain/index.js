import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "magic-resonance-chain", category: "game", draw,
  createState: () => ({ combo: 0, lastCast: 0 }),
  onPointerDown: ({ state, now }) => { state.custom.combo = state.custom.combo % 6 + 1; state.custom.lastCast = now; },
  card: {
    index: "G-40", track: "SPELL COMBO", tags: ["策略", "魔法", "连锁"], interaction: "连续点击叠加法术共鸣层数",
    title: "魔法共鸣连锁", subtitle: "MAGIC / RESONANCE CHAIN", summary: "卡牌光边、旋转符文、共鸣连线与倍率标记把连续正确施法转为递增强反馈。",
    sourceName: "OpenGame · Arithmancy Academy", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/harryPotter/index.html", license: "Apache-2.0", status: "COMBO SPELL",
    notes: "参考 OpenGame 魔法答题演示的连击与施法语义，以原创 Canvas 图形重制。",
  },
});
