import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [54, 207, 238], density: 88, pulse: 1.35, seed: 65.4, shape: "impact" });
}
