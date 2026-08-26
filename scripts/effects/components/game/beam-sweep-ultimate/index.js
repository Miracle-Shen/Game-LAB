import { defineEffectComponent } from "../../../component-registry.js";
import { fighterControlMarkup, mountFighterControl } from "../../../shared/fighter-library.js";
import { draw } from "./renderer.js";

function controlsMarkup() {
  return fighterControlMarkup({ stateKey: "fighter" });
}

function mountDetail({ root, instance }) {
  return mountFighterControl({
    root,
    instance,
    stateKey: "fighter",
    onChange: ({ instance: effect }) => {
      effect.interaction.custom.lastCast = performance.now();
    },
  });
}

export default defineEffectComponent({
  id: "beam-sweep-ultimate",
  category: "game",
  draw,
  createState: () => ({ x: 0, y: 0, lastCast: 0, fighter: "stick" }),
  onPointerDown: ({ point, state, now }) => Object.assign(state.custom, { x: point.x, y: point.y, lastCast: now }),
  controlsMarkup,
  mountDetail,
  card: {
    index: "G-39", track: "ULTIMATE ATTACK", tags: ["战斗", "大招", "清场"], interaction: "点击敌人所在高度，重播锁定、蓄力、扫射和清场反馈",
    title: "终极光束扫射", subtitle: "ULTIMATE / BEAM SWEEP", summary: "面向横版动作游戏的清屏大招：角色聚能后横向扫过敌阵，以命中闪光、伤害跳字和目标消散表现压倒性威力。",
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html", license: "Apache-2.0", status: "ULTIMATE READY",
    notes: "适用于横版 Boss 战、阶段终结与清理成群敌人的 Ultimate。参考 OpenGame Infinity Strike 的清屏技能结构，人物可选择 Canvas 火柴人或 OpenGame 角色。",
  },
});
