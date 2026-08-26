import { defineEffectComponent } from "../../../component-registry.js";
import { fighterControlMarkup, mountFighterControl } from "../../../shared/fighter-library.js";
import { draw } from "./renderer.js";

const controlsMarkup = () => fighterControlMarkup({ stateKey: "fighter" });

export default defineEffectComponent({
  id: "temporal-ghost-replay", category: "game", draw,
  createState: () => ({ lastRewind: 0, loops: 1, fighter: "stick" }),
  onPointerDown: ({ state, now }) => {
    state.custom.lastRewind = now;
    state.custom.loops = state.custom.loops % 4 + 1;
  },
  controlsMarkup,
  mountDetail: ({ root, instance }) => mountFighterControl({ root, instance, stateKey: "fighter" }),
  card: {
    index: "G-25", track: "TEMPORAL FEEDBACK", tags: ["探索", "时间", "残影"],
    interaction: "点击触发时间倒带，并增加一层会重复旧路线的幽灵残像",
    title: "时序幽灵回放", subtitle: "REWIND / GHOST REPLAY",
    summary: "倒带扫描、历史轨迹、半透明分身和时间轴标记共同表现多轮行动叠加。",
    sourceName: "GameCraft-Bench · Time Loop", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/platformer-time-loop",
    license: "Apache-2.0", status: "TIME REPLAY",
    notes: "依据 Time Loop 任务中的倒带、历史分身和时间轴要求重新实现；人物可独立选择 Canvas 火柴人或本案例内的 OpenGame 角色资源。",
  },
});
