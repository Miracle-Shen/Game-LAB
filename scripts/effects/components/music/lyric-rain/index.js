import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "lyric-rain",
  category: "music",
  draw,
  card: {
    index: "M-03",
    title: "雨霖铃 · 逐字",
    subtitle: "SYNCED LYRIC / LIU YONG",
    summary: "柳永《雨霖铃》以逐行时间轴滚动，句内进度和雨线、星点共同推进。",
    lyric: "今宵酒醒何处，杨柳岸晓风残月",
    lyricAuthor: "柳永",
    lyricWork: "雨霖铃·寒蝉凄切",
    lyricDuration: 27,
    lyrics: ["寒蝉凄切", "对长亭晚", "骤雨初歇", "都门帐饮无绪", "留恋处 兰舟催发", "执手相看泪眼", "竟无语凝噎", "念去去 千里烟波", "暮霭沉沉楚天阔"],
    sourceName: "Lyric Wave Player",
    sourceUrl: "https://github.com/ZihangDong/lyric-wave-player",
    license: "MIT",
    status: "LRC TIMELINE",
    notes: "参考 Lyric Wave Player 的零依赖 LRC 同步和 Web Audio 波形结构；词句高亮由本站共享时间轴控制。",
    motion: {
      src: new URL("./assets/cerebral-stars.mp4", import.meta.url).href,
      title: "Krash & Rovastar - Cerebral Demons",
      project: "Stims",
      license: "Unlicense",
      filter: "saturate(0.88) brightness(0.78) contrast(1.16)",
      url: "https://github.com/zz-plant/stims/blob/main/docs/assets/clips/krash-rovastar-cerebral-demons-stars.gif",
    },
  },
});
