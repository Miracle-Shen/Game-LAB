import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "mouse-release", category: "sound", draw,
  card: {
    index: "S-49", title: "鼠标松开", subtitle: "UI / RELEASE",
    summary: "极短的按键释放触点，适合拖拽结束、按钮抬起和长按完成。",
    audioCategory: "ui", audioCategoryLabel: "界面",
    keywords: ["松开","按钮","拖拽","长按","鼠标","release","mouse","button","drag"],
    useCases: ["拖拽结束","按钮抬起","长按完成"],
    audio: { src: new URL("./assets/mouserelease1.ogg", import.meta.url).href, format: "OGG", duration: 0.07 },
    sourceName: "Kenney UI Audio", sourceUrl: "https://kenney.nl/assets/ui-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney UI Audio 的 mouserelease1。",
  },
});
