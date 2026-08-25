import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "low-health-alarm", category: "sound", draw,
  card: {
    index: "S-32", title: "低血量警报", subtitle: "RETRO / LOW HEALTH",
    summary: "循环感明确的像素警报，适合生命危急、倒计时和资源不足提醒。",
    audioCategory: "signal", audioCategoryLabel: "信号",
    keywords: ["低血量","警报","危急","倒计时","资源不足","low health","alarm","warning","danger"],
    useCases: ["生命危急","限时警告","资源不足"],
    audio: { src: new URL("./assets/sfx_lowhealth_alarmloop1.wav", import.meta.url).href, format: "WAV", duration: 0.80 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Low health Alarms 分类的 sfx_lowhealth_alarmloop1。",
  },
});
