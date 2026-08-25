import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "slime-splat", category: "sound", draw,
  card: {
    index: "S-47", title: "史莱姆飞溅", subtitle: "SCI-FI / SLIME",
    summary: "湿润而弹性的黏液触点，适合史莱姆命中、软体跳跃和黏液道具。",
    audioCategory: "impact", audioCategoryLabel: "冲击",
    keywords: ["史莱姆","黏液","软体","飞溅","弹性","slime","splat","goo","squish"],
    useCases: ["史莱姆命中","软体跳跃","黏液道具"],
    audio: { src: new URL("./assets/slime_000.ogg", import.meta.url).href, format: "OGG", duration: 0.50 },
    sourceName: "Kenney Sci-fi Sounds", sourceUrl: "https://kenney.nl/assets/sci-fi-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Sci-fi Sounds 的 slime_000。",
  },
});
