import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

const cues = [
  { words: ["春江", "潮水", "连海平"], label: "TIDE", note: "壹 / 江潮初醒" },
  { words: ["海上", "明月", "共潮生"], label: "MOON", note: "贰 / 明月潮生" },
  { words: ["滟滟", "随波", "千万里"], label: "GLIMMER", note: "叁 / 月路千里" },
  { words: ["何处", "春江", "无月明"], label: "HORIZON", note: "肆 / 江天一色" },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const renderCue = (cue) => cue.words
  .map((word, index) => `<span data-voice-token="${index}" style="--token-fill:0%">${word}</span>`)
  .join("");

function detailMarkup() {
  return `
    <section class="voice-scene is-gated" data-voice-scene aria-label="演唱输入歌词声景">
      <header class="voice-scene-meta">
        <span>MIC-DRIVEN LYRIC / 12 SEC</span>
        <strong>春江 · 声景</strong>
        <small>张若虚 / 春江花月夜</small>
      </header>
      <div class="voice-scene-signal" aria-label="麦克风输入状态">
        <span data-voice-status>READY</span>
        <i><b data-voice-level></b></i>
        <strong data-voice-note>--</strong>
      </div>
      <ol class="voice-scene-map" aria-label="歌词场景进度">
        ${cues.map((cue, index) => `<li class="${index === 0 ? "is-active" : ""}" data-voice-cue="${index}"><span>0${index + 1}</span><strong>${cue.label}</strong></li>`).join("")}
      </ol>
      <div class="voice-scene-lyric" data-voice-lyric>
        <p data-voice-phrase>${renderCue(cues[0])}</p>
        <small data-voice-prompt>${cues[0].note}</small>
      </div>
      <div class="voice-scene-gate" data-voice-gate>
        <p>一声入江，月随潮生</p>
        <div>
          <button type="button" data-voice-start>开始演唱</button>
          <button type="button" data-voice-demo>无麦克风演示</button>
        </div>
        <span>春江潮水连海平 / 海上明月共潮生</span>
      </div>
      <footer class="voice-scene-credit">
        <a href="https://github.com/JMPerez/karaoke" target="_blank" rel="noreferrer">WEB AUDIO / KARAOKE</a>
        <a href="https://github.com/cwilso/PitchDetect" target="_blank" rel="noreferrer">PITCH / PITCHDETECT</a>
        <a href="https://github.com/chentsulin/react-karaoke-lyric" target="_blank" rel="noreferrer">LYRIC / REACT KARAOKE LYRIC</a>
      </footer>
    </section>`;
}

function detectPitch(buffer, sampleRate) {
  let energy = 0;
  for (let i = 0; i < buffer.length; i += 1) energy += buffer[i] * buffer[i];
  const rms = Math.sqrt(energy / buffer.length);
  if (rms < 0.012) return { frequency: 0, rms };

  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.min(Math.floor(sampleRate / 75), buffer.length >> 1);
  let bestLag = 0;
  let bestCorrelation = 0;
  for (let lag = minLag; lag <= maxLag; lag += 2) {
    let product = 0;
    let leftEnergy = 0;
    let rightEnergy = 0;
    for (let i = 0; i < buffer.length - lag; i += 2) {
      const left = buffer[i];
      const right = buffer[i + lag];
      product += left * right;
      leftEnergy += left * left;
      rightEnergy += right * right;
    }
    const correlation = product / Math.sqrt(leftEnergy * rightEnergy || 1);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }
  return { frequency: bestCorrelation > 0.68 && bestLag ? sampleRate / bestLag : 0, rms };
}

const midiFromFrequency = (frequency) => 69 + 12 * Math.log2(frequency / 440);

function noteName(midi) {
  if (!Number.isFinite(midi) || !midi) return "--";
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const rounded = Math.round(midi);
  return `${names[((rounded % 12) + 12) % 12]}${Math.floor(rounded / 12) - 1}`;
}

function mountDetail({ root, instance }) {
  const stage = root.querySelector("[data-voice-scene]");
  if (!stage || !instance) return null;

  const phrase = stage.querySelector("[data-voice-phrase]");
  const prompt = stage.querySelector("[data-voice-prompt]");
  const status = stage.querySelector("[data-voice-status]");
  const note = stage.querySelector("[data-voice-note]");
  const meter = stage.querySelector("[data-voice-level]");
  const gate = stage.querySelector("[data-voice-gate]");
  const gateTitle = gate.querySelector("p");
  const startButton = stage.querySelector("[data-voice-start]");
  const demoButton = stage.querySelector("[data-voice-demo]");
  const cueItems = [...stage.querySelectorAll("[data-voice-cue]")];
  let visualState = instance.interaction.custom;
  let audioContext = null;
  let analyser = null;
  let stream = null;
  let buffer = null;
  let frameId = 0;
  let running = false;
  let paused = false;
  let demo = false;
  let activeCue = 0;
  let cueProgress = 0;
  let lastFrame = performance.now();
  let lastPitchCheck = 0;

  visualState.detailActive = true;

  function paintCue() {
    const cue = cues[activeCue];
    if (!cue) return;
    if (phrase.dataset.cue !== String(activeCue)) {
      phrase.dataset.cue = String(activeCue);
      phrase.innerHTML = renderCue(cue);
      prompt.textContent = cue.note;
    }
    const tokens = [...phrase.querySelectorAll("[data-voice-token]")];
    tokens.forEach((token, index) => {
      const start = index / tokens.length;
      const end = (index + 1) / tokens.length;
      const fill = clamp((cueProgress - start) / (end - start), 0, 1);
      token.style.setProperty("--token-fill", `${fill * 100}%`);
      token.classList.toggle("is-complete", fill >= 1);
    });
    cueItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === activeCue);
      item.classList.toggle("is-complete", index < activeCue);
    });
    stage.dataset.chapter = String(activeCue + 1);
  }

  function reset() {
    activeCue = 0;
    cueProgress = 0;
    visualState = instance.interaction.custom;
    Object.assign(visualState, {
      detailActive: true,
      running: true,
      activeCue: 0,
      cueProgress: 0,
      level: 0,
      pitch: 0,
      burst: 0,
      completed: false,
    });
    stage.classList.remove("is-complete");
    status.textContent = demo ? "DEMO VOICE" : "LISTENING";
    note.textContent = "--";
    meter.style.transform = "scaleX(.02)";
    gateTitle.textContent = "一声入江，月随潮生";
    paintCue();
  }

  function stopInput() {
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
    analyser = null;
    if (audioContext && audioContext.state !== "closed") audioContext.close().catch(() => {});
    audioContext = null;
    buffer = null;
  }

  function finish() {
    running = false;
    visualState.running = false;
    visualState.completed = true;
    visualState.cueProgress = 1;
    stage.classList.add("is-complete");
    stage.classList.add("is-gated");
    status.textContent = "COMPLETE";
    note.textContent = "04 / 04";
    prompt.textContent = "四句歌词已由你的声音完成";
    gateTitle.textContent = "江天一色";
    startButton.textContent = "再次演唱";
    demoButton.textContent = "再次演示";
    gate.hidden = false;
    stopInput();
  }

  function advanceCue() {
    visualState.burst = 1;
    if (activeCue >= cues.length - 1) {
      finish();
      return;
    }
    activeCue += 1;
    cueProgress = 0;
    visualState.activeCue = activeCue;
    visualState.cueProgress = 0;
    paintCue();
  }

  function frame(now) {
    if (!running) return;
    const delta = Math.min(0.05, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (!paused) {
      let level = 0;
      let pitch = visualState.pitch || 0;
      let voiced = false;
      if (demo) {
        level = 0.36 + Math.sin(now * 0.005) * 0.14 + Math.sin(now * 0.012) * 0.05;
        pitch = 61 + activeCue * 2 + Math.sin(now * 0.0017) * 4;
        voiced = true;
      } else if (analyser && now - lastPitchCheck > 70) {
        lastPitchCheck = now;
        analyser.getFloatTimeDomainData(buffer);
        const sample = detectPitch(buffer, audioContext.sampleRate);
        level = clamp(sample.rms * 9, 0, 1);
        pitch = sample.frequency ? midiFromFrequency(sample.frequency) : pitch;
        voiced = sample.rms > 0.016;
      } else {
        level = visualState.level || 0;
        voiced = level > 0.08;
      }

      visualState.level += (level - visualState.level) * 0.38;
      visualState.pitch = pitch;
      if (voiced) cueProgress += delta * (0.2 + clamp(level, 0, 1) * 1.15);
      else cueProgress = Math.max(0, cueProgress - delta * 0.035);
      visualState.cueProgress = clamp(cueProgress, 0, 1);
      meter.style.transform = `scaleX(${clamp(visualState.level, 0.02, 1)})`;
      stage.style.setProperty("--voice-scale", (1 + clamp(visualState.level, 0, 1) * 0.018).toFixed(3));
      stage.classList.toggle("is-voiced", voiced);
      note.textContent = noteName(pitch);
      status.textContent = voiced ? `SINGING / 0${activeCue + 1}` : "LISTENING";
      paintCue();
      if (cueProgress >= 1) advanceCue();
    }
    frameId = requestAnimationFrame(frame);
  }

  async function start(useDemo) {
    cancelAnimationFrame(frameId);
    stopInput();
    demo = useDemo;
    startButton.disabled = true;
    demoButton.disabled = true;
    status.textContent = useDemo ? "STARTING DEMO" : "CONNECTING";
    try {
      if (!useDemo) {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.12;
        buffer = new Float32Array(analyser.fftSize);
        audioContext.createMediaStreamSource(stream).connect(analyser);
      }
      reset();
      gate.hidden = true;
      stage.classList.remove("is-gated");
      running = true;
      paused = false;
      lastFrame = performance.now();
      frameId = requestAnimationFrame(frame);
    } catch {
      status.textContent = "MIC BLOCKED";
      gateTitle.textContent = "无法访问麦克风，可使用演示模式";
      gate.hidden = false;
      stage.classList.add("is-gated");
      stopInput();
    } finally {
      startButton.disabled = false;
      demoButton.disabled = false;
    }
  }

  const onStart = () => start(false);
  const onDemo = () => start(true);
  startButton.addEventListener("click", onStart);
  demoButton.addEventListener("click", onDemo);
  paintCue();

  return {
    setPaused(nextPaused) {
      paused = nextPaused;
      status.textContent = paused ? "PAUSED" : demo ? "DEMO VOICE" : "LISTENING";
    },
    replay() {
      demo = false;
      reset();
      gate.hidden = false;
      stage.classList.add("is-gated");
      running = false;
      cancelAnimationFrame(frameId);
      stopInput();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(frameId);
      stopInput();
      startButton.removeEventListener("click", onStart);
      demoButton.removeEventListener("click", onDemo);
    },
  };
}

export default defineEffectComponent({
  id: "voice-lyric-bloom",
  category: "music",
  draw,
  createState: () => ({
    detailActive: false,
    running: false,
    activeCue: 0,
    cueProgress: 0,
    level: 0,
    pitch: 0,
    burst: 0,
    completed: false,
  }),
  detailMarkup,
  mountDetail,
  card: {
    index: "M-07",
    title: "春江 · 声景",
    subtitle: "MIC VOICE / LYRIC SCENE",
    summary: "演唱响度逐词点亮歌词并推动场景，实时音高改变水面、月轮、流光与地平线的形态。",
    lyric: "海上明月共潮生",
    lyricAuthor: "张若虚",
    lyricWork: "春江花月夜",
    track: "12 SEC / LIVE MIC",
    sourceName: "Karaoke / PitchDetect",
    sourceUrl: "https://github.com/cwilso/PitchDetect",
    license: "MIT · ORIGINAL CANVAS",
    status: "LIVE MICROPHONE",
    interaction: "允许麦克风后跟随四句歌词演唱；响度推动逐词进度，音高改变场景构图，每句完成时触发转场。",
    notes: "完整交互链路参考 JMPerez/karaoke 的 Web Audio 输入、Chris Wilson PitchDetect 的自相关音高检测，以及 react-karaoke-lyric 的逐词进度表达；视觉与整合逻辑为本案例实现。",
  },
});
