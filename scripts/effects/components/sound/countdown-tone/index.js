import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "countdown-tone", category: "sound", draw,
  card: {
    index: "S-20", title: "三音倒计时", subtitle: "SIGNAL / THREE TONE",
    summary: "三个低位电子音构成明确节拍，适合比赛倒计时、阶段推进和回合提示。",
    audioCategory: "signal", audioCategoryLabel: "信号",
    keywords: ["倒计时", "三音", "比赛", "回合", "阶段", "提示", "countdown", "three tone", "race", "round", "stage", "signal"],
    useCases: ["比赛倒计时", "回合提示", "阶段推进"],
    audio: { src: new URL("./assets/lowThreeTone.ogg", import.meta.url).href, format: "OGG", duration: 1.02 },
    sourceName: "Kenney Digital Audio", sourceUrl: "https://kenney.nl/assets/digital-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Digital Audio 的 lowThreeTone；三段结构适合直接绑定 3-2-1。",
  },
});
