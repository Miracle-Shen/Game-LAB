import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "coin-handle", category: "sound", draw,
  card: {
    index: "S-24", title: "金币抓取", subtitle: "FOLEY / COIN HANDLE",
    summary: "多枚硬币在手中碰撞的真实质感，适合金币入袋、商店交易和批量奖励。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["金币", "硬币", "抓取", "入袋", "商店", "交易", "coin", "money", "handle", "bag", "shop", "purchase"],
    useCases: ["金币入袋", "商店交易", "批量奖励"],
    audio: { src: new URL("./assets/handleCoins.ogg", import.meta.url).href, format: "OGG", duration: 0.85 },
    sourceName: "Kenney RPG Audio", sourceUrl: "https://kenney.nl/assets/rpg-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney RPG Audio 的 handleCoins；比单枚金币提示更适合批量结算。",
  },
});
