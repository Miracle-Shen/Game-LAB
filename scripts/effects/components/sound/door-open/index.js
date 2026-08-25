import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "door-open", category: "sound", draw,
  card: {
    index: "S-25", title: "木门开启", subtitle: "FOLEY / DOOR OPEN",
    summary: "木门转轴与门板运动的完整声音，适合房间进入、建筑解锁和场景转场。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["门", "开门", "木门", "房间", "建筑", "解锁", "door", "open", "wood", "room", "building", "unlock"],
    useCases: ["房间进入", "建筑解锁", "场景转场"],
    audio: { src: new URL("./assets/doorOpen_1.ogg", import.meta.url).href, format: "OGG", duration: 0.92 },
    sourceName: "Kenney RPG Audio", sourceUrl: "https://kenney.nl/assets/rpg-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney RPG Audio 的 doorOpen_1；保留转轴起音和门板尾音。",
  },
});
