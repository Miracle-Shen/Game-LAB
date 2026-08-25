import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "ui-toggle", category: "sound", draw,
  card: {
    index: "S-10", title: "开关拨动", subtitle: "UI / TOGGLE",
    summary: "带机械感的短促拨动声，适合设置开关、模式切换和装备启停。",
    audioCategory: "ui", audioCategoryLabel: "界面",
    keywords: ["开关", "切换", "设置", "模式", "启用", "关闭", "toggle", "switch", "setting", "mode", "enable", "disable"],
    useCases: ["设置开关", "模式切换", "装备启停"],
    audio: { src: new URL("./assets/toggle_002.ogg", import.meta.url).href, format: "OGG", duration: 0.14 },
    sourceName: "Kenney Interface Sounds", sourceUrl: "https://kenney.nl/assets/interface-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Interface Sounds 的 toggle_002；机械触点使二元状态变化更明确。",
  },
});
