import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "book-flip", category: "sound", draw,
  card: {
    index: "S-26", title: "书页翻动", subtitle: "FOLEY / PAGE FLIP",
    summary: "清晰的纸页掠过声，适合图鉴、任务日志、章节切换和卡片翻面。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["翻页", "书页", "图鉴", "日志", "章节", "卡片", "page", "book", "flip", "journal", "chapter", "card"],
    useCases: ["图鉴翻页", "任务日志", "卡片翻面"],
    audio: { src: new URL("./assets/bookFlip2.ogg", import.meta.url).href, format: "OGG", duration: 0.43 },
    sourceName: "Kenney RPG Audio", sourceUrl: "https://kenney.nl/assets/rpg-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney RPG Audio 的 bookFlip2；纸张瞬态适合页面和卡片反馈。",
  },
});
