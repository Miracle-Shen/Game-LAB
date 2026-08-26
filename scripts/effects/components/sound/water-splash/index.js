import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "water-splash", category: "sound", draw,
  card: {
    index: "S-65", title: "重物落水", subtitle: "FOLEY / WATER SPLASH",
    summary: "水体被重物砸开的宽阔水花，适合角色落水、投掷命中和水面冲击。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["水花", "落水", "水面", "液体", "投掷", "冲击", "splash", "water", "liquid", "drop", "impact"],
    useCases: ["角色落水", "投掷命中", "水面冲击"],
    audio: { src: new URL("./assets/splash_04.ogg", import.meta.url).href, format: "OGG", duration: 1.01 },
    sourceName: "40 CC0 water / splash / slime SFX", sourceUrl: "https://opengameart.org/content/40-cc0-water-splash-slime-sfx",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 rubberduck 的水体音效包 splash_04；原始 OGG 未裁剪，适合中大型落水反馈。",
  },
});
