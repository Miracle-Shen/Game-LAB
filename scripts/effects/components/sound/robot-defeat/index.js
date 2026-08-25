import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "robot-defeat", category: "sound", draw,
  card: {
    index: "S-40", title: "机器人宕机", subtitle: "RETRO / ROBOT DEFEAT",
    summary: "电子失稳式的机器人败退声，适合机械敌人损毁和装置断电。",
    audioCategory: "character", audioCategoryLabel: "角色",
    keywords: ["机器人","宕机","机械","损毁","断电","robot","defeat","shutdown","machine"],
    useCases: ["机器人损毁","机械敌人败退","装置断电"],
    audio: { src: new URL("./assets/sfx_deathscream_robot1.wav", import.meta.url).href, format: "WAV", duration: 0.60 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Death Screams / Robot 分类的 sfx_deathscream_robot1。",
  },
});
