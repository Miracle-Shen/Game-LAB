import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "spell-fizzle-smoke", category: "game", draw,
  createState: () => ({ attempts: 0, lastCast: 0 }),
  onPointerDown: ({ state, now }) => { state.custom.attempts += 1; state.custom.lastCast = now; },
  card: {
    index: "G-41", track: "SPELL FAILURE", tags: ["策略", "魔法", "失败反馈"], interaction: "点击尝试施法，观察法术失效烟雾",
    title: "法术失效烟雾", subtitle: "SPELL / FIZZLE", summary: "断裂符文、灰紫烟雾、坠落火星与抖动法杖构成轻量且明确的施法失败反馈。",
    sourceName: "OpenGame · Arithmancy Academy", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/harryPotter/index.html", license: "Apache-2.0", status: "FIZZLE FEEDBACK",
    notes: "参考 OpenGame 魔法答题演示的错误反馈语义，以原创 Canvas 粒子重制。",
  },
});
