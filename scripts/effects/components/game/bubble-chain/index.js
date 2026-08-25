import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "bubble-chain", category: "game", draw,
  card: {
    index: "G-06", track: "CASUAL GAME",
    interaction: "戳破泡泡，冲击波会引爆附近目标",
    title: "泡泡连锁", subtitle: "SOFT BODY / CHAIN POP",
    summary: "漂浮、挤压、破裂和邻近传播适合泡泡龙、合成与放置类玩法。",
    sourceName: "Matter.js", sourceUrl: "https://github.com/liabru/matter-js",
    license: "MIT", status: "CHAIN REACTION",
    notes: "参考 Matter.js 的球池、软体与碰撞 demo；展示使用轻量二维动力学独立实现。",
  },
});
