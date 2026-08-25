import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "falling-whistle", category: "sound", draw,
  card: {
    index: "S-42", title: "高空坠落", subtitle: "RETRO / FALLING",
    summary: "持续下坠的复古滑音，适合角色跌落、物体坠空和危险预告。",
    audioCategory: "movement", audioCategoryLabel: "移动",
    keywords: ["坠落","跌落","滑音","危险","高空","falling","drop","whistle","danger"],
    useCases: ["角色跌落","物体坠空","危险预告"],
    audio: { src: new URL("./assets/sfx_sounds_falling1.wav", import.meta.url).href, format: "WAV", duration: 0.80 },
    sourceName: "512 Sound Effects (8-bit style)", sourceUrl: "https://opengameart.org/content/512-sound-effects-8-bit-style",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Movement / Falling Sounds 分类的 sfx_sounds_falling1。",
  },
});
