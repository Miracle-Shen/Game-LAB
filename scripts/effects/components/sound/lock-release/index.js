import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "lock-release", category: "sound", draw,
  card: {
    index: "S-70", title: "锁扣弹开", subtitle: "FOLEY / LOCK RELEASE",
    summary: "短促的金属锁舌回弹声，适合宝箱解锁、门锁开启和机关解除。",
    audioCategory: "foley", audioCategoryLabel: "拟音",
    keywords: ["锁", "开锁", "解锁", "锁扣", "宝箱", "门锁", "机关", "lock", "unlock", "latch", "chest", "mechanism"],
    useCases: ["宝箱解锁", "门锁开启", "机关解除"],
    audio: { src: new URL("./assets/lock_03.ogg", import.meta.url).href, format: "OGG", duration: 0.34 },
    sourceName: "80 CC0 RPG SFX", sourceUrl: "https://opengameart.org/content/80-cc0-rpg-sfx",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 rubberduck 的 80 CC0 RPG SFX：lock_03；瞬态明确，可与开盖或开门声叠加。",
  },
});
