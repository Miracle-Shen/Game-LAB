import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "chips-collide", category: "sound", draw,
  card: {
    index: "S-23", title: "筹码碰撞", subtitle: "TABLETOP / CHIPS COLLIDE",
    summary: "清脆密集的筹码互撞，适合积分结算、代币收集和桌面奖励反馈。",
    audioCategory: "tabletop", audioCategoryLabel: "棋牌",
    keywords: ["筹码", "代币", "积分", "碰撞", "奖励", "结算", "chips", "token", "score", "collide", "reward", "casino"],
    useCases: ["筹码结算", "代币收集", "积分奖励"],
    audio: { src: new URL("./assets/chips-collide-3.ogg", import.meta.url).href, format: "OGG", duration: 0.26 },
    sourceName: "Kenney Casino Audio", sourceUrl: "https://kenney.nl/assets/casino-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Casino Audio 的 chips-collide-3；多枚筹码的高频碰撞适合批量奖励。",
  },
});
