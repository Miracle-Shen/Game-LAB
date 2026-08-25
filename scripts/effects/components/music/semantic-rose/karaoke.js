const BPM = 297.5;
const BEAT_SECONDS = 60 / (BPM * 4);
const AUDIO_LEAD_IN = 0.75;
const CLIP_END_BEAT = 368;
const BASE_MIDI = 60;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderKaraokeDetail({ audioUrl }) {
  return `
    <section class="sing-console" data-sing-console aria-label="实时演唱舞台">
      <div class="sing-song-meta">
        <span>LIVE KARAOKE / 20 SEC</span>
        <strong>ON THE RUN</strong>
        <small>JOSHUA MORIN</small>
      </div>
      <div class="sing-score" aria-label="演唱准确率">
        <span>ACCURACY</span>
        <strong data-sing-score>--</strong>
      </div>
      <div class="sing-mode" role="group" aria-label="演唱显示模式">
        <button type="button" data-sing-mode="normal" aria-pressed="true">音高谱</button>
        <button type="button" data-sing-mode="heart" aria-pressed="false">心形</button>
      </div>
      <div class="sing-lyrics" data-sing-lyrics aria-live="off"></div>
      <div class="sing-performance">
        <div class="sing-readout">
          <span data-sing-state>READY</span>
          <strong data-sing-pitch>--</strong>
          <span data-sing-target>TARGET --</span>
          <i><b data-sing-level></b></i>
        </div>
        <canvas class="sing-pitch-lane" data-sing-pitch-lane aria-label="目标音符与实时演唱音高"></canvas>
      </div>
      <div class="sing-gate" data-sing-gate>
        <p>ON THE RUN · VERSE 01</p>
        <div>
          <button type="button" data-sing-start>开始演唱</button>
          <button type="button" data-sing-preview>试听</button>
        </div>
        <span data-sing-gate-status>MICROPHONE + PITCH TRACKING</span>
      </div>
      <div class="sing-credit">
        <a href="https://performous.org/songs" target="_blank" rel="noreferrer">SONG PACK / PERFORMOUS</a>
        <a href="https://github.com/monteslu/loukai" target="_blank" rel="noreferrer">MIC FLOW / LOUKAI</a>
        <a href="https://github.com/UltraStar-Deluxe/USDX" target="_blank" rel="noreferrer">NOTE FEEDBACK / USDX</a>
      </div>
      <audio data-sing-audio src="${escapeHtml(audioUrl)}" preload="auto"></audio>
    </section>`;
}

function parseChart(source) {
  let lineIndex = 0;
  const notes = [];

  source.split(/\r?\n/).forEach((row) => {
    if (row.startsWith("-")) {
      lineIndex += 1;
      return;
    }
    const match = row.match(/^[:*F]\s+(\d+)\s+(\d+)\s+(-?\d+)\s?(.*)$/);
    if (!match) return;
    const beat = Number(match[1]);
    if (beat >= CLIP_END_BEAT) return;
    notes.push({
      start: AUDIO_LEAD_IN + beat * BEAT_SECONDS,
      end: AUDIO_LEAD_IN + (beat + Number(match[2])) * BEAT_SECONDS,
      midi: BASE_MIDI + Number(match[3]),
      text: beat === 222 ? "-one," : match[4],
      line: lineIndex,
      golden: row.startsWith("*"),
    });
  });

  const lines = [];
  const totalVocalDuration = notes.reduce((total, note) => total + note.end - note.start, 0);
  let heartCursor = 0;
  notes.forEach((note) => {
    if (!lines[note.line]) lines[note.line] = [];
    lines[note.line].push(note);
    const duration = note.end - note.start;
    note.heartStart = heartCursor / totalVocalDuration;
    heartCursor += duration;
    note.heartEnd = heartCursor / totalVocalDuration;
  });
  return { notes, lines: lines.filter(Boolean) };
}

function midiFromFrequency(frequency) {
  return 69 + 12 * Math.log2(frequency / 440);
}

function noteName(midi) {
  if (!Number.isFinite(midi)) return "--";
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const rounded = Math.round(midi);
  return `${names[((rounded % 12) + 12) % 12]}${Math.floor(rounded / 12) - 1}`;
}

// Normalized autocorrelation follows the real-time microphone analysis pattern used by Loukai.
function detectPitch(buffer, sampleRate) {
  let energy = 0;
  for (let i = 0; i < buffer.length; i += 1) energy += buffer[i] * buffer[i];
  const rms = Math.sqrt(energy / buffer.length);
  if (rms < 0.012) return { frequency: 0, rms };

  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.min(Math.floor(sampleRate / 70), buffer.length >> 1);
  let bestLag = 0;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let numerator = 0;
    let leftEnergy = 0;
    let rightEnergy = 0;
    const limit = buffer.length - lag;
    for (let i = 0; i < limit; i += 1) {
      const left = buffer[i];
      const right = buffer[i + lag];
      numerator += left * right;
      leftEnergy += left * left;
      rightEnergy += right * right;
    }
    const correlation = numerator / Math.sqrt(leftEnergy * rightEnergy || 1);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  return {
    frequency: bestCorrelation > 0.72 && bestLag ? sampleRate / bestLag : 0,
    rms,
  };
}

function nearestTargetOctave(midi, target) {
  if (!Number.isFinite(midi) || !Number.isFinite(target)) return midi;
  let adjusted = midi;
  while (adjusted - target > 6) adjusted -= 12;
  while (target - adjusted > 6) adjusted += 12;
  return adjusted;
}

function buildLyrics(container, lines) {
  const fragment = document.createDocumentFragment();
  lines.forEach((line, lineIndex) => {
    const paragraph = document.createElement("p");
    paragraph.dataset.line = String(lineIndex);
    line.forEach((note, noteIndex) => {
      const syllable = document.createElement("span");
      syllable.dataset.note = String(noteIndex);
      syllable.textContent = note.text || "~";
      paragraph.append(syllable);
    });
    fragment.append(paragraph);
  });
  container.replaceChildren(fragment);
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width: rect.width, height: rect.height, dpr };
}

function drawPitchLane(canvas, chart, time, history, activeNote, accuracy) {
  const { width, height, dpr } = resizeCanvas(canvas);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const anchorX = width * 0.27;
  const pixelsPerSecond = Math.max(58, width * 0.12);
  const minMidi = 58;
  const maxMidi = 82;
  const pitchY = (midi) => height - 16 - ((midi - minMidi) / (maxMidi - minMidi)) * (height - 32);

  ctx.strokeStyle = "rgba(255,255,255,.11)";
  ctx.lineWidth = 1;
  [60, 64, 67, 72, 76, 79].forEach((midi) => {
    const y = pitchY(midi);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  });

  chart.notes.forEach((note) => {
    if (note.end < time - 3 || note.start > time + 7) return;
    const x = anchorX + (note.start - time) * pixelsPerSecond;
    const noteWidth = Math.max(7, (note.end - note.start) * pixelsPerSecond - 2);
    const y = pitchY(note.midi) - 3;
    const isActive = note === activeNote;
    ctx.fillStyle = isActive
      ? `rgba(${Math.round(255 - accuracy * 118)},${Math.round(167 + accuracy * 88)},${Math.round(87 + accuracy * 126)},.95)`
      : note.golden ? "rgba(255,196,92,.78)" : "rgba(255,255,255,.32)";
    ctx.fillRect(x, y, noteWidth, isActive ? 7 : 5);
  });

  const recent = history.filter((point) => time - point.time < 3.2);
  if (recent.length > 1) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(103,255,205,.92)";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(63,255,194,.6)";
    ctx.beginPath();
    recent.forEach((point, index) => {
      const x = anchorX + (point.time - time) * pixelsPerSecond;
      const y = pitchY(point.midi);
      index ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.strokeStyle = "rgba(255,255,255,.72)";
  ctx.beginPath();
  ctx.moveTo(anchorX, 0);
  ctx.lineTo(anchorX, height);
  ctx.stroke();
}

function heartCoordinates(progress) {
  const angle = clamp(progress, 0, 1) * Math.PI * 2;
  const sin = Math.sin(angle);
  return {
    x: 16 * sin * sin * sin,
    y: 13 * Math.cos(angle)
      - 5 * Math.cos(angle * 2)
      - 2 * Math.cos(angle * 3)
      - Math.cos(angle * 4),
  };
}

function heartPoint(progress, centerX, centerY, scale, offset = 0) {
  const point = heartCoordinates(progress);
  const before = heartCoordinates(Math.max(0, progress - 0.001));
  const after = heartCoordinates(Math.min(1, progress + 0.001));
  const x = centerX + (point.x / 18) * scale;
  const y = centerY - (point.y / 18) * scale;
  const dx = after.x - before.x;
  const dy = -(after.y - before.y);
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: x + (-dy / length) * offset,
    y: y + (dx / length) * offset,
  };
}

function traceHeartRange(ctx, centerX, centerY, scale, start = 0, end = 1) {
  const span = Math.max(0.002, end - start);
  const steps = Math.max(8, Math.ceil(180 * span));
  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const point = heartPoint(start + (i / steps) * span, centerX, centerY, scale);
    i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y);
  }
}

function traceHeart(ctx, centerX, centerY, scale, progress = 1) {
  traceHeartRange(ctx, centerX, centerY, scale, 0, progress);
}

function heartGrade(score) {
  if (!Number.isFinite(score)) return "TARGET HEART";
  if (score >= 90) return "CRYSTAL HEART";
  if (score >= 75) return "RADIANT HEART";
  if (score >= 55) return "WILD HEART";
  return "FRAGILE HEART";
}

function drawHeartLane(canvas, heartHistory, progress, score, completed, now, activeNote, currentPitch) {
  const { width, height, dpr } = resizeCanvas(canvas);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const centerX = width * 0.52;
  const centerY = height * 0.49;
  const scale = Math.min(width * 0.38, height * 0.43);
  const quality = Number.isFinite(score) ? clamp(score / 100, 0, 1) : completed ? 0.82 : 0;
  const breathe = 1 + Math.sin(now * 0.0022) * (completed ? 0.018 : 0.008);

  if (completed) {
    const echoPhase = (now * 0.00022) % 1;
    for (let ring = 0; ring < 3; ring += 1) {
      const phase = (echoPhase + ring / 3) % 1;
      ctx.save();
      ctx.lineWidth = 1.5 + (1 - phase) * 2;
      ctx.strokeStyle = `rgba(${ring === 1 ? "103,255,205" : "255,91,151"},${(1 - phase) * (0.2 + quality * 0.24)})`;
      ctx.shadowBlur = 18;
      ctx.shadowColor = ring === 1 ? "rgba(103,255,205,.46)" : "rgba(255,91,151,.48)";
      traceHeart(ctx, centerX, centerY, scale * (breathe + phase * 0.14));
      ctx.stroke();
      ctx.restore();
    }

    const fill = ctx.createRadialGradient(centerX, centerY * 0.94, 0, centerX, centerY, scale * 1.18);
    fill.addColorStop(0, `rgba(255,244,215,${0.14 + quality * 0.24})`);
    fill.addColorStop(0.34, `rgba(255,93,151,${0.11 + quality * 0.2})`);
    fill.addColorStop(1, "rgba(76,18,52,0)");
    traceHeart(ctx, centerX, centerY, scale * breathe);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.save();
    traceHeart(ctx, centerX, centerY, scale * breathe);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 22; i += 1) {
      const point = heartPoint((i + 0.5) / 22, centerX, centerY, scale * breathe);
      ctx.strokeStyle = i % 3 === 0
        ? `rgba(112,255,216,${0.035 + quality * 0.055})`
        : `rgba(255,132,176,${0.035 + quality * 0.06})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + scale * 0.06);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(255,181,112,.07)";
  traceHeart(ctx, centerX, centerY, scale);
  ctx.stroke();
  ctx.lineWidth = 1.7;
  ctx.strokeStyle = "rgba(255,235,210,.42)";
  ctx.shadowBlur = 8;
  ctx.shadowColor = "rgba(255,122,166,.42)";
  traceHeart(ctx, centerX, centerY, scale);
  ctx.stroke();
  ctx.restore();

  if (!completed && activeNote) {
    const guideStart = Math.max(activeNote.heartStart, progress - 0.006);
    const guideEnd = Math.min(activeNote.heartEnd, Math.max(progress + 0.018, activeNote.heartEnd));
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(255,209,123,.94)";
    ctx.shadowBlur = 24;
    ctx.shadowColor = "rgba(255,92,151,.9)";
    traceHeartRange(ctx, centerX, centerY, scale, guideStart, guideEnd);
    ctx.stroke();
    ctx.restore();
  }

  if (!heartHistory.length) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,157,99,.78)";
    ctx.shadowBlur = 18;
    ctx.shadowColor = "rgba(255,90,139,.64)";
    traceHeart(ctx, centerX, centerY, scale, clamp(progress, 0.002, 1));
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 1; i < heartHistory.length; i += 1) {
      const previous = heartHistory[i - 1];
      const current = heartHistory[i];
      if (!previous.voiced || !current.voiced || current.progress - previous.progress > 0.035) continue;
      const from = heartPoint(previous.progress, centerX, centerY, scale, previous.error * scale * 0.022);
      const to = heartPoint(current.progress, centerX, centerY, scale, current.error * scale * 0.022);
      const accuracy = (previous.accuracy + current.accuracy) * 0.5;
      const red = Math.round(255 - accuracy * 112);
      const green = Math.round(104 + accuracy * 151);
      const blue = Math.round(126 + accuracy * 87);
      ctx.strokeStyle = `rgba(${red},${green},${blue},${0.18 + accuracy * 0.16})`;
      ctx.lineWidth = 8 + accuracy * 6;
      ctx.shadowBlur = 8 + accuracy * 18;
      ctx.shadowColor = `rgba(${red},${green},${blue},.74)`;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${red},${green},${blue},${0.78 + accuracy * 0.22})`;
      ctx.lineWidth = 2 + accuracy * 3.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  const cursorPoint = heartPoint(clamp(progress, 0, 1), centerX, centerY, scale);
  if (!completed) {
    ctx.fillStyle = "rgba(255,206,125,.2)";
    ctx.beginPath();
    ctx.arc(cursorPoint.x, cursorPoint.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff9e8";
    ctx.shadowBlur = 26;
    ctx.shadowColor = "rgba(255,105,154,1)";
    ctx.beginPath();
    ctx.arc(cursorPoint.x, cursorPoint.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (activeNote) {
      const cents = Number.isFinite(currentPitch) && currentPitch > 0
        ? Math.round((currentPitch - activeNote.midi) * 100)
        : null;
      ctx.fillStyle = "rgba(255,255,255,.92)";
      ctx.font = "700 11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`TARGET ${noteName(activeNote.midi)}`, cursorPoint.x, cursorPoint.y - 24);
      if (cents !== null) {
        ctx.fillStyle = Math.abs(cents) <= 50 ? "rgba(111,255,211,.95)" : "rgba(255,164,119,.94)";
        ctx.font = "700 9px Arial";
        ctx.fillText(`${cents > 0 ? "+" : ""}${cents} CENT`, cursorPoint.x, cursorPoint.y + 25);
      }
    }
  }

  if (completed) {
    const corePulse = 0.78 + Math.sin(now * 0.004) * 0.16;
    const core = ctx.createRadialGradient(centerX, centerY + scale * 0.02, 0, centerX, centerY + scale * 0.02, scale * 0.32);
    core.addColorStop(0, `rgba(255,251,226,${0.42 * corePulse})`);
    core.addColorStop(0.18, `rgba(255,103,166,${0.26 * corePulse})`);
    core.addColorStop(1, "rgba(255,65,139,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(centerX, centerY + scale * 0.02, scale * 0.32, 0, Math.PI * 2);
    ctx.fill();

    const particles = Math.round(30 + quality * 58);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles; i += 1) {
      const particleProgress = (i / particles + now * (0.000012 + (i % 3) * 0.000004)) % 1;
      const point = heartPoint(particleProgress, centerX, centerY, scale * breathe, Math.sin(now * 0.002 + i) * 5);
      const alpha = 0.28 + quality * 0.68;
      ctx.fillStyle = i % 3 === 0 ? `rgba(255,220,151,${alpha})` : `rgba(111,255,211,${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 0.9 + quality * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    [0.08, 0.28, 0.52, 0.76].forEach((pointProgress, index) => {
      const point = heartPoint(pointProgress, centerX, centerY, scale * breathe);
      const flare = 5 + quality * 8 + Math.sin(now * 0.004 + index) * 2;
      ctx.strokeStyle = `rgba(255,244,202,${0.36 + quality * 0.38})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point.x - flare, point.y);
      ctx.lineTo(point.x + flare, point.y);
      ctx.moveTo(point.x, point.y - flare);
      ctx.lineTo(point.x, point.y + flare);
      ctx.stroke();
    });
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.font = "700 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(heartGrade(score), centerX, centerY + scale * 0.15);
    if (Number.isFinite(score)) {
      ctx.fillStyle = "rgba(255,255,255,.48)";
      ctx.font = "700 9px Arial";
      ctx.fillText(`${score} / 100`, centerX, centerY + scale * 0.15 + 18);
    }
  }
}

export function mountKaraoke({ root, instance, chartUrl }) {
  const stage = root.querySelector("[data-sing-console]");
  if (!stage || !instance) return null;

  const audio = stage.querySelector("[data-sing-audio]");
  const lyricContainer = stage.querySelector("[data-sing-lyrics]");
  const lane = stage.querySelector("[data-sing-pitch-lane]");
  const scoreElement = stage.querySelector("[data-sing-score]");
  const pitchElement = stage.querySelector("[data-sing-pitch]");
  const targetElement = stage.querySelector("[data-sing-target]");
  const stateElement = stage.querySelector("[data-sing-state]");
  const levelElement = stage.querySelector("[data-sing-level]");
  const gate = stage.querySelector("[data-sing-gate]");
  const gateStatus = stage.querySelector("[data-sing-gate-status]");
  const startButton = stage.querySelector("[data-sing-start]");
  const previewButton = stage.querySelector("[data-sing-preview]");
  const modeButtons = [...stage.querySelectorAll("[data-sing-mode]")];
  let visualState = instance.interaction.custom;

  let chart = { notes: [], lines: [] };
  let audioContext = null;
  let mediaSource = null;
  let musicAnalyser = null;
  let micAnalyser = null;
  let micStream = null;
  let micBuffer = null;
  let musicBuffer = null;
  let animationFrame = 0;
  let lastPitchCheck = 0;
  let activeLine = -1;
  let activeNote = null;
  let guideNote = null;
  let running = false;
  let completed = false;
  let mode = "normal";
  let micEnabled = false;
  let eligibleSamples = 0;
  let accuracyTotal = 0;
  let currentPitchMidi = 0;
  let heartProgress = 0;
  const pitchHistory = [];
  const heartHistory = [];

  fetch(chartUrl)
    .then((response) => response.text())
    .then((source) => {
      chart = parseChart(source);
      buildLyrics(lyricContainer, chart.lines);
      paintLane(performance.now());
    })
    .catch(() => {
      gateStatus.textContent = "CHART UNAVAILABLE";
    });

  function ensureAudioGraph() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    musicAnalyser = audioContext.createAnalyser();
    musicAnalyser.fftSize = 256;
    musicBuffer = new Uint8Array(musicAnalyser.frequencyBinCount);
    mediaSource = audioContext.createMediaElementSource(audio);
    mediaSource.connect(musicAnalyser);
    musicAnalyser.connect(audioContext.destination);
  }

  async function enableMicrophone() {
    if (micEnabled) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
    });
    const micSource = audioContext.createMediaStreamSource(micStream);
    micAnalyser = audioContext.createAnalyser();
    micAnalyser.fftSize = 2048;
    micAnalyser.smoothingTimeConstant = 0.15;
    micBuffer = new Float32Array(micAnalyser.fftSize);
    micSource.connect(micAnalyser);
    micEnabled = true;
  }

  function resetPerformance() {
    eligibleSamples = 0;
    accuracyTotal = 0;
    activeLine = -1;
    activeNote = null;
    guideNote = null;
    pitchHistory.length = 0;
    heartHistory.length = 0;
    currentPitchMidi = 0;
    heartProgress = 0;
    completed = false;
    stage.classList.remove("is-complete");
    scoreElement.textContent = "--";
    pitchElement.textContent = "--";
    targetElement.textContent = "TARGET --";
    visualState.accuracy = 0;
    visualState.hitPulse = 0;
    visualState.lastHitNote = null;
    visualState.progress = 0;
    visualState.completed = false;
  }

  function performanceScore() {
    return eligibleSamples ? Math.round((accuracyTotal / eligibleSamples) * 100) : Number.NaN;
  }

  function paintLane(now) {
    if (mode === "heart") {
      drawHeartLane(
        lane,
        heartHistory,
        heartProgress,
        performanceScore(),
        completed,
        now,
        guideNote,
        currentPitchMidi,
      );
    } else {
      drawPitchLane(lane, chart, audio.currentTime, pitchHistory, activeNote, visualState.accuracy);
    }
  }

  function setMode(nextMode) {
    mode = nextMode === "heart" ? "heart" : "normal";
    stage.classList.toggle("is-heart-mode", mode === "heart");
    visualState.heartMode = mode === "heart";
    modeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.singMode === mode));
    });
    if (completed) {
      gate.hidden = mode === "heart";
      stateElement.textContent = "COMPLETE";
      if (mode === "heart") beginLoop();
    }
    paintLane(performance.now());
  }

  async function start(withMicrophone) {
    startButton.disabled = true;
    previewButton.disabled = true;
    gateStatus.textContent = "LOADING AUDIO";
    try {
      ensureAudioGraph();
      await audioContext.resume();
      audio.currentTime = 0;
      resetPerformance();
      visualState.heartMode = mode === "heart";
      stateElement.textContent = withMicrophone ? "CONNECTING" : "PLAYBACK";
      if (withMicrophone) {
        try {
          await enableMicrophone();
          stateElement.textContent = "LISTENING";
        } catch {
          stateElement.textContent = "MIC BLOCKED";
        }
      }
      await audio.play();
      running = true;
      visualState.playing = true;
      gate.hidden = true;
    } catch {
      gateStatus.textContent = "AUDIO UNAVAILABLE";
      startButton.disabled = false;
      previewButton.disabled = false;
    }
  }

  function updateLyrics(time, nextNote) {
    const nextLine = nextNote?.line ?? chart.lines.findIndex((line) => time < line.at(-1)?.end);
    if (nextLine !== activeLine && nextLine >= 0) {
      activeLine = nextLine;
      lyricContainer.querySelectorAll("p").forEach((line, index) => {
        line.classList.toggle("is-active", index === activeLine);
        line.classList.toggle("is-prev", index === activeLine - 1);
        line.classList.toggle("is-next", index === activeLine + 1);
      });
    }
    lyricContainer.querySelectorAll("p").forEach((line, lineIndex) => {
      line.querySelectorAll("span").forEach((syllable, noteIndex) => {
        const note = chart.lines[lineIndex]?.[noteIndex];
        syllable.classList.toggle("is-past", Boolean(note && time > note.end));
        syllable.classList.toggle("is-current", note === nextNote);
      });
    });
  }

  function update(now) {
    const time = audio.currentTime;
    activeNote = chart.notes.find((note) => time >= note.start && time <= note.end) || null;
    guideNote = activeNote || chart.notes.find((note) => note.start > time) || null;
    if (activeNote) {
      const noteProgress = clamp((time - activeNote.start) / Math.max(activeNote.end - activeNote.start, 0.001), 0, 1);
      heartProgress = activeNote.heartStart + (activeNote.heartEnd - activeNote.heartStart) * noteProgress;
    } else if (chart.notes.length && time > chart.notes.at(-1).end) {
      heartProgress = 1;
    }
    let pitchMidi = currentPitchMidi;
    let level = 0;
    let pitchSampled = false;

    if (musicAnalyser) {
      musicAnalyser.getByteFrequencyData(musicBuffer);
      const musicSum = musicBuffer.reduce((sum, value) => sum + value, 0);
      visualState.musicLevel = musicSum / musicBuffer.length / 255;
    }

    if (micAnalyser && now - lastPitchCheck > 70) {
      lastPitchCheck = now;
      pitchSampled = true;
      micAnalyser.getFloatTimeDomainData(micBuffer);
      const detected = detectPitch(micBuffer, audioContext.sampleRate);
      level = clamp(detected.rms * 8, 0, 1);
      visualState.micLevel += (level - visualState.micLevel) * 0.42;
      visualState.voiced = Boolean(detected.frequency);
      if (detected.frequency) {
        const rawMidi = midiFromFrequency(detected.frequency);
        pitchMidi = activeNote ? nearestTargetOctave(rawMidi, activeNote.midi) : rawMidi;
        currentPitchMidi = pitchMidi;
        visualState.pitch = pitchMidi;
        pitchHistory.push({ time, midi: pitchMidi });
      } else {
        pitchMidi = 0;
        currentPitchMidi = 0;
      }
    } else {
      level = visualState.micLevel || 0;
    }

    const firstRecent = pitchHistory.findIndex((point) => point.time >= time - 3.2);
    if (firstRecent > 0) pitchHistory.splice(0, firstRecent);
    else if (firstRecent < 0) pitchHistory.length = 0;

    let accuracy = 0;
    if (activeNote && visualState.voiced && pitchMidi) {
      const error = Math.abs(pitchMidi - activeNote.midi);
      accuracy = Math.exp(-error * error / 2.4);
      if (accuracy > 0.82 && activeNote !== visualState.lastHitNote) {
        visualState.hitPulse = 1;
        visualState.lastHitNote = activeNote;
      }
    }
    if (pitchSampled && activeNote) {
      eligibleSamples += 1;
      if (visualState.voiced && pitchMidi) {
        accuracyTotal += accuracy;
      }
      heartHistory.push({
        progress: heartProgress,
        error: visualState.voiced && pitchMidi ? clamp(pitchMidi - activeNote.midi, -5, 5) : 0,
        accuracy,
        voiced: Boolean(visualState.voiced && pitchMidi),
      });
    }
    visualState.accuracy += (accuracy - visualState.accuracy) * 0.3;
    visualState.targetPitch = activeNote?.midi || 0;
    visualState.progress = time / Math.max(audio.duration || 20.5, 1);

    const score = performanceScore();
    scoreElement.textContent = Number.isFinite(score) ? String(score).padStart(2, "0") : "--";
    pitchElement.textContent = pitchMidi ? noteName(pitchMidi) : micEnabled ? "LISTEN" : "--";
    targetElement.textContent = completed && mode === "heart"
      ? heartGrade(score)
      : guideNote ? `TARGET ${noteName(guideNote.midi)}` : "TARGET --";
    levelElement.style.transform = `scaleX(${clamp(level, 0.025, 1)})`;
    updateLyrics(time, activeNote);
    paintLane(now);

    if (running || (completed && mode === "heart")) animationFrame = requestAnimationFrame(update);
  }

  function beginLoop() {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(update);
  }

  const onStart = () => start(true).then(beginLoop);
  const onPreview = () => start(false).then(beginLoop);
  const onModeChange = (event) => setMode(event.currentTarget.dataset.singMode);
  const onEnded = () => {
    running = false;
    completed = true;
    stage.classList.add("is-complete");
    visualState.playing = false;
    visualState.completed = true;
    heartProgress = 1;
    const score = performanceScore();
    stateElement.textContent = "COMPLETE";
    gate.hidden = mode === "heart";
    gate.querySelector("p").textContent = "TAKE COMPLETE";
    gateStatus.textContent = Number.isFinite(score) ? `ACCURACY ${score}` : "PLAY AGAIN";
    startButton.textContent = "再唱一次";
    startButton.disabled = false;
    previewButton.disabled = false;
    if (mode === "heart") beginLoop();
  };

  startButton.addEventListener("click", onStart);
  previewButton.addEventListener("click", onPreview);
  modeButtons.forEach((button) => button.addEventListener("click", onModeChange));
  audio.addEventListener("ended", onEnded);

  return {
    setPaused(paused) {
      if (!running) return;
      if (paused) {
        audio.pause();
        stateElement.textContent = "PAUSED";
      } else {
        audio.play().catch(() => {});
        stateElement.textContent = micEnabled ? "LISTENING" : "PLAYBACK";
      }
    },
    replay() {
      if (!audioContext) return;
      visualState = instance.interaction.custom;
      audio.currentTime = 0;
      resetPerformance();
      visualState.heartMode = mode === "heart";
      running = true;
      visualState.playing = true;
      gate.hidden = true;
      audio.play().catch(() => {});
      beginLoop();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(animationFrame);
      audio.pause();
      micStream?.getTracks().forEach((track) => track.stop());
      audioContext?.close().catch(() => {});
      startButton.removeEventListener("click", onStart);
      previewButton.removeEventListener("click", onPreview);
      modeButtons.forEach((button) => button.removeEventListener("click", onModeChange));
      audio.removeEventListener("ended", onEnded);
    },
  };
}
