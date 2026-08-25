import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "semantic-sunset",
  category: "music",
  draw,
  card: {
    index: "M-02",
    title: "天净沙 · 秋思",
    subtitle: "PRESET SCENE / MA ZHIYUAN",
    summary: "马致远散曲按意象切分，枯藤、昏鸦、古道与夕阳依次推动预设相位变化。",
    lyric: "夕阳西下，断肠人在天涯",
    lyricAuthor: "马致远",
    lyricWork: "天净沙·秋思",
    lyricDuration: 20,
    lyrics: ["枯藤老树昏鸦", "小桥流水人家", "古道西风瘦马", "夕阳西下", "断肠人在天涯"],
    sourceName: "Stims",
    sourceUrl: "https://github.com/zz-plant/stims",
    license: "UNLICENSE",
    status: "MILKDROP PRESET",
    notes: "直接采用 Stims WebGL2 预设的项目录屏；该项目提供 1,787 个可检索 .milk 预设与浏览器内编辑器。",
    motion: {
      src: new URL("./assets/starburst-phasing.mp4", import.meta.url).href,
      title: "Eo.S. - Starburst 05 Phasing",
      project: "Stims",
      license: "Unlicense",
      filter: "saturate(0.78) brightness(0.68) contrast(1.18)",
      url: "https://github.com/zz-plant/stims/blob/main/docs/assets/clips/eos-starburst-05-phasing.gif",
    },
  },
});
