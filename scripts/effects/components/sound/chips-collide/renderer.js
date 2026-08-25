import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 208, 79], density: 100, pulse: 2.0, seed: 23.7, shape: "impact" });
}
