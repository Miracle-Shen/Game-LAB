import { fract, hash, TAU } from "../../../shared/canvas.js";

const BPM = 297.5;
const BEAT_SECONDS = 60 / (BPM * 4);
const AUDIO_LEAD_IN = 0.75;
const CLIP_END_BEAT = 368;
// This recording's relative UltraStar chart uses C3 as pitch 0.
const BASE_MIDI = 48;
const MAX_PITCH_ERROR = 4;
const IN_TUNE_SEMITONES = 0.5;
const PITCH_SAMPLE_GAP = 0.18;
const PITCH_DEBUG_INTERVAL = 350;
const PITCH_MIN_MIDI = 46;
const PITCH_MAX_MIDI = 70;
const PITCH_VERTICAL_PADDING = 16;
const MIN_PITCH_RMS = 0.004;
const MIN_PITCH_CORRELATION = 0.45;
const PITCH_FILTER_WINDOW = 3;
const PITCH_FILTER_RESET_MS = 280;
const PITCH_OCTAVE_MIN_JUMP = 7;
const PITCH_OCTAVE_MAX_ERROR = 3;
const PITCH_MAX_STEP = 1.6;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderKaraokeDetail({ backingAudioUrl, originalAudioUrl, icon }) {
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
        <canvas class="sing-pitch-lane" data-sing-pitch-lane aria-label="标准音高与实时演唱音高"></canvas>
      </div>
      <div class="sing-gate" id="sing-session-choice" data-sing-gate>
        <p>选择体验方式</p>
        <div>
          <button type="button" data-sing-start aria-pressed="false">开始演唱</button>
          <button type="button" data-sing-preview aria-pressed="false">原唱试听</button>
        </div>
        <span data-sing-gate-status>可随时从右上角重新选择</span>
      </div>
      <div class="sing-result-actions" data-sing-result-actions hidden>
        <button type="button" data-sing-export aria-label="保存或分享演唱结果">
          ${icon("share")}<span data-sing-export-label>保存 / 分享</span>
        </button>
        <span data-sing-export-status role="status" aria-live="polite"></span>
      </div>
      <div class="sing-credit">
        <a href="https://performous.org/songs" target="_blank" rel="noreferrer">SONG PACK / PERFORMOUS</a>
        <a href="https://github.com/monteslu/loukai" target="_blank" rel="noreferrer">MIC FLOW / LOUKAI</a>
        <a href="https://github.com/UltraStar-Deluxe/USDX" target="_blank" rel="noreferrer">NOTE FEEDBACK / USDX</a>
      </div>
      <audio
        data-sing-audio
        data-sing-backing-src="${escapeHtml(backingAudioUrl)}"
        data-sing-original-src="${escapeHtml(originalAudioUrl)}"
        src="${escapeHtml(backingAudioUrl)}"
        preload="auto"
      ></audio>
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
      id: notes.length,
      start: AUDIO_LEAD_IN + beat * BEAT_SECONDS,
      end: AUDIO_LEAD_IN + (beat + Number(match[2])) * BEAT_SECONDS,
      midi: BASE_MIDI + Number(match[3]),
      text: beat === 222 ? "-one," : match[4],
      line: lineIndex,
      golden: row.startsWith("*"),
    });
  });

  const lines = [];
  const timelineStart = notes[0]?.start || 0;
  const timelineEnd = notes.at(-1)?.end || timelineStart + 1;
  const timelineDuration = Math.max(timelineEnd - timelineStart, 0.001);
  notes.forEach((note) => {
    if (!lines[note.line]) lines[note.line] = [];
    lines[note.line].push(note);
    note.heartStart = clamp((note.start - timelineStart) / timelineDuration, 0, 1);
    note.heartEnd = clamp((note.end - timelineStart) / timelineDuration, 0, 1);
  });
  return {
    notes,
    lines: lines.filter(Boolean),
    timelineStart,
    timelineEnd,
    timelineDuration,
  };
}

function heartProgressAtTime(chart, time) {
  return clamp((time - chart.timelineStart) / Math.max(chart.timelineDuration, 0.001), 0, 1);
}

function targetMidiAtTime(chart, time) {
  let previous = null;
  let next = null;
  for (const note of chart.notes) {
    if (time >= note.start && time <= note.end) return note.midi;
    if (note.end < time) previous = note;
    if (note.start > time) {
      next = note;
      break;
    }
  }
  if (!previous) return next?.midi ?? null;
  if (!next) return previous.midi;
  const gapProgress = clamp((time - previous.end) / Math.max(next.start - previous.end, 0.001), 0, 1);
  const easedProgress = gapProgress * gapProgress * (3 - 2 * gapProgress);
  return previous.midi + (next.midi - previous.midi) * easedProgress;
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

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) * 0.5;
}

function foldLikelyOctaveError(midi, reference) {
  if (!Number.isFinite(reference)) return midi;
  const jump = midi - reference;
  if (Math.abs(jump) < PITCH_OCTAVE_MIN_JUMP) return midi;
  const folded = midi + Math.round((reference - midi) / 12) * 12;
  return Math.abs(folded - reference) <= PITCH_OCTAVE_MAX_ERROR ? folded : midi;
}

// Loukai smooths consecutive frequency estimates. This tracker applies the same
// idea in logarithmic MIDI space, with a median pre-filter for harmonic spikes.
export function createPitchStabilizer() {
  let filteredMidi = null;
  let lastSampleAt = Number.NEGATIVE_INFINITY;
  const recentMidi = [];

  return {
    update(rawMidi, confidence, now) {
      if (!Number.isFinite(rawMidi)) {
        if (now - lastSampleAt > PITCH_FILTER_RESET_MS) this.reset();
        return null;
      }

      const startsSegment = now - lastSampleAt > PITCH_FILTER_RESET_MS;
      if (startsSegment) {
        recentMidi.length = 0;
        filteredMidi = null;
      }

      const octaveStableMidi = foldLikelyOctaveError(rawMidi, filteredMidi);
      recentMidi.push(octaveStableMidi);
      if (recentMidi.length > PITCH_FILTER_WINDOW) recentMidi.shift();
      const medianMidi = median(recentMidi);

      if (!Number.isFinite(filteredMidi)) {
        filteredMidi = medianMidi;
      } else {
        const delta = medianMidi - filteredMidi;
        const confidenceWeight = clamp((confidence - MIN_PITCH_CORRELATION) / 0.4, 0, 1);
        const response = (Math.abs(delta) > 1.25 ? 0.56 : 0.3) * (0.78 + confidenceWeight * 0.22);
        filteredMidi += clamp(delta * response, -PITCH_MAX_STEP, PITCH_MAX_STEP);
      }
      lastSampleAt = now;
      return filteredMidi;
    },
    reset() {
      recentMidi.length = 0;
      filteredMidi = null;
      lastSampleAt = Number.NEGATIVE_INFINITY;
    },
  };
}

// Normalized autocorrelation follows the real-time microphone analysis pattern used by Loukai.
export function detectPitch(buffer, sampleRate) {
  let mean = 0;
  for (let i = 0; i < buffer.length; i += 1) mean += buffer[i];
  mean /= buffer.length;

  let energy = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    const sample = buffer[i] - mean;
    energy += sample * sample;
  }
  const rms = Math.sqrt(energy / buffer.length);
  if (rms < MIN_PITCH_RMS) return { frequency: 0, rms, confidence: 0 };

  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.min(Math.floor(sampleRate / 70), buffer.length >> 1);
  const correlations = new Float32Array(maxLag + 1);
  let bestLag = 0;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let numerator = 0;
    let leftEnergy = 0;
    let rightEnergy = 0;
    const limit = buffer.length - lag;
    for (let i = 0; i < limit; i += 1) {
      const left = buffer[i] - mean;
      const right = buffer[i + lag] - mean;
      numerator += left * right;
      leftEnergy += left * left;
      rightEnergy += right * right;
    }
    const correlation = numerator / Math.sqrt(leftEnergy * rightEnergy || 1);
    correlations[lag] = correlation;
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  if (bestCorrelation < MIN_PITCH_CORRELATION || !bestLag) {
    return { frequency: 0, rms, confidence: bestCorrelation };
  }

  // Harmonic periods can correlate as strongly as the fundamental. Prefer the first
  // trustworthy local peak so a high vocal note is not reported several octaves low.
  const peakThreshold = Math.max(MIN_PITCH_CORRELATION, bestCorrelation * 0.9);
  for (let lag = minLag + 1; lag < maxLag; lag += 1) {
    if (
      correlations[lag] >= peakThreshold
      && correlations[lag] >= correlations[lag - 1]
      && correlations[lag] > correlations[lag + 1]
    ) {
      bestLag = lag;
      bestCorrelation = correlations[lag];
      break;
    }
  }

  const left = correlations[bestLag - 1] || bestCorrelation;
  const right = correlations[bestLag + 1] || bestCorrelation;
  const curvature = 2 * bestCorrelation - left - right;
  const lagOffset = curvature > 0 ? clamp((right - left) / (2 * curvature), -0.5, 0.5) : 0;

  return {
    frequency: sampleRate / (bestLag + lagOffset),
    rms,
    confidence: bestCorrelation,
  };
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

function resizeCanvas(canvas, outputSize = null) {
  if (outputSize) {
    const width = Math.max(1, Math.round(outputSize.width));
    const height = Math.max(1, Math.round(outputSize.height));
    canvas.width = width;
    canvas.height = height;
    return { width, height, dpr: 1 };
  }
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

function pitchPixelsPerSemitone(height) {
  return Math.max(1, (height - PITCH_VERTICAL_PADDING * 2) / (PITCH_MAX_MIDI - PITCH_MIN_MIDI));
}

function drawPitchLane(canvas, chart, time, history, activeNote, accuracy, hasVoice) {
  const { width, height, dpr } = resizeCanvas(canvas);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const anchorX = width * 0.27;
  const pixelsPerSecond = Math.max(58, width * 0.12);
  const pitchScale = pitchPixelsPerSemitone(height);
  const pitchY = (midi) => height - PITCH_VERTICAL_PADDING - (midi - PITCH_MIN_MIDI) * pitchScale;

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
    const isActive = note === activeNote && hasVoice;
    ctx.fillStyle = isActive
      ? `rgba(${Math.round(255 - accuracy * 118)},${Math.round(167 + accuracy * 88)},${Math.round(87 + accuracy * 126)},.95)`
      : note.golden ? "rgba(255,196,92,.78)" : "rgba(255,255,255,.32)";
    ctx.fillRect(x, y, noteWidth, isActive ? 7 : 5);
  });

  const recent = history.filter((point) => time - point.time < 3.2);
  if (recent.some((point) => point.voiced)) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(103,255,205,.92)";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(63,255,194,.6)";
    const segments = [];
    let segment = [];
    recent.forEach((point) => {
      const previous = segment.at(-1);
      if (!point.voiced || !Number.isFinite(point.actualMidi) || (previous && point.time - previous.time > PITCH_SAMPLE_GAP)) {
        if (segment.length) segments.push(segment);
        segment = [];
      }
      if (point.voiced && Number.isFinite(point.actualMidi)) segment.push(point);
    });
    if (segment.length) segments.push(segment);

    segments.forEach((points) => {
      const canvasPoints = points.map((point) => ({
        x: anchorX + (point.time - time) * pixelsPerSecond,
        y: pitchY(point.actualMidi),
      }));
      ctx.beginPath();
      ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
      for (let index = 1; index < canvasPoints.length; index += 1) {
        const previous = canvasPoints[index - 1];
        const current = canvasPoints[index];
        const midX = (previous.x + current.x) * 0.5;
        const midY = (previous.y + current.y) * 0.5;
        ctx.quadraticCurveTo(previous.x, previous.y, midX, midY);
      }
      const last = canvasPoints.at(-1);
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
  }

  ctx.strokeStyle = "rgba(255,255,255,.72)";
  ctx.beginPath();
  ctx.moveTo(anchorX, 0);
  ctx.lineTo(anchorX, height);
  ctx.stroke();
}

function rawHeartCoordinates(progress) {
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

const HEART_ARC_TABLE = (() => {
  const points = [];
  let totalLength = 0;
  let previous = rawHeartCoordinates(0);
  points.push({ progress: 0, length: 0, ...previous });
  for (let index = 1; index <= 720; index += 1) {
    const progress = index / 720;
    const point = rawHeartCoordinates(progress);
    totalLength += Math.hypot(point.x - previous.x, point.y - previous.y);
    points.push({ progress, length: totalLength, ...point });
    previous = point;
  }
  return { points, totalLength };
})();

// Convert normalized time to normalized arc length so the cursor moves evenly around the heart.
function heartCoordinates(progress) {
  const targetLength = clamp(progress, 0, 1) * HEART_ARC_TABLE.totalLength;
  let low = 0;
  let high = HEART_ARC_TABLE.points.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (HEART_ARC_TABLE.points[middle].length < targetLength) low = middle + 1;
    else high = middle;
  }
  const after = HEART_ARC_TABLE.points[low];
  const before = HEART_ARC_TABLE.points[Math.max(0, low - 1)];
  const span = Math.max(after.length - before.length, 0.0001);
  const mix = clamp((targetLength - before.length) / span, 0, 1);
  return {
    x: before.x + (after.x - before.x) * mix,
    y: before.y + (after.y - before.y) * mix,
  };
}

function heartPoint(progress, centerX, centerY, scale, offset = 0) {
  const point = heartCoordinates(progress);
  const before = heartCoordinates(progress < 0.001 ? progress + 0.999 : progress - 0.001);
  const after = heartCoordinates(progress > 0.999 ? progress - 0.999 : progress + 0.001);
  const x = centerX + (point.x / 18) * scale;
  const y = centerY - (point.y / 18) * scale;
  const dx = after.x - before.x;
  const dy = -(after.y - before.y);
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: x + (dy / length) * offset,
    y: y + (-dx / length) * offset,
  };
}

function traceHeartRange(ctx, centerX, centerY, scale, start = 0, end = 1, offset = 0) {
  const span = Math.max(0, end - start);
  if (!span) return;
  const steps = Math.max(2, Math.ceil(260 * span));
  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const point = heartPoint(start + (i / steps) * span, centerX, centerY, scale, offset);
    i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y);
  }
}

function traceHeart(ctx, centerX, centerY, scale, progress = 1, offset = 0) {
  traceHeartRange(ctx, centerX, centerY, scale, 0, progress, offset);
}

function heartGrade(score) {
  if (!Number.isFinite(score)) return "TARGET HEART";
  if (score >= 90) return "CRYSTAL HEART";
  if (score >= 75) return "RADIANT HEART";
  if (score >= 55) return "WILD HEART";
  return "NEON HEART";
}

function displayPitchOffset(errorSemitones, pixelsPerSemitone) {
  // Preserve the direction and relative size of the real pitch error while
  // compressing extreme misses enough for the result to remain heart-shaped.
  return Math.tanh(errorSemitones / 2.8) * Math.min(pixelsPerSemitone * 2.7, 42);
}

function buildActualHeartTrace(history, centerX, centerY, scale, pixelsPerSemitone, completed, liveSample = null) {
  const samples = history
    .filter((point) => point.voiced && Number.isFinite(point.actualMidi) && Number.isFinite(point.targetMidi))
    .map((point) => ({
      progress: clamp(point.progress, 0, 1),
      error: point.errorSemitones,
      accuracy: point.accuracy,
    }));
  if (!completed && liveSample?.voiced && Number.isFinite(liveSample.actualMidi) && Number.isFinite(liveSample.targetMidi)) {
    const progress = clamp(liveSample.progress, 0, 1);
    const error = clamp(liveSample.actualMidi - liveSample.targetMidi, -MAX_PITCH_ERROR, MAX_PITCH_ERROR);
    const accuracy = Math.exp(-error * error / 2.4);
    const latest = samples.at(-1);
    if (!latest || progress - latest.progress > 0.0001) {
      samples.push({ progress, error, accuracy });
    }
  }
  if (!samples.length) return [];

  if (completed) {
    const seamError = (samples[0].error + samples.at(-1).error) * 0.5;
    const seamAccuracy = (samples[0].accuracy + samples.at(-1).accuracy) * 0.5;
    samples.unshift({ progress: 0, error: seamError, accuracy: seamAccuracy });
    samples.push({ progress: 1, error: seamError, accuracy: seamAccuracy });
  }

  const points = [];
  for (let index = 0; index < samples.length - 1; index += 1) {
    const from = samples[index];
    const to = samples[index + 1];
    const steps = Math.max(1, Math.ceil((to.progress - from.progress) / 0.006));
    for (let step = index ? 1 : 0; step <= steps; step += 1) {
      const mix = step / steps;
      const progress = from.progress + (to.progress - from.progress) * mix;
      const isSilentBridge = to.progress - from.progress > 0.012;
      const errorMix = isSilentBridge ? mix * mix * (3 - 2 * mix) : mix;
      const error = from.error + (to.error - from.error) * errorMix;
      const accuracy = from.accuracy + (to.accuracy - from.accuracy) * errorMix;
      const point = heartPoint(
        progress,
        centerX,
        centerY,
        scale,
        displayPitchOffset(error, pixelsPerSemitone),
      );
      points.push({ ...point, progress, accuracy });
    }
  }
  if (samples.length === 1) {
    const point = heartPoint(
      samples[0].progress,
      centerX,
      centerY,
      scale,
      displayPitchOffset(samples[0].error, pixelsPerSemitone),
    );
    points.push({ ...point, ...samples[0] });
  }
  return points;
}

function heartBeat(now, quality, completed, musicLevel) {
  const period = 840 - quality * 90;
  const phase = (now % period) / period;
  const firstBeat = Math.exp(-Math.pow((phase - 0.075) / 0.052, 2));
  const secondBeat = Math.exp(-Math.pow((phase - 0.235) / 0.072, 2)) * 0.56;
  const pulse = clamp(firstBeat + secondBeat, 0, 1);
  const audioLift = clamp(musicLevel, 0, 1) * 0.026;
  const amplitude = (completed ? 0.036 : 0.03) + quality * (completed ? 0.045 : 0.03) + audioLift;
  return {
    pulse,
    scale: 1 + audioLift * 0.4 + pulse * amplitude + (completed ? Math.sin(now * 0.0017) * 0.004 : 0),
  };
}

function tracePoints(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index) ctx.lineTo(point.x, point.y);
    else ctx.moveTo(point.x, point.y);
  });
}

function drawHeartAtmosphere(ctx, width, height, centerX, centerY, scale, quality, completed, now, beatPulse) {
  const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale * 1.55);
  glow.addColorStop(0, `rgba(255,46,126,${0.035 + quality * 0.08 + beatPulse * 0.055})`);
  glow.addColorStop(0.48, `rgba(35,255,205,${quality * 0.028})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const starCount = Math.round(34 + quality * 72);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let index = 0; index < starCount; index += 1) {
    const seed = hash(index * 17.17);
    const angle = hash(index * 9.31) * TAU + now * (index % 2 ? 0.000008 : -0.000006);
    const distance = scale * (0.32 + hash(index * 4.77) * 1.22);
    const twinkle = 0.25 + 0.75 * Math.abs(Math.sin(now * 0.0015 + seed * 18));
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance * 0.72;
    ctx.fillStyle = index % 4 === 0
      ? `rgba(112,255,218,${twinkle * (0.12 + quality * 0.38)})`
      : `rgba(255,152,190,${twinkle * (0.1 + quality * 0.3)})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.45 + seed * (0.8 + quality * 1.15) + beatPulse * 0.5, 0, TAU);
    ctx.fill();
  }

  if (completed && quality >= 0.55) {
    const rayStrength = (quality - 0.55) / 0.45;
    ctx.save();
    ctx.translate(centerX, centerY + scale * 0.04);
    ctx.rotate(now * 0.000025);
    for (let index = 0; index < 18; index += 1) {
      const angle = (index / 18) * TAU;
      const length = scale * (0.5 + hash(index * 5.12) * 0.7);
      const ray = ctx.createLinearGradient(0, 0, Math.cos(angle) * length, Math.sin(angle) * length);
      ray.addColorStop(0, `rgba(255,232,198,${0.08 * rayStrength})`);
      ray.addColorStop(1, "rgba(255,80,154,0)");
      ctx.strokeStyle = ray;
      ctx.lineWidth = 0.7 + rayStrength * 1.1;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * scale * 0.17, Math.sin(angle) * scale * 0.17);
      ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

function drawActualHeart(ctx, points, quality, completed, now) {
  if (!points.length) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalCompositeOperation = "lighter";
  if (points.length > 1) {
    ctx.strokeStyle = `rgba(255,54,135,${0.2 + quality * 0.18})`;
    ctx.lineWidth = 13 + quality * 8;
    ctx.shadowBlur = 18 + quality * 24;
    ctx.shadowColor = quality > 0.72 ? "rgba(84,255,211,.82)" : "rgba(255,62,139,.78)";
    tracePoints(ctx, points);
    ctx.stroke();

    for (let index = 1; index < points.length; index += 1) {
      const from = points[index - 1];
      const to = points[index];
      const accuracy = (from.accuracy + to.accuracy) * 0.5;
      const red = Math.round(255 - accuracy * 142);
      const green = Math.round(92 + accuracy * 163);
      const blue = Math.round(145 + accuracy * 68);
      ctx.strokeStyle = `rgba(${red},${green},${blue},.98)`;
      ctx.lineWidth = 2.8 + accuracy * 3.4;
      ctx.shadowBlur = 7 + accuracy * 20;
      ctx.shadowColor = `rgba(${red},${green},${blue},.9)`;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }

  const cometCount = completed ? Math.round(2 + quality * 6) : quality > 0.72 ? 2 : 1;
  for (let comet = 0; comet < cometCount; comet += 1) {
    const cometProgress = fract(now * (0.00008 + quality * 0.000045) + comet / cometCount);
    const pointIndex = Math.min(points.length - 1, Math.floor(cometProgress * points.length));
    const point = points[pointIndex];
    const halo = 5 + quality * 7;
    const flare = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, halo);
    flare.addColorStop(0, "rgba(255,255,239,.98)");
    flare.addColorStop(0.22, `rgba(105,255,216,${0.7 + quality * 0.25})`);
    flare.addColorStop(1, "rgba(105,255,216,0)");
    ctx.fillStyle = flare;
    ctx.beginPath();
    ctx.arc(point.x, point.y, halo, 0, TAU);
    ctx.fill();
  }
  if (!completed) {
    const head = points.at(-1);
    const headRadius = 5.5 + quality * 3.5;
    const headGlow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, headRadius * 2.2);
    headGlow.addColorStop(0, "rgba(255,255,244,1)");
    headGlow.addColorStop(0.24, "rgba(105,255,216,.96)");
    headGlow.addColorStop(1, "rgba(255,73,147,0)");
    ctx.fillStyle = headGlow;
    ctx.beginPath();
    ctx.arc(head.x, head.y, headRadius * 2.2, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawHeartLane(canvas, chart, history, progress, score, completed, now, activeNote, currentPitch, traceTargetPitch, hasVoice, outputSize = null, musicLevel = 0) {
  const { width, height, dpr } = resizeCanvas(canvas, outputSize);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const centerX = width * 0.52;
  const centerY = height * 0.49;
  const scale = Math.min(width * 0.38, height * 0.43);
  const pixelsPerSemitone = clamp(pitchPixelsPerSemitone(height), 8, 16);
  const inTuneOffset = pixelsPerSemitone * IN_TUNE_SEMITONES;
  const quality = Number.isFinite(score) ? clamp(score / 100, 0, 1) : completed ? 0.82 : 0;
  const beat = heartBeat(now, quality, completed, musicLevel);
  const heartScale = scale * beat.scale;

  ctx.fillStyle = "#020205";
  ctx.fillRect(0, 0, width, height);
  drawHeartAtmosphere(ctx, width, height, centerX, centerY, heartScale, quality, completed, now, beat.pulse);

  if (completed) {
    const echoPhase = (now * 0.00022) % 1;
    for (let ring = 0; ring < 3; ring += 1) {
      const phase = (echoPhase + ring / 3) % 1;
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineWidth = 1.5 + (1 - phase) * 2;
      ctx.strokeStyle = `rgba(${ring === 1 ? "103,255,205" : "255,91,151"},${(1 - phase) * (0.2 + quality * 0.24)})`;
      ctx.shadowBlur = 18;
      ctx.shadowColor = ring === 1 ? "rgba(103,255,205,.46)" : "rgba(255,91,151,.48)";
      traceHeart(ctx, centerX, centerY, heartScale * (1 + phase * 0.14));
      ctx.stroke();
      ctx.restore();
    }

    const fill = ctx.createRadialGradient(centerX, centerY * 0.94, 0, centerX, centerY, heartScale * 1.18);
    fill.addColorStop(0, `rgba(255,244,215,${0.14 + quality * 0.24})`);
    fill.addColorStop(0.34, `rgba(255,93,151,${0.11 + quality * 0.2})`);
    fill.addColorStop(1, "rgba(76,18,52,0)");
    traceHeart(ctx, centerX, centerY, heartScale);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.save();
    traceHeart(ctx, centerX, centerY, heartScale);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 22; i += 1) {
      const point = heartPoint((i + 0.5) / 22, centerX, centerY, heartScale);
      ctx.strokeStyle = i % 3 === 0
        ? `rgba(112,255,216,${0.035 + quality * 0.055})`
        : `rgba(255,132,176,${0.035 + quality * 0.06})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + heartScale * 0.06);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(10, inTuneOffset * 2);
  ctx.strokeStyle = hasVoice && !completed ? "rgba(255,181,112,.08)" : "rgba(255,181,112,.035)";
  traceHeart(ctx, centerX, centerY, heartScale);
  ctx.stroke();
  ctx.lineWidth = hasVoice && !completed ? 2.1 : 1.1;
  ctx.strokeStyle = hasVoice && !completed ? "rgba(255,235,210,.5)" : "rgba(255,235,210,.13)";
  ctx.shadowBlur = hasVoice && !completed ? 10 : 0;
  ctx.shadowColor = "rgba(255,122,166,.36)";
  traceHeart(ctx, centerX, centerY, heartScale);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 1;
  ctx.strokeStyle = hasVoice && !completed ? "rgba(103,255,205,.1)" : "rgba(103,255,205,.045)";
  ctx.shadowBlur = hasVoice && !completed ? 2 : 0;
  ctx.shadowColor = "rgba(63,255,194,.12)";
  traceHeart(ctx, centerX, centerY, heartScale, 1, -inTuneOffset);
  ctx.stroke();
  traceHeart(ctx, centerX, centerY, heartScale, 1, inTuneOffset);
  ctx.stroke();
  ctx.restore();

  chart.notes.forEach((note) => {
    const isActive = note === activeNote && hasVoice;
    const isPast = note.heartEnd < progress;
    const standardLineActive = hasVoice && !completed;
    const liveAccuracy = clamp(history.at(-1)?.accuracy || 0, 0, 1);
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = isActive ? 6 + liveAccuracy * 3 : standardLineActive ? 2.5 : 1.3;
    ctx.strokeStyle = isActive
      ? `rgba(255,215,133,${0.82 + liveAccuracy * 0.18})`
      : completed ? "rgba(255,236,218,.08)"
        : standardLineActive
          ? isPast ? "rgba(255,236,218,.12)" : note.golden ? "rgba(255,196,92,.3)" : "rgba(255,255,255,.2)"
          : "rgba(255,255,255,.08)";
    ctx.shadowBlur = isActive ? 14 + liveAccuracy * 14 : 0;
    ctx.shadowColor = isActive ? "rgba(255,92,151,.9)" : "transparent";
    traceHeartRange(ctx, centerX, centerY, heartScale, note.heartStart, note.heartEnd);
    ctx.stroke();
    ctx.restore();
  });

  const actualTrace = buildActualHeartTrace(
    history,
    centerX,
    centerY,
    heartScale,
    pixelsPerSemitone,
    completed,
    {
      progress,
      actualMidi: currentPitch,
      targetMidi: traceTargetPitch,
      voiced: hasVoice,
    },
  );
  drawActualHeart(ctx, actualTrace, quality, completed, now);

  const cursorPoint = heartPoint(clamp(progress, 0, 1), centerX, centerY, heartScale);
  if (!completed) {
    ctx.fillStyle = hasVoice ? "rgba(255,206,125,.2)" : "rgba(255,255,255,.05)";
    ctx.beginPath();
    ctx.arc(cursorPoint.x, cursorPoint.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hasVoice ? "#fff9e8" : "rgba(255,255,255,.42)";
    ctx.shadowBlur = hasVoice ? 26 : 5;
    ctx.shadowColor = hasVoice ? "rgba(255,105,154,1)" : "rgba(255,255,255,.2)";
    ctx.beginPath();
    ctx.arc(cursorPoint.x, cursorPoint.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (activeNote) {
      const latest = history.at(-1);
      if (latest?.voiced && latest.noteId === activeNote.id) {
        const livePoint = heartPoint(
          progress,
          centerX,
          centerY,
          heartScale,
          displayPitchOffset(latest.errorSemitones, pixelsPerSemitone),
        );
        ctx.fillStyle = latest.accuracy > 0.82 ? "#7dffd8" : "#ff9f78";
        ctx.shadowBlur = 18;
        ctx.shadowColor = latest.accuracy > 0.82 ? "rgba(103,255,205,.85)" : "rgba(255,112,131,.78)";
        ctx.beginPath();
        ctx.arc(livePoint.x, livePoint.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
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
    const core = ctx.createRadialGradient(centerX, centerY + heartScale * 0.02, 0, centerX, centerY + heartScale * 0.02, heartScale * 0.32);
    core.addColorStop(0, `rgba(255,251,226,${0.42 * corePulse})`);
    core.addColorStop(0.18, `rgba(255,103,166,${0.26 * corePulse})`);
    core.addColorStop(1, "rgba(255,65,139,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(centerX, centerY + heartScale * 0.02, heartScale * 0.32, 0, Math.PI * 2);
    ctx.fill();

    const particles = Math.round(30 + quality * 58);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles; i += 1) {
      const particleProgress = (i / particles + now * (0.000012 + (i % 3) * 0.000004)) % 1;
      const point = heartPoint(particleProgress, centerX, centerY, heartScale, Math.sin(now * 0.002 + i) * 5);
      const alpha = 0.28 + quality * 0.68;
      ctx.fillStyle = i % 3 === 0 ? `rgba(255,220,151,${alpha})` : `rgba(111,255,211,${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 0.9 + quality * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    [0.08, 0.28, 0.52, 0.76].forEach((pointProgress, index) => {
      const point = heartPoint(pointProgress, centerX, centerY, heartScale);
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

    if (quality >= 0.75) {
      const crownStrength = (quality - 0.75) / 0.25;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let index = 0; index < 8; index += 1) {
        const pointProgress = fract(now * 0.000035 + index / 8);
        const point = heartPoint(pointProgress, centerX, centerY, heartScale, Math.sin(now * 0.0018 + index) * 8);
        const flare = 8 + crownStrength * 14 + Math.sin(now * 0.005 + index) * 3;
        ctx.strokeStyle = `rgba(255,247,213,${0.36 + crownStrength * 0.52})`;
        ctx.lineWidth = 1 + crownStrength;
        ctx.beginPath();
        ctx.moveTo(point.x - flare, point.y);
        ctx.lineTo(point.x + flare, point.y);
        ctx.moveTo(point.x, point.y - flare);
        ctx.lineTo(point.x, point.y + flare);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.font = "700 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(heartGrade(score), centerX, centerY + heartScale * 0.15);
    if (Number.isFinite(score)) {
      ctx.fillStyle = "rgba(255,255,255,.48)";
      ctx.font = "700 9px Arial";
      ctx.fillText(`${score} / 100`, centerX, centerY + heartScale * 0.15 + 18);
    }
  }
}

function drawHeartPoster(canvas, chart, history, score) {
  const width = 1080;
  const height = 1440;
  drawHeartLane(canvas, chart, history, 1, score, true, 6840, null, 0, null, false, { width, height });
}

function canvasToPng(canvas) {
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
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  const chooserButton = root.querySelector("[data-sing-choose]");
  const chooserLabel = chooserButton?.querySelector("[data-sing-session-label]");
  const resultActions = stage.querySelector("[data-sing-result-actions]");
  const exportButton = stage.querySelector("[data-sing-export]");
  const exportLabel = stage.querySelector("[data-sing-export-label]");
  const exportStatus = stage.querySelector("[data-sing-export-status]");
  const modeButtons = [...stage.querySelectorAll("[data-sing-mode]")];
  let visualState = instance.interaction.custom;

  let chart = { notes: [], lines: [], timelineStart: 0, timelineEnd: 1, timelineDuration: 1 };
  let audioContext = null;
  let mediaSource = null;
  let musicAnalyser = null;
  let micAnalyser = null;
  let micStream = null;
  let micSource = null;
  let micBuffer = null;
  let musicBuffer = null;
  let animationFrame = 0;
  let lastPitchCheck = 0;
  let lastPitchDebug = 0;
  let activeLine = -1;
  let activeNote = null;
  let guideNote = null;
  let running = false;
  let completed = false;
  let mode = "normal";
  let micEnabled = false;
  let singingSession = false;
  let trackingMicrophone = false;
  let eligibleSamples = 0;
  let accuracyTotal = 0;
  let currentPitchMidi = 0;
  let currentTraceTargetMidi = null;
  let heartProgress = 0;
  let smoothedPitchError = 0;
  let lastVoicedSampleTime = Number.NEGATIVE_INFINITY;
  const pitchErrorWindow = [];
  const pitchStabilizer = createPitchStabilizer();
  const performanceHistory = [];
  let resultFile = null;
  let resultFilePromise = null;
  let exportGeneration = 0;
  let sessionGeneration = 0;
  let selectedSession = null;

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

  function selectAudioTrack(withMicrophone) {
    const nextSource = withMicrophone ? audio.dataset.singBackingSrc : audio.dataset.singOriginalSrc;
    audio.pause();
    if (audio.src !== nextSource) {
      audio.src = nextSource;
      audio.load();
    } else {
      audio.currentTime = 0;
    }
  }

  function setMicrophoneCapture(active) {
    trackingMicrophone = Boolean(active && micEnabled);
    micStream?.getAudioTracks().forEach((track) => {
      track.enabled = trackingMicrophone;
    });
  }

  function syncSessionControls(chooserOpen = false) {
    startButton.setAttribute("aria-pressed", String(selectedSession === "sing"));
    previewButton.setAttribute("aria-pressed", String(selectedSession === "preview"));
    if (!chooserButton || !chooserLabel) return;
    const sessionLabel = selectedSession === "sing" ? "演唱" : "试听";
    chooserButton.setAttribute("aria-expanded", String(chooserOpen));
    chooserButton.setAttribute(
      "aria-label",
      chooserOpen ? "体验模式选择已打开" : `当前为${sessionLabel}，切换体验模式`,
    );
    chooserButton.dataset.session = selectedSession || "choose";
    chooserLabel.textContent = chooserOpen
      ? "试听 / 演唱"
      : completed ? `${sessionLabel}完成` : `${sessionLabel}中`;
  }

  function showSessionChooser() {
    sessionGeneration += 1;
    running = false;
    audio.pause();
    audio.currentTime = 0;
    cancelAnimationFrame(animationFrame);
    setMicrophoneCapture(false);
    resetPerformance();
    visualState.playing = false;
    stateElement.textContent = "READY";
    gate.querySelector("p").textContent = "选择体验方式";
    gateStatus.textContent = "可随时从右上角重新选择";
    startButton.textContent = selectedSession === "sing" ? "重新演唱" : "开始演唱";
    startButton.disabled = false;
    previewButton.disabled = false;
    gate.hidden = false;
    syncSessionControls(true);
  }

  async function enableMicrophone() {
    if (micEnabled) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: { ideal: 1 },
        sampleRate: { ideal: 44100 },
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    micSource = audioContext.createMediaStreamSource(micStream);
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
    performanceHistory.length = 0;
    pitchErrorWindow.length = 0;
    pitchStabilizer.reset();
    currentPitchMidi = 0;
    currentTraceTargetMidi = null;
    heartProgress = 0;
    smoothedPitchError = 0;
    lastVoicedSampleTime = Number.NEGATIVE_INFINITY;
    completed = false;
    stage.classList.remove("is-complete");
    scoreElement.textContent = "--";
    pitchElement.textContent = "--";
    targetElement.textContent = "TARGET --";
    visualState.accuracy = 0;
    visualState.hitPulse = 0;
    visualState.lastHitNote = null;
    visualState.micLevel = 0;
    visualState.voiced = false;
    visualState.progress = 0;
    visualState.completed = false;
    resultFile = null;
    resultFilePromise = null;
    exportGeneration += 1;
    resultActions.hidden = true;
    exportButton.disabled = false;
    exportLabel.textContent = "保存 / 分享";
    exportStatus.textContent = "";
  }

  function performanceScore() {
    return eligibleSamples ? Math.round((accuracyTotal / eligibleSamples) * 100) : Number.NaN;
  }

  function paintLane(now) {
    if (mode === "heart") {
      drawHeartLane(
        lane,
        chart,
        performanceHistory,
        heartProgress,
        performanceScore(),
        completed,
        now,
        activeNote,
        currentPitchMidi,
        currentTraceTargetMidi,
        visualState.voiced,
        null,
        visualState.musicLevel,
      );
    } else {
      drawPitchLane(
        lane,
        chart,
        audio.currentTime,
        performanceHistory,
        activeNote,
        visualState.accuracy,
        visualState.voiced,
      );
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
      resultActions.hidden = mode !== "heart";
      stateElement.textContent = "COMPLETE";
      if (mode === "heart") beginLoop();
    }
    paintLane(performance.now());
  }

  function prepareResultFile() {
    if (resultFile) return Promise.resolve(resultFile);
    if (resultFilePromise) return resultFilePromise;

    exportButton.disabled = true;
    exportLabel.textContent = "生成中...";
    const generation = exportGeneration;
    const poster = document.createElement("canvas");
    drawHeartPoster(poster, chart, performanceHistory, performanceScore());
    resultFilePromise = canvasToPng(poster)
      .then((blob) => {
        if (generation !== exportGeneration) return null;
        resultFile = new File([blob], "fx-lab-heart.png", { type: "image/png" });
        exportButton.disabled = false;
        exportLabel.textContent = "保存 / 分享";
        return resultFile;
      })
      .catch((error) => {
        if (generation !== exportGeneration) return null;
        resultFilePromise = null;
        exportButton.disabled = false;
        exportLabel.textContent = "重新生成";
        exportStatus.textContent = "图片生成失败";
        throw error;
      });
    return resultFilePromise;
  }

  async function shareResult() {
    if (!resultFile) {
      try {
        await prepareResultFile();
        exportStatus.textContent = "图片已生成，请再次点击";
      } catch {
        // prepareResultFile reports the visible error state.
      }
      return;
    }
    exportButton.disabled = true;
    exportStatus.textContent = "";
    try {
      const shareData = {
        files: [resultFile],
        title: "On the Run · Heart Trace",
        text: "我的演唱心形轨迹",
      };
      if (navigator.share && navigator.canShare?.({ files: shareData.files })) {
        await navigator.share(shareData);
        exportStatus.textContent = "已打开系统分享";
      } else {
        downloadBlob(resultFile, resultFile.name);
        exportStatus.textContent = "图片已下载";
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        downloadBlob(resultFile, resultFile.name);
        exportStatus.textContent = "分享不可用，图片已下载";
      }
    } finally {
      exportButton.disabled = false;
    }
  }

  async function start(withMicrophone) {
    const generation = ++sessionGeneration;
    selectedSession = withMicrophone ? "sing" : "preview";
    completed = false;
    syncSessionControls(false);
    startButton.disabled = true;
    previewButton.disabled = true;
    gateStatus.textContent = withMicrophone ? "LOADING BACKING TRACK" : "LOADING ORIGINAL VOCAL";
    singingSession = withMicrophone;
    setMicrophoneCapture(false);
    try {
      ensureAudioGraph();
      await audioContext.resume();
      if (generation !== sessionGeneration) return false;
      selectAudioTrack(withMicrophone);
      resetPerformance();
      visualState.heartMode = mode === "heart";
      stateElement.textContent = withMicrophone ? "CONNECTING" : "PLAYBACK";
      if (withMicrophone) {
        try {
          await enableMicrophone();
          if (generation !== sessionGeneration) {
            setMicrophoneCapture(false);
            return false;
          }
          setMicrophoneCapture(true);
          stateElement.textContent = "LISTENING";
        } catch {
          stateElement.textContent = "MIC BLOCKED";
        }
      }
      await audio.play();
      if (generation !== sessionGeneration) {
        audio.pause();
        return false;
      }
      running = true;
      visualState.playing = true;
      gate.hidden = true;
      syncSessionControls(false);
      return true;
    } catch {
      if (generation !== sessionGeneration) return false;
      gateStatus.textContent = "AUDIO UNAVAILABLE";
      startButton.disabled = false;
      previewButton.disabled = false;
      gate.hidden = false;
      syncSessionControls(true);
      return false;
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
    const traceTargetMidi = targetMidiAtTime(chart, time);
    currentTraceTargetMidi = traceTargetMidi;
    heartProgress = heartProgressAtTime(chart, time);
    let pitchMidi = currentPitchMidi;
    let level = 0;
    let pitchSampled = false;

    if (musicAnalyser) {
      musicAnalyser.getByteFrequencyData(musicBuffer);
      const musicSum = musicBuffer.reduce((sum, value) => sum + value, 0);
      visualState.musicLevel = musicSum / musicBuffer.length / 255;
    }

    if (trackingMicrophone && micAnalyser && now - lastPitchCheck > 70) {
      lastPitchCheck = now;
      pitchSampled = true;
      micAnalyser.getFloatTimeDomainData(micBuffer);
      const detected = detectPitch(micBuffer, audioContext.sampleRate);
      level = clamp(detected.rms * 20, 0, 1);
      visualState.micLevel += (level - visualState.micLevel) * 0.42;
      visualState.voiced = Boolean(detected.frequency);
      if (detected.frequency) {
        const rawMidi = midiFromFrequency(detected.frequency);
        pitchMidi = pitchStabilizer.update(rawMidi, detected.confidence, now);
        currentPitchMidi = pitchMidi;
        visualState.pitch = pitchMidi;
      } else {
        pitchStabilizer.update(null, detected.confidence, now);
        pitchMidi = 0;
        currentPitchMidi = 0;
      }
      if (now - lastPitchDebug >= PITCH_DEBUG_INTERVAL) {
        lastPitchDebug = now;
        const targetMidi = activeNote?.midi ?? null;
        console.info("[semantic-rose:mic-pitch]", {
          timeSeconds: Number(time.toFixed(3)),
          frequencyHz: detected.frequency ? Number(detected.frequency.toFixed(2)) : null,
          rawMidi: detected.frequency ? Number(midiFromFrequency(detected.frequency).toFixed(2)) : null,
          microphoneMidi: pitchMidi ? Number(pitchMidi.toFixed(2)) : null,
          microphoneNote: pitchMidi ? noteName(pitchMidi) : null,
          targetMidi,
          targetNote: targetMidi === null ? null : noteName(targetMidi),
          centsOffset: pitchMidi && targetMidi !== null ? Math.round((pitchMidi - targetMidi) * 100) : null,
          rms: Number(detected.rms.toFixed(4)),
          confidence: Number(detected.confidence.toFixed(3)),
        });
      }
    } else if (trackingMicrophone) {
      level = visualState.micLevel || 0;
    } else {
      visualState.voiced = false;
      visualState.micLevel *= 0.8;
      currentPitchMidi = 0;
    }

    let accuracy = 0;
    if (activeNote && visualState.voiced && pitchMidi) {
      const error = Math.abs(pitchMidi - activeNote.midi);
      accuracy = Math.exp(-error * error / 2.4);
      if (accuracy > 0.82 && activeNote !== visualState.lastHitNote) {
        visualState.hitPulse = 1;
        visualState.lastHitNote = activeNote;
      }
    }
    if (pitchSampled) {
      const voiced = Boolean(visualState.voiced && pitchMidi);
      let errorSemitones = 0;
      if (activeNote) {
        eligibleSamples += 1;
        if (voiced) accuracyTotal += accuracy;
      }
      if (voiced && Number.isFinite(traceTargetMidi)) {
        const rawError = clamp(pitchMidi - traceTargetMidi, -MAX_PITCH_ERROR, MAX_PITCH_ERROR);
        const startsSegment = time - lastVoicedSampleTime > PITCH_SAMPLE_GAP * 2.5;
        if (startsSegment) {
          pitchErrorWindow.length = 0;
          smoothedPitchError = rawError;
        }
        pitchErrorWindow.push(rawError);
        if (pitchErrorWindow.length > 3) pitchErrorWindow.shift();
        const sortedErrors = [...pitchErrorWindow].sort((left, right) => left - right);
        const medianError = sortedErrors[Math.floor(sortedErrors.length / 2)];
        smoothedPitchError += (medianError - smoothedPitchError) * 0.45;
        errorSemitones = smoothedPitchError;
        lastVoicedSampleTime = time;
      }
      const traceAccuracy = Number.isFinite(traceTargetMidi) && voiced
        ? Math.exp(-Math.pow(pitchMidi - traceTargetMidi, 2) / 2.4)
        : 0;
      performanceHistory.push({
        time,
        progress: heartProgress,
        noteId: activeNote?.id ?? null,
        targetMidi: traceTargetMidi,
        actualMidi: voiced ? pitchMidi : null,
        errorSemitones,
        accuracy: activeNote ? accuracy : traceAccuracy,
        voiced,
      });
    }
    visualState.accuracy += (accuracy - visualState.accuracy) * 0.3;
    visualState.targetPitch = activeNote?.midi || 0;
    visualState.progress = time / Math.max(audio.duration || 20.5, 1);

    const score = performanceScore();
    scoreElement.textContent = Number.isFinite(score) ? String(score).padStart(2, "0") : "--";
    pitchElement.textContent = pitchMidi
      ? noteName(pitchMidi)
      : trackingMicrophone && visualState.micLevel >= MIN_PITCH_RMS * 20 ? "ANALYZE" : trackingMicrophone ? "NO INPUT" : "--";
    if (trackingMicrophone) {
      stateElement.textContent = pitchMidi
        ? "PITCH LOCK"
        : visualState.micLevel >= MIN_PITCH_RMS * 20 ? "LISTENING" : "INPUT LOW";
    }
    targetElement.textContent = completed && mode === "heart"
      ? heartGrade(score)
      : activeNote ? `TARGET ${noteName(activeNote.midi)}`
        : guideNote ? `NEXT ${noteName(guideNote.midi)}` : "TARGET --";
    levelElement.style.transform = `scaleX(${clamp(level, 0.025, 1)})`;
    updateLyrics(time, activeNote);
    paintLane(now);

    if (running || (completed && mode === "heart")) animationFrame = requestAnimationFrame(update);
  }

  function beginLoop() {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(update);
  }

  const onStart = () => start(true).then((started) => {
    if (started) beginLoop();
  });
  const onPreview = () => start(false).then((started) => {
    if (started) beginLoop();
  });
  const onChooseSession = () => showSessionChooser();
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
    gateStatus.textContent = singingSession && Number.isFinite(score)
      ? `ACCURACY ${score}`
      : singingSession ? "SING AGAIN" : "ORIGINAL PLAYBACK COMPLETE";
    setMicrophoneCapture(false);
    startButton.textContent = "再唱一次";
    startButton.disabled = false;
    previewButton.disabled = false;
    resultActions.hidden = mode !== "heart";
    prepareResultFile().catch(() => {});
    syncSessionControls(!gate.hidden);
    if (mode === "heart") beginLoop();
  };

  startButton.addEventListener("click", onStart);
  previewButton.addEventListener("click", onPreview);
  chooserButton?.addEventListener("click", onChooseSession);
  exportButton.addEventListener("click", shareResult);
  modeButtons.forEach((button) => button.addEventListener("click", onModeChange));
  audio.addEventListener("ended", onEnded);

  return {
    setPaused(paused) {
      if (!running) return;
      if (paused) {
        audio.pause();
        setMicrophoneCapture(false);
        stateElement.textContent = "PAUSED";
      } else {
        setMicrophoneCapture(singingSession);
        audio.play().catch(() => {});
        stateElement.textContent = singingSession && micEnabled ? "LISTENING" : "PLAYBACK";
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
      setMicrophoneCapture(singingSession);
      gate.hidden = true;
      syncSessionControls(false);
      audio.play().catch(() => {});
      beginLoop();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(animationFrame);
      audio.pause();
      micSource?.disconnect();
      micStream?.getTracks().forEach((track) => track.stop());
      audioContext?.close().catch(() => {});
      startButton.removeEventListener("click", onStart);
      previewButton.removeEventListener("click", onPreview);
      chooserButton?.removeEventListener("click", onChooseSession);
      exportButton.removeEventListener("click", shareResult);
      modeButtons.forEach((button) => button.removeEventListener("click", onModeChange));
      audio.removeEventListener("ended", onEnded);
    },
  };
}

function drawPetal(ctx, radius, angle, spread, length, alpha, color) {
  ctx.save();
  ctx.rotate(angle);
  ctx.translate(radius, 0);
  ctx.rotate(Math.PI / 2 + spread);
  ctx.scale(0.48, 1);
  ctx.fillStyle = color.replace("ALPHA", alpha.toFixed(3));
  ctx.beginPath();
  ctx.moveTo(0, -length * 0.12);
  ctx.bezierCurveTo(length * 0.68, -length * 0.52, length * 0.62, length * 0.56, 0, length);
  ctx.bezierCurveTo(-length * 0.62, length * 0.56, -length * 0.68, -length * 0.52, 0, -length * 0.12);
  ctx.fill();
  ctx.restore();
}

function traceBackdropHeart(ctx, centerX, centerY, scale) {
  ctx.beginPath();
  for (let i = 0; i <= 140; i += 1) {
    const angle = (i / 140) * TAU;
    const sin = Math.sin(angle);
    const x = 16 * sin * sin * sin;
    const y = 13 * Math.cos(angle)
      - 5 * Math.cos(angle * 2)
      - 2 * Math.cos(angle * 3)
      - Math.cos(angle * 4);
    const px = centerX + (x / 18) * scale;
    const py = centerY - (y / 18) * scale;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
}

export function draw(ctx, w, h, t, intensity, state) {
  const live = state?.custom || {};
  const music = clamp(live.musicLevel || 0, 0, 1);
  const mic = clamp(live.micLevel || 0, 0, 1);
  const accuracy = clamp(live.accuracy || 0, 0, 1);
  const pulse = clamp(live.hitPulse || 0, 0, 1);
  const progress = live.progress || (t * 0.000025) % 1;
  const energy = clamp(0.18 + music * 1.15 + mic * 0.9 + pulse * 0.7, 0.18, 1.8) * intensity;
  const cx = w * (w < 720 ? 0.5 : 0.48);
  const cy = h * 0.46;

  if (live.heartMode) {
    ctx.fillStyle = "#010103";
    ctx.fillRect(0, 0, w, h);
    live.hitPulse = pulse * 0.9;
    live.micLevel = mic * 0.96;
    return;
  }

  ctx.fillStyle = "#030305";
  ctx.fillRect(0, 0, w, h);

  const backdrop = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
  backdrop.addColorStop(0, `rgba(${38 + Math.round(accuracy * 18)},${12 + Math.round(accuracy * 34)},${26 + Math.round(accuracy * 30)},${0.72 + music * 0.18})`);
  backdrop.addColorStop(0.42, "rgba(16,7,18,.84)");
  backdrop.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";
  const baseRadius = Math.min(w, h) * (0.105 + energy * 0.018);
  const rings = 7;
  for (let ring = rings - 1; ring >= 0; ring -= 1) {
    const petals = 7 + ring * 2;
    const ringRadius = baseRadius * (0.24 + ring * 0.19);
    const length = baseRadius * (0.46 + ring * 0.1) * (0.9 + energy * 0.12);
    const rotation = t * (ring % 2 ? -0.000055 : 0.00007) + ring * 0.47 + progress * TAU * 0.16;
    for (let i = 0; i < petals; i += 1) {
      const angle = rotation + (i / petals) * TAU;
      const warm = 1 - accuracy;
      const color = ring % 3 === 0
        ? `rgba(${Math.round(88 + warm * 148)},${Math.round(188 + accuracy * 58)},${Math.round(201 - warm * 92)},ALPHA)`
        : `rgba(${Math.round(176 + warm * 70)},${Math.round(45 + accuracy * 104)},${Math.round(104 + accuracy * 76)},ALPHA)`;
      drawPetal(ctx, ringRadius, angle, Math.sin(t * 0.0008 + i) * 0.12, length, 0.1 + energy * 0.09, color);
    }
  }

  const particleCount = Math.floor((70 + energy * 90) * intensity);
  for (let i = 0; i < particleCount; i += 1) {
    const seed = hash(i * 8.731);
    const life = fract(seed + t * (0.000025 + hash(i * 2.4) * 0.00008));
    const angle = hash(i * 3.71) * TAU + t * (i % 2 ? 0.00006 : -0.000045);
    const distance = Math.pow(life, 0.72) * Math.max(w, h) * (0.16 + energy * 0.32);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * 0.68;
    const radius = 0.7 + seed * 2.4 + mic * 2.2;
    ctx.fillStyle = i % 4 === 0
      ? `rgba(110,255,207,${(1 - life) * (0.3 + accuracy * 0.55)})`
      : `rgba(255,86,139,${(1 - life) * (0.24 + energy * 0.22)})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }

  if (pulse > 0.01) {
    ctx.strokeStyle = `rgba(183,255,224,${pulse * 0.82})`;
    ctx.lineWidth = 2 + pulse * 5;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * (1.5 + (1 - pulse) * 2.8), 0, TAU);
    ctx.stroke();
  }
  ctx.restore();

  if (live.heartMode && live.completed) {
    const heartX = w * 0.515;
    const heartY = h * 0.58;
    const heartScale = Math.min(w, h) * 0.27;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i += 1) {
      const phase = fract(t * 0.00018 + i / 3);
      ctx.strokeStyle = i === 1
        ? `rgba(92,255,211,${(1 - phase) * 0.16})`
        : `rgba(255,79,145,${(1 - phase) * 0.2})`;
      ctx.lineWidth = 1 + (1 - phase) * 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = i === 1 ? "rgba(92,255,211,.4)" : "rgba(255,79,145,.48)";
      traceBackdropHeart(ctx, heartX, heartY, heartScale * (1 + phase * 0.18));
      ctx.stroke();
    }
    ctx.restore();
  }

  const floor = ctx.createLinearGradient(0, h * 0.6, 0, h);
  floor.addColorStop(0, "rgba(0,0,0,0)");
  floor.addColorStop(1, "rgba(0,0,0,.82)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  live.hitPulse = pulse * 0.9;
  live.micLevel = mic * 0.96;
}
