import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,188,73], density: 88, pulse: 1.8, seed: 33.6, shape: "wave" });
}
