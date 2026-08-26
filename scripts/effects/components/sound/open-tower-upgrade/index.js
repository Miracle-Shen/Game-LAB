import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-tower-upgrade", category: "sound", draw,
  card: {
    index: "S-77", title: "塔体升级音", subtitle: "TOWER / UPGRADE",
    summary: "炮塔升级、属性强化、科技解锁可使用的 OpenGame 演示原声音效。",
    audioCategory: "feedback", audioCategoryLabel: "反馈",
    keywords: ["塔防","升级","强化","tower","upgrade"],
    useCases: ["炮塔升级","属性强化","科技解锁"],
    audio: { src: new URL("./assets/sfx_tower_upgrade.wav", import.meta.url).href, format: "WAV", duration: 1 },
    sourceName: "OpenGame · Hajimi Defense", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/hajimi/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Hajimi Defense 官方演示的 sfx_tower_upgrade.wav；保留原始编码，不做去重或重编码。",
  },
});
