import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [88,163,221], density: 120, pulse: 0.9, seed: 45.3, shape: "wave" });
}
