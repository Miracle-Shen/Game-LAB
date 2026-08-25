import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "phase-jump", category: "sound", draw,
  card: {
    index: "S-19", title: "相位跃迁", subtitle: "DIGITAL / PHASE JUMP",
    summary: "带空间折叠感的短电子过渡，适合传送、闪现、场景切换和稀有道具出现。",
    audioCategory: "digital", audioCategoryLabel: "电子",
    keywords: ["传送", "闪现", "跃迁", "空间", "切换", "出现", "teleport", "blink", "phase", "jump", "transition", "spawn"],
    useCases: ["角色传送", "闪现技能", "稀有物出现"],
    audio: { src: new URL("./assets/phaseJump3.ogg", import.meta.url).href, format: "OGG", duration: 0.44 },
    sourceName: "Kenney Digital Audio", sourceUrl: "https://kenney.nl/assets/digital-audio",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Digital Audio 的 phaseJump3；短促且有明确空间感。",
  },
});
