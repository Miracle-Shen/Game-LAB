import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "space-engine-hum", category: "sound", draw,
  card: {
    index: "S-45", title: "小型飞船引擎", subtitle: "SCI-FI / SPACE ENGINE",
    summary: "平稳的五秒飞船引擎底噪，适合太空航行、载具待机和科幻场景铺底。",
    audioCategory: "ambience", audioCategoryLabel: "环境",
    keywords: ["飞船","引擎","航行","载具","太空","spaceship","engine","space","vehicle","hum"],
    useCases: ["太空航行","载具待机","场景铺底"],
    audio: { src: new URL("./assets/spaceEngineSmall_000.ogg", import.meta.url).href, format: "OGG", duration: 5.00 },
    sourceName: "Kenney Sci-fi Sounds", sourceUrl: "https://kenney.nl/assets/sci-fi-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Sci-fi Sounds 的 spaceEngineSmall_000；五秒持续引擎纹理。",
  },
});
