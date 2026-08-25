import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "mining-burst", category: "game", draw,
  createState: () => ({ miningPower: 1 }),
  onPointerDown: ({ state }) => { state.custom.miningPower = state.custom.miningPower >= 5 ? 1 : state.custom.miningPower + 1; },
  card: {
    index: "G-09", track: "CLASSIC GAME",
    interaction: "点击矿石逐层开采，释放晶体、碎片和冲击波",
    title: "晶矿开采", subtitle: "MINING / ORE BURST",
    summary: "矿石耐久、裂纹推进、稀有晶体和战利品飞散组成挖矿核心反馈。",
    sourceName: "Effekseer", sourceUrl: "https://github.com/effekseer/Effekseer",
    license: "MIT", status: "ORE IMPACT SYSTEM",
    notes: "采用独立插件状态维护开采深度，点击事件只由该组件消费，可直接替换为真实耐久数据。",
  },
});
