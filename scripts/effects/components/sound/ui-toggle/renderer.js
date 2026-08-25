import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 192, 92], density: 42, pulse: 2.5, seed: 10.3, shape: "impact" });
}
