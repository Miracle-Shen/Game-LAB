import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "ui-hover", category: "sound", draw,
  card: {
    index: "S-48", title: "菜单悬停", subtitle: "UI / ROLLOVER",
    summary: "轻巧的悬停触点，适合桌面菜单、卡片焦点和选项预选。",
    audioCategory: "ui", audioCategoryLabel: "界面",
    keywords: ["悬停","菜单","焦点","预选","卡片","hover","rollover","focus","menu"],
    useCases: ["菜单悬停","卡片焦点","选项预选"],
    audio: { src: new URL("./assets/rollover1.ogg", import.meta.url).href, format: "OGG", duration: 0.23 },
    sourceName: "Kenney UI Audio", sourceUrl: "https://kenney.nl/assets/ui-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney UI Audio 的 rollover1。",
  },
});
