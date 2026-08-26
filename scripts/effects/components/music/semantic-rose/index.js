import { defineEffectComponent } from "../../../component-registry.js";
import { draw, mountKaraoke, renderKaraokeDetail } from "./renderer.js";

const audioUrl = new URL("./assets/on-the-run-excerpt.m4a", import.meta.url).href;
const chartUrl = new URL("./assets/on-the-run.txt", import.meta.url).href;

export default defineEffectComponent({
  id: "semantic-rose",
  category: "music",
  draw,
  createState: () => ({
    playing: false,
    musicLevel: 0,
    micLevel: 0,
    pitch: 0,
    targetPitch: 0,
    accuracy: 0,
    progress: 0,
    hitPulse: 0,
    lastHitNote: null,
    voiced: false,
    heartMode: false,
    completed: false,
  }),
  detailMarkup: () => renderKaraokeDetail({ audioUrl }),
  mountDetail: ({ root, instance }) => mountKaraoke({ root, instance, chartUrl }),
  card: {
    index: "M-01",
    title: "On the Run · Live",
    subtitle: "MIC PITCH / KARAOKE",
    summary: "同一份标准音高可在线性谱与心形轮廓间切换；实际音高围绕目标轮廓实时偏移。",
    lyric: "So far away from home",
    lyricAuthor: "Joshua Morin",
    lyricWork: "On the Run",
    track: "20 SEC / LIVE MIC",
    sourceName: "Performous / Loukai / USDX",
    sourceUrl: "https://performous.org/songs",
    license: "CC BY-SA 2.5 · OPEN SOURCE",
    status: "LIVE MICROPHONE",
    interaction: "选择音高谱或心形模式后开始演唱；唱准时轨迹贴合心形，高低音分别向轮廓两侧偏移。",
    notes: "歌曲录音、歌词与 UltraStar 音高谱来自 Performous libre song pack；麦克风音高链路参考 Loukai，音符轨与命中反馈参考 UltraStar Deluxe；声音心形为本案例实现。",
  },
});
