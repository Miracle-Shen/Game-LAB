import { gameCases, musicCases, soundCases } from "./effects/components/index.js";

export { gameCases, musicCases, soundCases };

const semanticRose = musicCases.find(({ id }) => id === "semantic-rose");

export const tabs = [
  {
    id: "game",
    order: "01",
    eyebrow: "REAL-TIME VFX",
    title: "游戏特效",
    subtitle: "高科技交互与休闲游戏反馈",
    preview: "magnetic-particle-field",
  },
  {
    id: "music",
    order: "02",
    eyebrow: "LYRIC-DRIVEN VISUALS",
    title: "音乐特效",
    subtitle: "歌词语义与节拍驱动画面",
    preview: "semantic-rose",
    motion: semanticRose.motion,
  },
  {
    id: "sound",
    order: "03",
    eyebrow: "GAME AUDIO",
    title: "游戏音效",
    subtitle: "可搜索、可复用的开源声音库",
    preview: "sound",
  },
];

export const categoryCases = { game: gameCases, music: musicCases, sound: soundCases };

export const categoryMeta = {
  game: {
    order: "01",
    eyebrow: `INTERACTIVE GAME VFX / ${String(gameCases.length).padStart(2, "0")} CASES`,
    title: "游戏特效",
    description: "覆盖战斗、时间回放、潜行警戒、节奏判定、弹道、战争迷雾、Boss 预警、结构破坏与策略调度的实时互动场景。",
    preview: "magnetic-particle-field",
  },
  music: {
    order: "02",
    eyebrow: `LYRIC-DRIVEN VISUALS / ${String(musicCases.length).padStart(2, "0")} CASES`,
    title: "音乐特效",
    description: "公版中文词作进入逐行时间轴，结合真实 MilkDrop 预设与开源歌词、频谱和 MV 项目。",
    preview: "semantic-rose",
    motion: semanticRose.motion,
  },
  sound: {
    order: "03",
    eyebrow: `GAME AUDIO LIBRARY / ${String(soundCases.length).padStart(2, "0")} SOUNDS`,
    title: "游戏音效",
    description: "试听、模糊检索并按使用场景筛选开源音效与 BGM；也可将游戏中的音效点批量匹配到现有素材。",
    preview: "reward-ding",
  },
};

export const architecture = [
  ["01", "歌词输入", "LRC / TTML / 逐字时间戳"],
  ["02", "规则识别", "关键词词典优先，毫秒级命中"],
  ["03", "语义兜底", "text2vec 召回相近场景标签"],
  ["04", "特效调度", "冷却、优先级、淡入淡出"],
  ["05", "渲染输出", "粒子 / 场景 / 音频响应背景"],
];

export const soundMatchingArchitecture = [
  ["01", "提取音效点", "事件、情绪、材质与时长"],
  ["02", "语义比较", "标题、标签和使用场景联合评分"],
  ["03", "阈值决策", "默认 0.62，可按项目调节"],
  ["04", "直接复用", "命中阈值时返回 card 与本地音频"],
  ["05", "独立生成", "未命中时返回该音效点的生成 prompt"],
];
