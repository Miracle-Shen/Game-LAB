import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "jingle-sax", category: "sound", draw,
  card: {
    index: "S-53", title: "萨克斯短提示", subtitle: "JINGLE / SAX",
    summary: "带幽默感的萨克斯触句，适合趣味转折、NPC 出场和轻喜剧反馈。",
    audioCategory: "jingle", audioCategoryLabel: "提示乐",
    keywords: ["萨克斯","趣味","转折","NPC","喜剧","sax","jingle","comic","character"],
    useCases: ["趣味转折","NPC 出场","轻喜剧反馈"],
    audio: { src: new URL("./assets/jingles_SAX00.ogg", import.meta.url).href, format: "OGG", duration: 0.39 },
    sourceName: "Kenney Music Jingles", sourceUrl: "https://kenney.nl/assets/music-jingles",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Music Jingles 的 Sax jingles / jingles_SAX00。",
  },
});
