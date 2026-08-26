import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "buzzer-lock", category: "sound", draw,
  card: {
    index: "S-73", title: "锁定蜂鸣", subtitle: "BUZZER / LOCK OUT",
    summary: "尖锐的短蜂鸣，适合答题锁定、操作超时、禁用状态和回合裁决。",
    audioCategory: "signal", audioCategoryLabel: "信号",
    keywords: ["蜂鸣", "锁定", "超时", "禁用", "答题", "裁决", "buzzer", "lock", "timeout", "disabled"],
    useCases: ["答题锁定", "操作超时", "禁用提示"],
    audio: { src: new URL("./assets/error_007.ogg", import.meta.url).href, format: "OGG", duration: 0.19 },
    sourceName: "Kenney Interface Sounds", sourceUrl: "https://kenney.nl/assets/interface-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Interface Sounds 的 error_007；比现有负向提示更短，更适合瞬时锁定事件。",
  },
});
