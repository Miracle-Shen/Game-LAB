import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 96, 92], density: 76, pulse: 1.2, seed: 12.5, shape: "impact" });
}
