import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [118, 227, 255], density: 46, pulse: 2.8, seed: 8.1, shape: "signal" });
}
