import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "lucky-wheel", category: "game", draw,
  createState: () => ({ spinCount: 0, lastSpin: 0 }),
  onPointerDown: ({ state, now }) => { state.custom.spinCount += 1; state.custom.lastSpin = now; },
  card: {
    index: "G-15", track: "CASUAL REWARD",
    interaction: "点击转盘，触发加速、减速定格和中奖爆闪",
    title: "幸运转盘", subtitle: "SPIN / JACKPOT STOP",
    summary: "分区旋转、指针敲击、减速回弹和中奖星芒聚焦在开奖前后的核心反馈。",
    sourceName: "Kenney Particle Pack", sourceUrl: "https://kenney.nl/assets/particle-pack",
    license: "CC0", status: "PRIZE SPIN",
    notes: "参考 Kenney CC0 Particle Pack 的休闲游戏粒子语言，使用本地火花贴图和程序化转盘独立实现。",
  },
});
