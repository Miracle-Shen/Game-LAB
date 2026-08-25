import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "dice-roll", category: "sound", draw,
  card: {
    index: "S-22", title: "骰子落桌", subtitle: "TABLETOP / DICE THROW",
    summary: "骰子滚动并多次触桌的短序列，适合棋盘移动、随机判定和开箱抽点。",
    audioCategory: "tabletop", audioCategoryLabel: "棋牌",
    keywords: ["骰子", "投掷", "滚动", "随机", "棋盘", "判定", "dice", "throw", "roll", "random", "board", "tabletop"],
    useCases: ["随机判定", "棋盘移动", "抽点结算"],
    audio: { src: new URL("./assets/dice-throw-2.ogg", import.meta.url).href, format: "OGG", duration: 0.40 },
    sourceName: "Kenney Casino Audio", sourceUrl: "https://kenney.nl/assets/casino-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Casino Audio 的 dice-throw-2；包含滚动与落桌的连续瞬态。",
  },
});
