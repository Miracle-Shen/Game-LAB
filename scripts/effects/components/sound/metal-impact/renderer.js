import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [181, 207, 224], density: 104, pulse: 1.6, seed: 13.6, shape: "impact" });
}
