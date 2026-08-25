import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "jingle-steel", category: "sound", draw,
  card: {
    index: "S-52", title: "钢片短提示", subtitle: "JINGLE / STEEL",
    summary: "清亮的钢片乐句，适合宝物发现、地图解锁和清爽的完成反馈。",
    audioCategory: "jingle", audioCategoryLabel: "提示乐",
    keywords: ["钢片","宝物","地图","解锁","完成","steel","jingle","treasure","unlock"],
    useCases: ["宝物发现","地图解锁","完成反馈"],
    audio: { src: new URL("./assets/jingles_STEEL00.ogg", import.meta.url).href, format: "OGG", duration: 0.93 },
    sourceName: "Kenney Music Jingles", sourceUrl: "https://kenney.nl/assets/music-jingles",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Music Jingles 的 Steel jingles / jingles_STEEL00。",
  },
});
