import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "chain-rattle", category: "sound", draw,
  card: {
    index: "S-68", title: "锁链晃动", subtitle: "FOLEY / CHAIN RATTLE",
    summary: "多节金属链条碰撞与回摆，适合机关拉动、囚笼互动和装备晃动。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["锁链", "铁链", "金属", "机关", "囚笼", "装备", "晃动", "chain", "rattle", "metal", "mechanism"],
    useCases: ["机关拉动", "囚笼互动", "装备晃动"],
    audio: { src: new URL("./assets/chain_03.ogg", import.meta.url).href, format: "OGG", duration: 0.93 },
    sourceName: "80 CC0 RPG SFX", sourceUrl: "https://opengameart.org/content/80-cc0-rpg-sfx",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 rubberduck 的 80 CC0 RPG SFX：chain_03；包含连续链节碰撞和短尾音。",
  },
});
