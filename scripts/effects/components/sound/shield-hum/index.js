import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "shield-hum", category: "sound", draw,
  card: {
    index: "S-43", title: "能量盾嗡鸣", subtitle: "SCI-FI / FORCE FIELD",
    summary: "稳定的科幻力场纹理，适合护盾开启、能量屏障和持续充能状态。",
    audioCategory: "ambience", audioCategoryLabel: "环境",
    keywords: ["护盾","力场","能量","屏障","充能","shield","force field","energy","hum"],
    useCases: ["护盾开启","能量屏障","持续充能"],
    audio: { src: new URL("./assets/forceField_000.ogg", import.meta.url).href, format: "OGG", duration: 0.95 },
    sourceName: "Kenney Sci-fi Sounds", sourceUrl: "https://kenney.nl/assets/sci-fi-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Sci-fi Sounds 的 forceField_000；适合短循环或状态提示。",
  },
});
