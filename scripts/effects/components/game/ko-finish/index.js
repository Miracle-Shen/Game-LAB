import { defineEffectComponent } from "../../../component-registry.js";
import { fighterControlMarkup, mountFighterControl } from "../../../shared/fighter-library.js";
import { draw } from "./renderer.js";

function controlsMarkup() {
  return fighterControlMarkup({ mode: "pair", stateKey: "fighterPair" });
}

function mountDetail({ root, instance }) {
  return mountFighterControl({
    root,
    instance,
    stateKey: "fighterPair",
    onChange: ({ instance: effect }) => {
      effect.interaction.custom.lastFinish = performance.now();
    },
  });
}

export default defineEffectComponent({
  id: "ko-finish",
  category: "game",
  draw,
  createState: () => ({ lastFinish: 0, winner: 1, fighterPair: "stick" }),
  onPointerDown: ({ state, now }) => {
    state.custom.lastFinish = now;
    state.custom.winner *= -1;
  },
  controlsMarkup,
  mountDetail,
  card: {
    index: "G-24", track: "MATCH FINISH", tags: ["战斗", "终结", "定格"],
    interaction: "点击触发终结一击，再次点击切换胜方并重播 KO 定格",
    title: "KO 终结定格", subtitle: "FINISH / K.O. FREEZE",
    summary: "选择 OpenGame 角色或 Canvas 火柴人，体验终结命中、镜头闪切、巨大 KO 字样和胜方聚光。",
    sourceName: "OpenGame KOF Celestial Showdown Demo", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/kombat/index.html",
    license: "OpenGame demo asset", status: "MATCH FINISH",
    notes: "KO 时序由 Canvas 实现；人物菜单可切换 Canvas 火柴人或 OpenGame 演示资源。角色 PNG 按原资源名保存在本案例 assets 目录，未使用演示音频。",
  },
});
