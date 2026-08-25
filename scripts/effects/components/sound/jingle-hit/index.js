import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "jingle-hit", category: "sound", draw,
  card: {
    index: "S-54", title: "重击短提示", subtitle: "JINGLE / HIT",
    summary: "以强瞬态收束的短提示，适合标题定格、Boss 登场和关键节点强调。",
    audioCategory: "jingle", audioCategoryLabel: "提示乐",
    keywords: ["重击","定格","Boss","节点","强调","hit","jingle","title","stinger"],
    useCases: ["标题定格","Boss 登场","关键节点"],
    audio: { src: new URL("./assets/jingles_HIT00.ogg", import.meta.url).href, format: "OGG", duration: 0.28 },
    sourceName: "Kenney Music Jingles", sourceUrl: "https://kenney.nl/assets/music-jingles",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Music Jingles 的 Hit jingles / jingles_HIT00。",
  },
});
