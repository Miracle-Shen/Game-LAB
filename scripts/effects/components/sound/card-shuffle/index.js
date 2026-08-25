import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "card-shuffle", category: "sound", draw,
  card: {
    index: "S-21", title: "纸牌洗牌", subtitle: "TABLETOP / CARD SHUFFLE",
    summary: "完整的纸牌交错与收束过程，适合卡牌发局、牌库重置和随机化演出。",
    audioCategory: "tabletop", audioCategoryLabel: "棋牌",
    keywords: ["洗牌", "纸牌", "卡牌", "牌库", "随机", "发牌", "shuffle", "card", "deck", "random", "deal", "tabletop"],
    useCases: ["卡牌开局", "牌库重置", "随机化演出"],
    audio: { src: new URL("./assets/card-shuffle.ogg", import.meta.url).href, format: "OGG", duration: 3.06 },
    sourceName: "Kenney Casino Audio", sourceUrl: "https://kenney.nl/assets/casino-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Casino Audio 的 card-shuffle；保留完整洗牌动作序列。",
  },
});
