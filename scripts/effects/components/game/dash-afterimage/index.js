import { defineEffectComponent } from "../../../component-registry.js";
import { fighterControlMarkup, mountFighterControl } from "../../../shared/fighter-library.js";
import { draw } from "./renderer.js";

const controlsMarkup = () => fighterControlMarkup({ stateKey: "fighter" });

export default defineEffectComponent({
  id: "dash-afterimage",
  category: "game",
  draw,
  createState: () => ({ lastDash: 0, fromX: 0, fromY: 0, toX: 0, toY: 0, currentX: 0, currentY: 0, fighter: "stick" }),
  onPointerDown: ({ point, state, now, instance }) => {
    state.custom.fromX = state.custom.currentX || instance.width * 0.3;
    state.custom.fromY = state.custom.currentY || instance.height * 0.58;
    state.custom.toX = point.x;
    state.custom.toY = point.y;
    state.custom.lastDash = now;
  },
  controlsMarkup,
  mountDetail: ({ root, instance }) => mountFighterControl({ root, instance, stateKey: "fighter" }),
  card: {
    index: "G-21", track: "MOTION FEEDBACK", tags: ["战斗", "移动", "残影"],
    interaction: "点击任意位置，让角色沿短弧冲刺并留下分层残影",
    title: "冲刺残影", subtitle: "DASH / AFTERIMAGE TRAIL",
    summary: "延迟采样角色姿态，以缩放、染色和透明度衰减构建速度感明确的短距离位移。",
    sourceName: "OpenGame ScreenEffectHelper", sourceUrl: "https://github.com/leigest519/OpenGame/blob/main/agent-test/templates/modules/platformer/src/behaviors/ScreenEffectHelper.ts",
    license: "Apache-2.0", status: "MOTION TRAIL",
    notes: "参考 OpenGame createDashTrail 的延迟残影思路；人物可独立选择 Canvas 火柴人或本案例内的 OpenGame 角色资源。",
  },
});
