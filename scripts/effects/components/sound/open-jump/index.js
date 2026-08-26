import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "open-jump", category: "sound", draw,
  card: {
    index: "S-101", title: "英雄跳跃", subtitle: "ACTION / JUMP",
    summary: "角色起跳、平台跳跃、跃迁动作可使用的 OpenGame 演示原声音效。",
    audioCategory: "bgm", audioCategoryLabel: "BGM",
    keywords: ["跳跃","起跳","动作","jump","action"],
    useCases: ["角色起跳","平台跳跃","跃迁动作"],
    audio: { src: new URL("./assets/jump_sfx.wav", import.meta.url).href, format: "WAV", duration: 7 },
    sourceName: "OpenGame · Infinity Strike", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/marvel/index.html",
    license: "Apache-2.0", status: "READY TO USE",
    notes: "取自 OpenGame Infinity Strike 官方演示的 jump_sfx.wav；保留原始编码，不做去重或重编码。",
  },
});
