import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "ui-confirm", category: "sound", draw,
  card: {
    index: "S-09", title: "操作确认", subtitle: "UI / CONFIRMATION",
    summary: "清晰的双层确认提示，适合购买成功、保存完成和弹窗主操作。",
    audioCategory: "ui", audioCategoryLabel: "界面",
    keywords: ["确认", "成功", "购买", "保存", "提交", "完成", "confirm", "success", "purchase", "save", "submit", "ui"],
    useCases: ["购买确认", "保存完成", "主操作反馈"],
    audio: { src: new URL("./assets/confirmation_002.ogg", import.meta.url).href, format: "OGG", duration: 0.54 },
    sourceName: "Kenney Interface Sounds", sourceUrl: "https://kenney.nl/assets/interface-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Interface Sounds 的 confirmation_002；比普通点击更突出操作结果。",
  },
});
