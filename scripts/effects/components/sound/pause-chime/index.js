import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "pause-chime", category: "sound", draw,
  card: {
    index: "S-34", title: "暂停提示", subtitle: "RETRO / PAUSE IN",
    summary: "短促收束的暂停提示，适合暂停菜单、模式冻结和操作中断。",
    audioCategory: "signal", audioCategoryLabel: "信号",
    keywords: ["暂停","冻结","中断","菜单","复古","pause","freeze","menu","stop"],
    useCases: ["进入暂停","模式冻结","操作中断"],
    audio: { src: new URL("./assets/sfx_sounds_pause1_in.wav", import.meta.url).href, format: "WAV", duration: 0.26 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Pause Sounds 分类的 sfx_sounds_pause1_in。",
  },
});
