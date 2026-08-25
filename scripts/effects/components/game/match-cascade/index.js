import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "match-cascade", category: "game", draw,
  onPointerDown: ({ state }) => { state.custom.combo += 1; },
  card: {
    index: "G-05", track: "CASUAL GAME",
    interaction: "点击任意宝石，触发同色连消和瀑布补位",
    title: "连消瀑布", subtitle: "MATCH-3 / CASCADE",
    summary: "选择、爆破、连锁、补位和分数跳字构成完整的三消反馈节奏。",
    sourceName: "PixiJS Particle Emitter", sourceUrl: "https://github.com/pixijs-userland/particle-emitter",
    license: "MIT", status: "CASCADE SYSTEM",
    notes: "参考其可配置发射器和交互式编辑器，使用程序化宝石、星屑和连锁波独立实现。",
  },
});
