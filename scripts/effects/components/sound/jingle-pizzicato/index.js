import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "jingle-pizzicato", category: "sound", draw,
  card: {
    index: "S-51", title: "拨弦短提示", subtitle: "JINGLE / PIZZICATO",
    summary: "轻快的拨弦提示，适合解谜反馈、章节翻页和轻量奖励。",
    audioCategory: "jingle", audioCategoryLabel: "提示乐",
    keywords: ["拨弦","解谜","翻页","奖励","轻快","pizzicato","jingle","puzzle","reward"],
    useCases: ["解谜反馈","章节翻页","轻量奖励"],
    audio: { src: new URL("./assets/jingles_PIZZI00.ogg", import.meta.url).href, format: "OGG", duration: 0.49 },
    sourceName: "Kenney Music Jingles", sourceUrl: "https://kenney.nl/assets/music-jingles",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Music Jingles 的 Pizzicato jingles / jingles_PIZZI00。",
  },
});
