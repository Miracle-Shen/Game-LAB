import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,139,92], density: 100, pulse: 2.15, seed: 36.9, shape: "impact" });
}
