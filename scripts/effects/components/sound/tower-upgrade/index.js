import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "tower-upgrade", category: "sound", draw,
  card: {
    index: "S-72", title: "建筑升级", subtitle: "BUILD / UPGRADE",
    summary: "快速上扬并收束的升级提示，适合建筑升阶、模块强化和科技解锁。",
    audioCategory: "feedback", audioCategoryLabel: "反馈",
    keywords: ["升级", "升阶", "强化", "科技", "建筑", "塔防", "upgrade", "level up", "build"],
    useCases: ["防御塔升级", "建筑升阶", "科技强化"],
    audio: { src: new URL("./assets/maximize_004.ogg", import.meta.url).href, format: "OGG", duration: 0.42 },
    sourceName: "Kenney Interface Sounds", sourceUrl: "https://kenney.nl/assets/interface-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Interface Sounds 的 maximize_004；其上扬轮廓适合作为升级完成反馈。",
  },
});
