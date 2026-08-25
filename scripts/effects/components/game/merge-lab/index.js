import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "merge-lab", category: "game", draw,
  createState: () => ({ mergeLevel: 1, lastAction: 0 }),
  onPointerDown: ({ state, now }) => {
    state.custom.mergeLevel = state.custom.mergeLevel >= 5 ? 1 : state.custom.mergeLevel + 1;
    state.custom.lastAction = now;
  },
  card: {
    index: "G-10", track: "CLASSIC GAME",
    interaction: "点击推进合成等级，触发吸附、融合和进化闪光",
    title: "合成进化", subtitle: "MERGE / EVOLUTION",
    summary: "两个单位吸附到中心并生成更高等级形态，适合合成、放置和养成玩法。",
    sourceName: "Matter.js", sourceUrl: "https://github.com/liabru/matter-js",
    license: "MIT", status: "MERGE EVOLUTION",
    notes: "组件内部维护等级和最近合成时间；业务层只需向组件传入等级或触发 onPointerDown。",
  },
});
