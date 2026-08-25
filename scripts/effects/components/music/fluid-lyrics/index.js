import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "fluid-lyrics",
  category: "music",
  draw,
  card: {
    index: "M-04",
    title: "水调歌头 · 流体",
    subtitle: "MILKDROP / SU SHI",
    summary: "苏轼词作在反馈纹理中逐行浮现，以句长调制流体波幅和转场速度。",
    lyric: "但愿人长久，千里共婵娟",
    lyricAuthor: "苏轼",
    lyricWork: "水调歌头·明月几时有",
    lyricDuration: 30,
    lyrics: ["明月几时有", "把酒问青天", "不知天上宫阙", "今夕是何年", "我欲乘风归去", "又恐琼楼玉宇", "高处不胜寒", "起舞弄清影", "何似在人间", "但愿人长久 千里共婵娟"],
    sourceName: "Butterchurn",
    sourceUrl: "https://github.com/jberg/butterchurn",
    license: "MIT",
    status: "MILKDROP WEBGL",
    notes: "参考 Butterchurn 的 WebGL MilkDrop 渲染和预设混合接口；当前视觉片段来自同一 MilkDrop 开源谱系的 Stims。",
    motion: {
      src: new URL("./assets/neon-space.mp4", import.meta.url).href,
      title: "Martin - Neon Space PS3",
      project: "Stims",
      license: "Unlicense",
      filter: "saturate(0.76) brightness(0.64) contrast(1.2)",
      url: "https://github.com/zz-plant/stims/blob/main/docs/assets/clips/martin-neon-space-ps3.gif",
    },
  },
});
