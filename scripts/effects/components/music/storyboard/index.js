import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "storyboard",
  category: "music",
  draw,
  card: {
    index: "M-06",
    title: "春江花月夜 · 分镜",
    subtitle: "KINETIC TYPE / ZHANG RUOXU",
    summary: "《春江花月夜》按月升、江流、花林与归舟拆成镜头段落，循环展示字幕分镜。",
    lyric: "春江潮水连海平，海上明月共潮生",
    lyricAuthor: "张若虚",
    lyricWork: "春江花月夜",
    lyricDuration: 30,
    lyrics: ["春江潮水连海平", "海上明月共潮生", "滟滟随波千万里", "何处春江无月明", "江流宛转绕芳甸", "月照花林皆似霰", "空里流霜不觉飞", "汀上白沙看不见", "江天一色无纤尘", "皎皎空中孤月轮"],
    sourceName: "Glitchframe",
    sourceUrl: "https://github.com/OlaProeis/Glitchframe",
    license: "MIT",
    status: "LYRIC VIDEO PIPELINE",
    notes: "参考 Glitchframe 的逐词对齐、关键帧背景、响应式着色器和 kinetic type 管线；这里压缩为浏览器实时预览。",
    motion: {
      src: new URL("./assets/crosshair-dimension.mp4", import.meta.url).href,
      title: "Zylot - Crosshair Dimension (Light of Ages)",
      project: "Stims",
      license: "Unlicense",
      filter: "saturate(0.8) brightness(0.68) contrast(1.16)",
      url: "https://github.com/zz-plant/stims/blob/main/docs/assets/clips/zylot-crosshair-dimension-light-of-ages.gif",
    },
  },
});
