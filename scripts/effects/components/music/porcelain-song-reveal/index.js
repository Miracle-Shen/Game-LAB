import { defineEffectComponent } from "../../../component-registry.js";
import { createRenderer } from "./renderer.js";

const audioUrl = new URL("./assets/porcelain-score.mp3", import.meta.url).href;
const scoreUrl = new URL("./assets/porcelain-score.json", import.meta.url).href;

const sectionMeta = [
  ["AWAKEN", "素胚"],
  ["RUYI", "如意"],
  ["CLOUD", "云肩"],
  ["BLOOM", "初花"],
  ["PEONY", "牡丹"],
  ["INK WASH", "水墨"],
  ["BORDER", "边饰"],
  ["LOTUS", "莲纹"],
  ["SEAL", "落款"],
];

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function formatTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safe / 60);
  const remaining = Math.floor(safe % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function detailMarkup() {
  return `
    <section class="porcelain-stage is-gated" data-porcelain-stage aria-label="歌曲驱动的自动青花瓷生成体验">
      <audio data-porcelain-audio src="${audioUrl}" preload="metadata"></audio>
      <div class="porcelain-vessel-safe" data-porcelain-vessel-safe aria-hidden="true"></div>
      <div class="porcelain-stamp-safe" data-porcelain-stamp-safe aria-hidden="true"></div>
      <header class="porcelain-meta">
        <span data-porcelain-duration-label>AUTOMATIC PORCELAIN / --:--</span>
        <strong>瓷韵绘音</strong>
        <small>歌曲自绘 · 一曲成瓷</small>
      </header>
      <div class="porcelain-readout" aria-live="polite">
        <span data-porcelain-status>LOADING SCORE</span>
        <strong data-porcelain-progress>00%</strong>
        <small data-porcelain-time>0:00 / --:--</small>
      </div>
      <ol class="porcelain-map" aria-label="青花生成章节">
        ${sectionMeta.map(([label, title], index) => `
          <li class="${index === 0 ? "is-active" : ""}" data-porcelain-section="${index}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${label}</strong>
            <small>${title}</small>
          </li>`).join("")}
      </ol>
      <div class="porcelain-caption">
        <span data-porcelain-motif>肩饰</span>
        <strong data-porcelain-title>序 · 素胚初醒</strong>
        <small data-porcelain-note>乐句将沿瓷面自动落笔</small>
      </div>
      <div class="porcelain-track" aria-hidden="true"><i data-porcelain-track></i></div>
      <div class="porcelain-gate" data-porcelain-gate>
        <span>NO TOUCH DRAWING</span>
        <p>一曲入瓷，青花自成</p>
        <button type="button" data-porcelain-start disabled>启封此曲</button>
        <small data-porcelain-gate-status>正在加载谱面</small>
      </div>
      <div class="porcelain-stamp" data-porcelain-stamp hidden>
        <span>BASE SEAL / FINAL GESTURE</span>
        <p>曲终，器成。长按落印。</p>
        <button type="button" data-porcelain-stamp-button style="--stamp-progress:0">
          <i></i><strong>长按落印</strong>
        </button>
        <small>8 秒后自动落款</small>
      </div>
      <div class="porcelain-result" data-porcelain-result hidden>
        <span>ONE SONG · ONE PORCELAIN</span>
        <p>一曲成瓷</p>
        <strong>青花长卷已完整显现</strong>
        <div>
          <button type="button" data-porcelain-export>下载我的青花瓷</button>
          <span data-porcelain-export-status></span>
        </div>
      </div>
      <footer class="porcelain-credit">
        <a href="https://github.com/mrdoob/three.js" target="_blank" rel="noreferrer">THREE.JS / LATHE + CANVAS TEXTURE</a>
        <span>MUSIC / USER PROVIDED AUDIO</span>
      </footer>
    </section>`;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Unable to export canvas."));
    }, "image/png");
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function drawResultPoster(sourceCanvas, durationText = "--:--") {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  const background = ctx.createLinearGradient(0, 0, 1400, 900);
  background.addColorStop(0, "#06141b");
  background.addColorStop(0.55, "#0b2837");
  background.addColorStop(1, "#0a1c27");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1400, 900);

  ctx.save();
  ctx.beginPath();
  ctx.rect(520, 70, 810, 760);
  ctx.clip();
  const sourceRatio = sourceCanvas.width / Math.max(1, sourceCanvas.height);
  const targetRatio = 810 / 760;
  let drawWidth = 810;
  let drawHeight = 760;
  if (sourceRatio > targetRatio) drawWidth = drawHeight * sourceRatio;
  else drawHeight = drawWidth / sourceRatio;
  ctx.drawImage(sourceCanvas, 925 - drawWidth / 2, 450 - drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
  ctx.strokeStyle = "rgba(185,221,235,.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(520, 70, 810, 760);

  ctx.fillStyle = "#d7edf5";
  ctx.font = '700 28px "Arial Narrow", Arial, sans-serif';
  ctx.fillText("FX LAB / AUTOMATIC PORCELAIN", 72, 92);
  ctx.fillStyle = "#f2f8fa";
  ctx.font = '700 92px "Songti SC", "STSong", serif';
  ctx.fillText("瓷韵绘音", 66, 238);
  ctx.fillStyle = "#78b8d5";
  ctx.font = '700 22px "Arial Narrow", Arial, sans-serif';
  ctx.fillText("ONE SONG · ONE PORCELAIN", 72, 292);
  ctx.fillStyle = "rgba(230,242,246,.72)";
  ctx.font = '600 30px "Songti SC", "STSong", serif';
  ctx.fillText("青花长卷完整显现", 72, 390);
  ctx.fillStyle = "rgba(230,242,246,.48)";
  ctx.font = '700 16px "Arial Narrow", Arial, sans-serif';
  ctx.fillText("REVEAL 100%", 72, 446);
  ctx.fillText(`DURATION ${durationText}`, 72, 478);
  ctx.fillText("BASE SEAL COMPLETE", 72, 510);
  ctx.strokeStyle = "#9d3d35";
  ctx.lineWidth = 6;
  ctx.strokeRect(72, 590, 116, 116);
  ctx.fillStyle = "#b34b41";
  ctx.font = '700 70px "Songti SC", "STSong", serif';
  ctx.textAlign = "center";
  ctx.fillText("韵", 130, 672);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(230,242,246,.38)";
  ctx.font = '700 13px "Arial Narrow", Arial, sans-serif';
  ctx.fillText("GENERATED LOCALLY IN YOUR BROWSER", 72, 800);
  return canvas;
}

function mountDetail({ root, instance }) {
  const stage = root.querySelector("[data-porcelain-stage]");
  if (!stage || !instance) return null;

  const audio = stage.querySelector("[data-porcelain-audio]");
  const startButton = stage.querySelector("[data-porcelain-start]");
  const gate = stage.querySelector("[data-porcelain-gate]");
  const gateStatus = stage.querySelector("[data-porcelain-gate-status]");
  const status = stage.querySelector("[data-porcelain-status]");
  const progressElement = stage.querySelector("[data-porcelain-progress]");
  const timeElement = stage.querySelector("[data-porcelain-time]");
  const durationLabel = stage.querySelector("[data-porcelain-duration-label]");
  const track = stage.querySelector("[data-porcelain-track]");
  const title = stage.querySelector("[data-porcelain-title]");
  const motif = stage.querySelector("[data-porcelain-motif]");
  const note = stage.querySelector("[data-porcelain-note]");
  const sectionItems = [...stage.querySelectorAll("[data-porcelain-section]")];
  const stampPanel = stage.querySelector("[data-porcelain-stamp]");
  const stampButton = stage.querySelector("[data-porcelain-stamp-button]");
  const resultPanel = stage.querySelector("[data-porcelain-result]");
  const exportButton = stage.querySelector("[data-porcelain-export]");
  const exportStatus = stage.querySelector("[data-porcelain-export-status]");
  let visualState = instance.interaction.custom;
  let chart = null;
  let audioContext = null;
  let mediaSource = null;
  let analyser = null;
  let spectrum = null;
  let animationFrame = 0;
  let running = false;
  let started = false;
  let paused = false;
  let previousTimeMs = 0;
  let previousEnergy = 0;
  let beatCooldownUntil = 0;
  let stampStartedAt = 0;
  let stampFrame = 0;
  let autoStampTimer = 0;
  let resultTimer = 0;
  let destroyed = false;
  let scoreReady = false;
  let metadataReady = Number.isFinite(audio.duration) && audio.duration > 0;
  let audioError = false;
  let starting = false;
  let resumeAfterVisibility = false;
  let pausedByVisibility = false;

  function currentVisualState() {
    visualState = instance.interaction.custom;
    return visualState;
  }

  function getDurationMs() {
    if (Number.isFinite(chart?.durationMs) && chart.durationMs > 0) return chart.durationMs;
    if (Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration * 1000;
    return 237200;
  }

  function durationText() {
    return formatTime(getDurationMs() / 1000);
  }

  function updateDurationCopy() {
    const formatted = durationText();
    durationLabel.textContent = `AUTOMATIC PORCELAIN / ${formatted}`;
    timeElement.textContent = `${formatTime(audio.currentTime)} / ${formatted}`;
  }

  function cancelUpdate() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function scheduleUpdate() {
    if (!animationFrame && running && !paused && !destroyed) animationFrame = requestAnimationFrame(update);
  }

  function updateReadiness() {
    const ready = scoreReady && metadataReady && !audioError && !starting;
    startButton.disabled = !ready;
    if (audioError) {
      gateStatus.textContent = "音频加载失败，请刷新后重试";
      status.textContent = "AUDIO UNAVAILABLE";
    } else if (!scoreReady) {
      gateStatus.textContent = "正在加载青花谱面";
      status.textContent = "LOADING SCORE";
    } else if (!metadataReady) {
      gateStatus.textContent = "正在读取音频信息";
      status.textContent = "LOADING AUDIO";
    } else if (!starting) {
      gateStatus.textContent = resumeAfterVisibility ? "点击继续当前乐章" : "无需触摸描绘 · 全程自动生成";
      status.textContent = resumeAfterVisibility ? "TAP TO RESUME" : "READY";
    }
  }

  function resetVisualState() {
    cancelUpdate();
    const state = currentVisualState();
    Object.assign(state, {
      detailActive: true,
      chart,
      playing: false,
      currentTimeMs: 0,
      progress: 0,
      chapterIndex: 0,
      chapterProgress: 0,
      musicLevel: 0,
      bass: 0,
      mids: 0,
      treble: 0,
      beatPulse: 0,
      completed: false,
      stamped: false,
      phase: "gated",
    });
    previousTimeMs = 0;
    previousEnergy = 0;
    stage.classList.remove("is-playing", "is-stamping", "is-complete");
    stage.classList.add("is-gated");
    gate.hidden = false;
    stampPanel.hidden = true;
    resultPanel.hidden = true;
    stampButton.style.setProperty("--stamp-progress", "0");
    status.textContent = scoreReady && metadataReady ? "READY" : "LOADING";
    progressElement.textContent = "00%";
    updateDurationCopy();
    track.style.transform = "scaleX(0)";
    paintSection(0, 0);
  }

  function paintSection(index, sectionProgress) {
    const section = chart?.sections?.[index];
    sectionItems.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
      item.classList.toggle("is-complete", itemIndex < index);
    });
    stage.dataset.chapter = String(index + 1);
    if (!section) return;
    title.textContent = section.title;
    motif.textContent = section.motif;
    note.textContent = sectionProgress > 0.88
      ? "收笔听息 · 瓷面即将转向"
      : `自动描绘 · ${section.label}`;
  }

  function ensureAudioGraph() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.68;
    spectrum = new Uint8Array(analyser.frequencyBinCount);
    mediaSource = audioContext.createMediaElementSource(audio);
    mediaSource.connect(analyser);
    analyser.connect(audioContext.destination);
  }

  function bandAverage(start, end) {
    if (!spectrum?.length) return 0;
    const safeStart = Math.max(0, Math.floor(start));
    const safeEnd = Math.min(spectrum.length, Math.max(safeStart + 1, Math.floor(end)));
    let total = 0;
    for (let index = safeStart; index < safeEnd; index += 1) total += spectrum[index];
    return total / (safeEnd - safeStart) / 255;
  }

  function crossedChartNode(currentTimeMs) {
    if (!chart || currentTimeMs < previousTimeMs) return false;
    return chart.sections.some((section) => section.strokes.some((stroke) => (stroke.nodes || []).some(
      (nodeTime) => nodeTime > previousTimeMs && nodeTime <= currentTimeMs,
    )));
  }

  function update(now) {
    animationFrame = 0;
    if (destroyed) return;
    const state = currentVisualState();
    if (running && !paused) {
      const currentTimeMs = audio.currentTime * 1000;
      const durationMs = getDurationMs();
      const progress = clamp(currentTimeMs / durationMs);
      const chapterIndex = Math.max(0, chart?.sections?.findIndex(
        (section) => currentTimeMs >= section.startMs && currentTimeMs < section.endMs,
      ) ?? 0);
      const section = chart?.sections?.[chapterIndex] || chart?.sections?.at(-1);
      const chapterProgress = section
        ? clamp((currentTimeMs - section.startMs) / Math.max(1, section.endMs - section.startMs))
        : progress;

      if (analyser) {
        analyser.getByteFrequencyData(spectrum);
        const bass = bandAverage(1, 12);
        const mids = bandAverage(12, 48);
        const treble = bandAverage(48, spectrum.length);
        const energy = bass * 0.46 + mids * 0.38 + treble * 0.16;
        state.bass += (bass - state.bass) * 0.34;
        state.mids += (mids - state.mids) * 0.3;
        state.treble += (treble - state.treble) * 0.28;
        state.musicLevel += (energy - state.musicLevel) * 0.3;
        const transient = energy > previousEnergy * 1.2 + 0.025 && now > beatCooldownUntil;
        if (transient || crossedChartNode(currentTimeMs)) {
          state.beatPulse = 1;
          beatCooldownUntil = now + 180;
        }
        previousEnergy += (energy - previousEnergy) * 0.12;
      }

      state.beatPulse *= 0.86;
      state.currentTimeMs = currentTimeMs;
      state.progress = progress;
      state.chapterIndex = chapterIndex;
      state.chapterProgress = chapterProgress;
      state.playing = true;
      progressElement.textContent = `${String(Math.floor(progress * 100)).padStart(2, "0")}%`;
      timeElement.textContent = `${formatTime(audio.currentTime)} / ${formatTime(durationMs / 1000)}`;
      track.style.transform = `scaleX(${progress})`;
      status.textContent = `PLAYING / ${String(chapterIndex + 1).padStart(2, "0")}`;
      paintSection(chapterIndex, chapterProgress);
      previousTimeMs = currentTimeMs;
    }
    scheduleUpdate();
  }

  async function start() {
    if (!scoreReady || !metadataReady || audioError || starting) return;
    const resuming = resumeAfterVisibility;
    starting = true;
    updateReadiness();
    gateStatus.textContent = resuming ? "正在继续当前乐章" : "正在唤醒音频与釉色";
    try {
      ensureAudioGraph();
      await audioContext.resume();
      if (!resuming) {
        audio.currentTime = 0;
        resetVisualState();
      }
      await audio.play();
      const state = currentVisualState();
      state.phase = "playing";
      state.playing = true;
      started = true;
      paused = false;
      pausedByVisibility = false;
      resumeAfterVisibility = false;
      running = true;
      gate.hidden = true;
      stage.classList.remove("is-gated");
      stage.classList.add("is-playing");
      status.textContent = `PLAYING / ${String((state.chapterIndex || 0) + 1).padStart(2, "0")}`;
      scheduleUpdate();
    } catch {
      cancelUpdate();
      audio.pause();
      running = false;
      paused = false;
      const state = currentVisualState();
      state.playing = false;
      state.phase = "gated";
      gate.hidden = false;
      stage.classList.remove("is-playing");
      stage.classList.add("is-gated");
      gateStatus.textContent = resuming ? "继续播放失败，请再次点击" : "音频启动失败，请再次启封";
    } finally {
      starting = false;
      startButton.disabled = !(scoreReady && metadataReady && !audioError);
    }
  }

  function showResult() {
    if (destroyed) return;
    const state = currentVisualState();
    state.phase = "result";
    stampPanel.hidden = true;
    resultPanel.hidden = false;
    stage.classList.remove("is-stamping");
    stage.classList.add("is-complete");
    status.textContent = "ONE SONG · ONE PORCELAIN";
  }

  function completeStamp(userTriggered = false) {
    if (currentVisualState().stamped) return;
    window.clearTimeout(autoStampTimer);
    cancelAnimationFrame(stampFrame);
    stampStartedAt = 0;
    stampButton.style.setProperty("--stamp-progress", "1");
    const state = currentVisualState();
    state.stamped = true;
    state.beatPulse = 1;
    stampButton.querySelector("strong").textContent = "落印完成";
    if (userTriggered) navigator.vibrate?.(20);
    resultTimer = window.setTimeout(showResult, 900);
  }

  function cancelStamp() {
    cancelAnimationFrame(stampFrame);
    stampStartedAt = 0;
    if (!currentVisualState().stamped) stampButton.style.setProperty("--stamp-progress", "0");
  }

  function advanceStamp(now) {
    if (!stampStartedAt || currentVisualState().stamped) return;
    const progress = clamp((now - stampStartedAt) / 500);
    stampButton.style.setProperty("--stamp-progress", String(progress));
    if (progress >= 1) completeStamp(true);
    else stampFrame = requestAnimationFrame(advanceStamp);
  }

  function beginStamp(event) {
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    stampStartedAt = performance.now();
    cancelAnimationFrame(stampFrame);
    stampFrame = requestAnimationFrame(advanceStamp);
  }

  function handleStampKeyboard(event) {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      completeStamp(true);
    }
  }

  function finishSong() {
    running = false;
    cancelUpdate();
    const state = currentVisualState();
    state.currentTimeMs = getDurationMs();
    state.progress = 1;
    state.completed = true;
    state.playing = false;
    state.phase = "stamping";
    state.beatPulse = 1;
    progressElement.textContent = "100%";
    track.style.transform = "scaleX(1)";
    status.textContent = "COMPLETE / BASE SEAL";
    note.textContent = "曲终，器成。请为作品留下最后一印。";
    sectionItems.forEach((item) => item.classList.add("is-complete"));
    stage.classList.remove("is-playing");
    stage.classList.add("is-stamping");
    stampPanel.hidden = false;
    resultPanel.hidden = true;
    autoStampTimer = window.setTimeout(completeStamp, 8000);
  }

  async function exportResult() {
    exportButton.disabled = true;
    exportStatus.textContent = "正在生成作品卡";
    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const poster = drawResultPoster(instance.canvas, durationText());
      const blob = await canvasToBlob(poster);
      downloadBlob(blob, "瓷韵绘音-一曲成瓷.png");
      exportStatus.textContent = "作品卡已下载";
    } catch {
      exportStatus.textContent = "生成失败，请重试";
    } finally {
      exportButton.disabled = false;
    }
  }

  const onStart = () => start();
  const onEnded = () => finishSong();
  const onLoadedMetadata = () => {
    metadataReady = Number.isFinite(audio.duration) && audio.duration > 0;
    audioError = false;
    updateDurationCopy();
    updateReadiness();
  };
  const onAudioError = () => {
    audioError = true;
    metadataReady = false;
    running = false;
    cancelUpdate();
    updateReadiness();
  };
  const onWaiting = () => {
    if (running) status.textContent = "BUFFERING";
  };
  const onPlaying = () => {
    if (running) status.textContent = `PLAYING / ${String((currentVisualState().chapterIndex || 0) + 1).padStart(2, "0")}`;
  };
  const pauseForVisibility = () => {
    if (!running || paused || currentVisualState().completed) return;
    pausedByVisibility = true;
    resumeAfterVisibility = true;
    running = false;
    audio.pause();
    cancelUpdate();
    cancelStamp();
    currentVisualState().playing = false;
  };
  const onVisibilityChange = () => {
    if (document.hidden) {
      pauseForVisibility();
      return;
    }
    if (!pausedByVisibility) return;
    gate.hidden = false;
    stage.classList.remove("is-playing");
    stage.classList.add("is-gated");
    updateReadiness();
  };
  const onPageHide = () => pauseForVisibility();
  const onStampDown = (event) => beginStamp(event);
  const onStampUp = () => cancelStamp();
  const onStampLostCapture = () => cancelStamp();
  const onStampContextMenu = (event) => event.preventDefault();
  const onStampKey = (event) => handleStampKeyboard(event);
  const onExport = () => exportResult();

  startButton.addEventListener("click", onStart);
  audio.addEventListener("ended", onEnded);
  audio.addEventListener("loadedmetadata", onLoadedMetadata);
  audio.addEventListener("canplay", onLoadedMetadata);
  audio.addEventListener("error", onAudioError);
  audio.addEventListener("waiting", onWaiting);
  audio.addEventListener("stalled", onWaiting);
  audio.addEventListener("playing", onPlaying);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);
  stampButton.addEventListener("pointerdown", onStampDown);
  stampButton.addEventListener("pointerup", onStampUp);
  stampButton.addEventListener("pointercancel", onStampUp);
  stampButton.addEventListener("lostpointercapture", onStampLostCapture);
  stampButton.addEventListener("contextmenu", onStampContextMenu);
  stampButton.addEventListener("keydown", onStampKey);
  exportButton.addEventListener("click", onExport);

  currentVisualState().detailActive = true;
  resetVisualState();
  updateReadiness();
  if (metadataReady) onLoadedMetadata();

  fetch(scoreUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Score request failed: ${response.status}`);
      return response.json();
    })
    .then((loadedChart) => {
      if (destroyed || !loadedChart?.sections?.length) return;
      chart = loadedChart;
      scoreReady = chart.sections.every((section, index) => (
        Number.isFinite(section.startMs)
        && Number.isFinite(section.endMs)
        && section.endMs > section.startMs
        && (!index || section.startMs >= chart.sections[index - 1].endMs)
        && section.patternGroup
      ));
      if (!scoreReady) throw new Error("Invalid porcelain score structure.");
      const state = currentVisualState();
      state.chart = chart;
      updateDurationCopy();
      updateReadiness();
      paintSection(0, 0);
    })
    .catch(() => {
      scoreReady = false;
      startButton.disabled = true;
      gateStatus.textContent = "谱面加载失败，请刷新重试";
      status.textContent = "SCORE UNAVAILABLE";
    });

  return {
    setPaused(nextPaused) {
      paused = nextPaused;
      if (!started || currentVisualState().completed) return;
      if (paused) {
        running = false;
        audio.pause();
        cancelUpdate();
        currentVisualState().playing = false;
        status.textContent = "PAUSED";
      } else {
        audioContext?.resume?.().catch(() => {});
        audio.play().then(() => {
          if (destroyed || paused) return;
          running = true;
          currentVisualState().playing = true;
          status.textContent = `PLAYING / ${String((currentVisualState().chapterIndex || 0) + 1).padStart(2, "0")}`;
          scheduleUpdate();
        }).catch(() => {
          running = false;
          paused = true;
          currentVisualState().playing = false;
          status.textContent = "TAP PLAY TO RESUME";
        });
      }
    },
    replay() {
      window.clearTimeout(autoStampTimer);
      window.clearTimeout(resultTimer);
      cancelStamp();
      cancelUpdate();
      audio.pause();
      audio.currentTime = 0;
      resumeAfterVisibility = false;
      pausedByVisibility = false;
      running = false;
      resetVisualState();
      if (started && scoreReady && metadataReady) {
        audioContext?.resume?.().catch(() => {});
        audio.play().then(() => {
          if (destroyed) return;
          const state = currentVisualState();
          state.phase = "playing";
          state.playing = true;
          running = true;
          paused = false;
          gate.hidden = true;
          stage.classList.remove("is-gated");
          stage.classList.add("is-playing");
          scheduleUpdate();
        }).catch(() => {
          running = false;
          paused = false;
          gate.hidden = false;
          stage.classList.remove("is-playing");
          stage.classList.add("is-gated");
          gateStatus.textContent = "重播启动失败，请再次启封";
        });
      }
    },
    destroy() {
      destroyed = true;
      running = false;
      cancelUpdate();
      cancelStamp();
      window.clearTimeout(autoStampTimer);
      window.clearTimeout(resultTimer);
      audio.pause();
      if (audioContext && audioContext.state !== "closed") audioContext.close().catch(() => {});
      startButton.removeEventListener("click", onStart);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onLoadedMetadata);
      audio.removeEventListener("error", onAudioError);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("stalled", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      stampButton.removeEventListener("pointerdown", onStampDown);
      stampButton.removeEventListener("pointerup", onStampUp);
      stampButton.removeEventListener("pointercancel", onStampUp);
      stampButton.removeEventListener("lostpointercapture", onStampLostCapture);
      stampButton.removeEventListener("contextmenu", onStampContextMenu);
      stampButton.removeEventListener("keydown", onStampKey);
      exportButton.removeEventListener("click", onExport);
      mediaSource = null;
      analyser = null;
    },
  };
}

export default defineEffectComponent({
  id: "porcelain-song-reveal",
  category: "music",
  createRenderer,
  createState: () => ({
    detailActive: false,
    chart: null,
    playing: false,
    currentTimeMs: 0,
    progress: 0,
    chapterIndex: 0,
    chapterProgress: 0,
    musicLevel: 0,
    bass: 0,
    mids: 0,
    treble: 0,
    beatPulse: 0,
    completed: false,
    stamped: false,
    phase: "idle",
  }),
  detailMarkup,
  mountDetail,
  card: {
    index: "M-09",
    title: "瓷韵绘音",
    subtitle: "AUTO SCORE / 3D PORCELAIN",
    summary: "歌曲作为唯一时钟，青花路径无需触摸便会在旋转瓷瓶上逐笔显现；章节自动转面，曲终落印并导出作品卡。",
    lyric: "一曲入瓷，青花自成",
    lyricAuthor: "FX LAB",
    lyricWork: "自动青花生成实验",
    track: "237.2 SEC / AUTOMATIC",
    audio: { src: audioUrl, format: "MP3", duration: 237.2 },
    sourceName: "Three.js / User Audio",
    sourceUrl: "https://github.com/mrdoob/three.js",
    license: "USER PROVIDED AUDIO + MIT",
    status: "AUTOMATIC SCORE",
    interaction: "点击启封后无需触摸绘制；歌曲谱面自动推进青花长卷，曲终仅需长按完成瓶底落印。",
    notes: "程序化 LatheGeometry 瓷瓶、CanvasTexture 青花长卷与 JSON 路径谱面均为本案例实现；当前配乐由用户提供，公开部署前需确认相应的使用与传播授权。",
  },
});
