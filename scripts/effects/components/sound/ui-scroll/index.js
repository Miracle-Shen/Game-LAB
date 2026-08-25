import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "ui-scroll", category: "sound", draw,
  card: {
    index: "S-11", title: "列表滑动", subtitle: "UI / SCROLL",
    summary: "连续而轻盈的滑动纹理，适合长列表滚动、抽奖条带和快速选项浏览。",
    audioCategory: "ui", audioCategoryLabel: "界面",
    keywords: ["滚动", "滑动", "列表", "浏览", "抽奖", "菜单", "scroll", "swipe", "list", "browse", "reel", "menu"],
    useCases: ["列表滚动", "抽奖条带", "快速浏览"],
    audio: { src: new URL("./assets/scroll_003.ogg", import.meta.url).href, format: "OGG", duration: 1.00 },
    sourceName: "Kenney Interface Sounds", sourceUrl: "https://kenney.nl/assets/interface-sounds",
    license: "CC0 1.0", status: "READY TO USE",
    notes: "取自 Kenney Interface Sounds 的 scroll_003；连续纹理可配合滚动速度控制音量。",
  },
});
