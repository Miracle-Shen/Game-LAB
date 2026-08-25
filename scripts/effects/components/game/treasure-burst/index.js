import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "treasure-burst", category: "game", draw,
  createState: () => ({ openCount: 0, lastOpen: 0 }),
  onPointerDown: ({ state, now }) => { state.custom.openCount += 1; state.custom.lastOpen = now; },
  card: {
    index: "G-14", track: "CASUAL REWARD",
    interaction: "点击宝箱，重播开盖、烟尘、金币与闪光爆发",
    title: "宝箱喷奖", subtitle: "CHEST / REWARD BURST",
    summary: "开盖弹性、暖色闪光、金币喷射和落地烟尘组成高价值奖励的关键瞬间。",
    sourceName: "Godot 2D Particles Demo", sourceUrl: "https://github.com/godotengine/godot-demo-projects/tree/master/2d/particles",
    license: "MIT", status: "REWARD REVEAL",
    notes: "直接使用 Godot 官方示例中的火花、烟雾与火焰粒子贴图；宝箱、金币和动画时序为浏览器 Canvas 独立实现。",
  },
});
