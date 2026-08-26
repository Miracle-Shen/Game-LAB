import { defineEffectComponent } from "../../../component-registry.js";
import { fighterControlMarkup, mountFighterControl } from "../../../shared/fighter-library.js";
import { draw } from "./renderer.js";

const controlsMarkup = () => fighterControlMarkup({ mode: "pair", stateKey: "fighterPair" });

function mountDetail({ root, instance }) {
  return mountFighterControl({
    root,
    instance,
    stateKey: "fighterPair",
    onChange: ({ instance: effect }) => {
      effect.interaction.custom.lastHit = performance.now();
      effect.interaction.custom.hitX = effect.width * 0.59;
      effect.interaction.custom.hitY = effect.height * 0.52;
    },
  });
}

export default defineEffectComponent({
  id: "combat-hit-stop",
  category: "game",
  draw,
  createState: () => ({ lastHit: 0, hitX: 0, hitY: 0, combo: 0, fighterPair: "stick" }),
  onPointerDown: ({ point, state, now }) => {
    state.custom.lastHit = now;
    state.custom.hitX = point.x;
    state.custom.hitY = point.y;
    state.custom.combo = state.custom.combo % 4 + 1;
  },
  controlsMarkup,
  mountDetail,
  card: {
    index: "G-20", track: "COMBAT FEEDBACK", tags: ["战斗", "命中", "停顿"],
    interaction: "点击对手触发命中停顿、白闪、震屏与浮动伤害，再次点击累积连击",
    title: "命中停顿", subtitle: "HIT STOP / IMPACT FRAME",
    summary: "用短暂停帧压住动作峰值，再叠加局部白闪、方向冲击线、镜头震动和伤害跳字。",
    sourceName: "OpenGame ScreenEffectHelper", sourceUrl: "https://github.com/leigest519/OpenGame/blob/main/agent-test/templates/modules/platformer/src/behaviors/ScreenEffectHelper.ts",
    license: "Apache-2.0", status: "IMPACT RESPONSE",
    notes: "参考 OpenGame 的 shake、damage number 与爆炸时序；人物可独立选择 Canvas 火柴人或本案例内的 OpenGame 角色资源。",
  },
});
