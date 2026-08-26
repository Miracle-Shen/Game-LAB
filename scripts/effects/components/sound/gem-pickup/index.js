import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "gem-pickup", category: "sound", draw,
  card: {
    index: "S-69", title: "宝石拾取", subtitle: "FEEDBACK / GEM PICKUP",
    summary: "清亮而带细碎共鸣的宝石收集声，适合稀有掉落、资源入账和连续拾取。",
    audioCategory: "feedback", audioCategoryLabel: "反馈",
    keywords: ["宝石", "水晶", "拾取", "收集", "稀有", "掉落", "奖励", "gem", "crystal", "pickup", "collect", "loot", "reward"],
    useCases: ["稀有掉落", "资源入账", "连续拾取"],
    audio: { src: new URL("./assets/item_gem_04.ogg", import.meta.url).href, format: "OGG", duration: 0.59 },
    sourceName: "80 CC0 RPG SFX", sourceUrl: "https://opengameart.org/content/80-cc0-rpg-sfx",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 rubberduck 的 80 CC0 RPG SFX：item_gem_04；比金币反馈更通透，适合稀有资源。",
  },
});
