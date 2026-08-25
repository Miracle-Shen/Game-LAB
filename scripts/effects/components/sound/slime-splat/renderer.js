import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [134,226,89], density: 86, pulse: 2, seed: 47.5, shape: "impact" });
}
