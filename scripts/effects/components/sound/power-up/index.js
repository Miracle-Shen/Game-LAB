import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "power-up", category: "sound", draw,
  card: {
    index: "S-18", title: "能量升级", subtitle: "DIGITAL / POWER UP",
    summary: "向上推进的电子音阶，适合升级、充能完成、增益获得和装备强化。",
    audioCategory: "digital", audioCategoryLabel: "电子",
    keywords: ["升级", "充能", "强化", "增益", "成长", "能量", "power up", "level up", "charge", "upgrade", "buff", "energy"],
    useCases: ["角色升级", "充能完成", "装备强化"],
    audio: { src: new URL("./assets/powerUp7.ogg", import.meta.url).href, format: "OGG", duration: 0.52 },
    sourceName: "Kenney Digital Audio", sourceUrl: "https://kenney.nl/assets/digital-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Digital Audio 的 powerUp7；上行轮廓清楚，适合正向成长反馈。",
  },
});
