import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "ui-click", category: "sound", draw,
  card: {
    index: "S-08", title: "轻触点击", subtitle: "UI / SOFT CLICK",
    summary: "极短、干净的界面触点，适合普通按钮、选项确认和轻量菜单操作。",
    audioCategory: "ui", audioCategoryLabel: "界面",
    keywords: ["点击", "按钮", "菜单", "选择", "轻触", "确认", "click", "button", "menu", "select", "tap", "ui"],
    useCases: ["按钮点击", "菜单选择", "轻量确认"],
    audio: { src: new URL("./assets/click_001.ogg", import.meta.url).href, format: "OGG", duration: 0.10 },
    sourceName: "Kenney Interface Sounds", sourceUrl: "https://kenney.nl/assets/interface-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Interface Sounds 的 click_001；短瞬态适合高频重复操作。",
  },
});
