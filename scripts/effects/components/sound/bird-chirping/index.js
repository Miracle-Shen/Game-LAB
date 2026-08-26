import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "bird-chirping", category: "sound", draw,
  card: {
    index: "S-63", title: "林间鸟鸣", subtitle: "AMBIENCE / BIRD CHIRPING",
    summary: "自然录制的短促鸟鸣与户外底噪，适合森林清晨、庭院场景和安全区域铺底。",
    audioCategory: "ambience", audioCategoryLabel: "环境",
    keywords: ["鸟鸣", "鸟叫", "森林", "清晨", "户外", "庭院", "自然", "bird", "chirp", "forest", "morning", "nature", "ambience"],
    useCases: ["森林清晨", "庭院环境", "安全区域"],
    audio: { src: new URL("./assets/birdchirping071414.wav", import.meta.url).href, format: "WAV", duration: 3.00 },
    sourceName: "OpenGameArt / syncopika", sourceUrl: "https://opengameart.org/content/bird-chirping-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "syncopika 录制的户外鸟鸣原声；来源页以 CC0 发布，可直接用于商业项目。",
  },
});
