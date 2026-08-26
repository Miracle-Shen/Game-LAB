import { defineEffectComponent } from "../../../component-registry.js";
import { draw, mountKaraoke, renderKaraokeDetail } from "./renderer.js";

const originalAudioUrl = new URL("./assets/on-the-run-excerpt.m4a", import.meta.url).href;
const backingAudioUrl = new URL("./assets/on-the-run-backing.m4a", import.meta.url).href;
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
  detailMarkup: () => renderKaraokeDetail({ backingAudioUrl, originalAudioUrl }),
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
    sourceName: "Performous / Demucs / Loukai / USDX",
    sourceUrl: "https://performous.org/songs",
    license: "CC BY-SA 2.5 · OPEN SOURCE",
    status: "LIVE MICROPHONE",
    interaction: "开始演唱使用去人声伴奏并开启麦克风评分；原唱试听保留 Joshua Morin 的演唱，音高谱与心形模式可随时切换。",
    notes: "歌曲录音、歌词与 UltraStar 音高谱来自 Performous libre song pack；演唱伴奏由 Demucs 从原录音分离；麦克风音高链路参考 Loukai，音符轨与命中反馈参考 UltraStar Deluxe。",
  },
});
