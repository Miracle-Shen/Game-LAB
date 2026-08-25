import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [164,231,91], density: 102, pulse: 1.7, seed: 41.5, shape: "wave" });
}
