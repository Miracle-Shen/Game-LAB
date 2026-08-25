import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "jingle-8bit", category: "sound", draw,
  card: {
    index: "S-50", title: "八位短提示", subtitle: "JINGLE / 8-BIT",
    summary: "完整但紧凑的八位旋律提示，适合像素关卡结算、模式切换和章节节点。",
    audioCategory: "jingle", audioCategoryLabel: "提示乐",
    keywords: ["八位","短提示","旋律","像素","结算","8-bit","jingle","retro","stinger"],
    useCases: ["像素关卡结算","模式切换","章节节点"],
    audio: { src: new URL("./assets/jingles_NES00.ogg", import.meta.url).href, format: "OGG", duration: 1.76 },
    sourceName: "Kenney Music Jingles", sourceUrl: "https://kenney.nl/assets/music-jingles",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Music Jingles 的 8-Bit jingles / jingles_NES00。",
  },
});
