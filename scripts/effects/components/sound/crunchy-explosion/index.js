import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "crunchy-explosion", category: "sound", draw,
  card: {
    index: "S-44", title: "科幻脆爆", subtitle: "SCI-FI / CRUNCH EXPLOSION",
    summary: "带数字碎裂质感的紧凑爆炸，适合机器人销毁、能量核心破裂和小型炸弹。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["爆炸","碎裂","机器人","核心","科幻","explosion","crunch","robot","core"],
    useCases: ["机器人销毁","核心破裂","小型炸弹"],
    audio: { src: new URL("./assets/explosionCrunch_000.ogg", import.meta.url).href, format: "OGG", duration: 0.78 },
    sourceName: "Kenney Sci-fi Sounds", sourceUrl: "https://kenney.nl/assets/sci-fi-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Sci-fi Sounds 的 explosionCrunch_000。",
  },
});
