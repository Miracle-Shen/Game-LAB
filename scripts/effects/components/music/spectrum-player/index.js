import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "spectrum-player",
  category: "music",
  draw,
  card: {
    index: "M-05",
    title: "将进酒 · 频谱",
    subtitle: "SPECTRUM / LI BAI",
    summary: "李白长歌配合径向频谱，低频峰值、反射和逐句高亮形成强弱层级。",
    lyric: "天生我材必有用，千金散尽还复来",
    lyricAuthor: "李白",
    lyricWork: "将进酒",
    lyricDuration: 30,
    lyrics: ["君不见黄河之水天上来", "奔流到海不复回", "君不见高堂明镜悲白发", "朝如青丝暮成雪", "人生得意须尽欢", "莫使金樽空对月", "天生我材必有用", "千金散尽还复来", "烹羊宰牛且为乐", "会须一饮三百杯"],
    sourceName: "audioMotion-analyzer",
    sourceUrl: "https://github.com/hvianna/audioMotion-analyzer",
    license: "AGPL-3.0",
    status: "HIGH-RES SPECTRUM",
    notes: "参考 audioMotion-analyzer 的高分辨率频谱、峰值保持、镜像和径向模式；画面叠加层保留可调强度。",
    motion: {
      src: new URL("./assets/orb-radiation.mp4", import.meta.url).href,
      title: "Orb - Radiation",
      project: "Stims",
      license: "Unlicense",
      filter: "saturate(0.94) brightness(0.86) contrast(1.14)",
      url: "https://github.com/zz-plant/stims/blob/main/docs/assets/clips/orb-radiation.gif",
    },
  },
});
