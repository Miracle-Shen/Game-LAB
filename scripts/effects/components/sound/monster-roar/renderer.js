import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 111, 76], density: 74, pulse: 1.1, seed: 67.7, shape: "impact" });
}
