import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "laser-shot", category: "sound", draw,
  card: {
    index: "S-17", title: "激光发射", subtitle: "DIGITAL / LASER SHOT",
    summary: "快速扫频的电子发射声，适合能量武器、街机射击和科技按钮。",
    audioCategory: "digital", audioCategoryLabel: "电子",
    keywords: ["激光", "射击", "发射", "能量", "武器", "科技", "laser", "shot", "fire", "energy", "weapon", "sci fi"],
    useCases: ["能量武器", "街机射击", "科技触发"],
    audio: { src: new URL("./assets/laser4.ogg", import.meta.url).href, format: "OGG", duration: 1.13 },
    sourceName: "Kenney Digital Audio", sourceUrl: "https://kenney.nl/assets/digital-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Digital Audio 的 laser4；包含完整扫频尾音，可独立使用。",
  },
});
