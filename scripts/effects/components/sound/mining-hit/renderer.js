import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 178, 85], density: 82, pulse: 1.05, seed: 14.7, shape: "impact" });
}
