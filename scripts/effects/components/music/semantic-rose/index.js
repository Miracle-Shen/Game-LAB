import { defineEffectComponent } from "../../../component-registry.js";
import { draw, mountKaraoke, renderKaraokeDetail } from "./renderer.js";

const originalAudioUrl = new URL("./assets/on-the-run-excerpt.m4a", import.meta.url).href;
const backingAudioUrl = new URL("./assets/on-the-run-backing.m4a", import.meta.url).href;
const chartUrl = new URL("./assets/on-the-run.txt", import.meta.url).href;

function controlsMarkup() {
  return `
    <button
      class="sing-session-chooser"
      type="button"
      data-sing-choose
      aria-controls="sing-session-choice"
      aria-expanded="true"
    >
      <span>体验模式</span>
      <strong data-sing-session-label>试听 / 演唱</strong>
    </button>`;
}

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
  detailMarkup: ({ icon }) => renderKaraokeDetail({ backingAudioUrl, originalAudioUrl, icon }),
  controlsMarkup,
  mountDetail: ({ root, instance }) => mountKaraoke({ root, instance, chartUrl }),
  card: {
    index: "M-01",
    title: "On the Run · Live",
    subtitle: "MIC PITCH / KARAOKE",
    summary: "真实音高实时生长为心形轨迹，空白段自动平滑连接；唱得越准，心跳、霓虹、彗星与星芒越强。",
    lyric: "So far away from home",
    lyricAuthor: "Joshua Morin",
    lyricWork: "On the Run",
    track: "20 SEC / LIVE MIC",
    sourceName: "Performous / Demucs / Loukai / USDX",
    sourceUrl: "https://performous.org/songs",
    license: "CC BY-SA 2.5 · OPEN SOURCE",
    status: "LIVE MICROPHONE",
    interaction: "可随时在原唱试听和麦克风演唱之间切换；心形模式以真实音高构成轮廓，跑调仍保持心形，准确演唱触发完整高能动画。",
    notes: "歌曲录音、歌词与 UltraStar 音高谱来自 Performous libre song pack；演唱伴奏由 Demucs 从原录音分离；麦克风音高链路参考 Loukai，音符轨与命中反馈参考 UltraStar Deluxe。",
  },
});
