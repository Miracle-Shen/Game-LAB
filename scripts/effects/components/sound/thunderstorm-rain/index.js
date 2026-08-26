import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "thunderstorm-rain", category: "sound", draw,
  card: {
    index: "S-64", title: "暴雨长雷", subtitle: "AMBIENCE / RAIN & THUNDER",
    summary: "连续雨幕中穿过一记绵长雷声，适合风暴关卡、阴暗户外和天气转场。",
    audioCategory: "ambience", audioCategoryLabel: "环境",
    keywords: ["暴雨", "雷声", "雷雨", "闪电", "风暴", "天气", "环境", "rain", "thunder", "lightning", "storm", "weather", "ambience"],
    useCases: ["风暴关卡", "天气转场", "阴暗户外"],
    audio: { src: new URL("./assets/rain-thunder.ogg", import.meta.url).href, format: "OGG", duration: 44.37 },
    sourceName: "OpenGameArt / WuxiaScrub", sourceUrl: "https://opengameart.org/content/rain-long-thunder",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "WuxiaScrub 发布的自然雨声，约 20 秒处出现长雷；来源页声明无需署名并以 CC0 发布。",
  },
});
