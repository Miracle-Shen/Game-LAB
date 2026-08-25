import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "soft-bounce", category: "sound", draw,
  card: {
    index: "S-16", title: "软体弹碰", subtitle: "IMPACT / SOFT BOUNCE",
    summary: "低硬度、带弹性的碰撞声，适合果冻、泡泡、布偶和合成单位落地。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["软体", "弹跳", "果冻", "泡泡", "布偶", "落地", "soft", "bounce", "jelly", "bubble", "plush", "landing"],
    useCases: ["果冻弹跳", "泡泡碰撞", "合成落地"],
    audio: { src: new URL("./assets/impactSoft_medium_002.ogg", import.meta.url).href, format: "OGG", duration: 0.14 },
    sourceName: "Kenney Impact Sounds", sourceUrl: "https://kenney.nl/assets/impact-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Impact Sounds 的 impactSoft_medium_002；避免使用尖锐高频，适合低压力反馈。",
  },
});
