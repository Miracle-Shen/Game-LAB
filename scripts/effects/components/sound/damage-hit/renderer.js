import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,77,104], density: 62, pulse: 3.5, seed: 38.2, shape: "impact" });
}
