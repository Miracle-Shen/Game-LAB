import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [112, 246, 178], density: 58, pulse: 1.9, seed: 9.2, shape: "signal" });
}
