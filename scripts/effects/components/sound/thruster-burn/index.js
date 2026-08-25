import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "thruster-burn", category: "sound", draw,
  card: {
    index: "S-46", title: "推进器燃烧", subtitle: "SCI-FI / THRUSTER",
    summary: "持续的推进器喷射声，适合火箭加速、飞船起步和喷气背包。",
    audioCategory: "ambience", audioCategoryLabel: "环境",
    keywords: ["推进器","火箭","飞船","加速","喷气","thruster","rocket","boost","jetpack"],
    useCases: ["火箭加速","飞船起步","喷气背包"],
    audio: { src: new URL("./assets/thrusterFire_000.ogg", import.meta.url).href, format: "OGG", duration: 5.00 },
    sourceName: "Kenney Sci-fi Sounds", sourceUrl: "https://kenney.nl/assets/sci-fi-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Sci-fi Sounds 的 thrusterFire_000；五秒持续推进器纹理。",
  },
});
