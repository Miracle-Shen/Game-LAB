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
      effect.interaction.custom.lastAnswer = performance.now();
    },
  });
}

export default defineEffectComponent({
  id: "quiz-backfire",
  category: "game",
  draw,
  createState: () => ({ lastAnswer: 0, fighter: "stick" }),
  onPointerDown: ({ state, now }) => {
    state.custom.lastAnswer = now;
  },
  controlsMarkup,
  mountDetail,
  card: {
    index: "G-42", track: "QUIZ COMBAT", tags: ["答题", "失败反馈", "自伤"], interaction: "点击重播一次答错、能量折返并命中自身的反馈",
    title: "答错反噬", subtitle: "WRONG ANSWER / BACKFIRE", summary: "错误判定出现后，已发出的攻击立即折返并对施法者造成伤害。",
    sourceName: "OpenGame · Celestial Showdown", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/kombat/index.html", license: "Apache-2.0", status: "ANSWER LOCKED",
    notes: "原子化呈现 OpenGame 竞技答题中的答错自伤机制：只保留提交、错误判定、攻击折返和生命扣减四个连续反馈。",
  },
});
