import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [95,224,188], density: 78, pulse: 2.7, seed: 29.2, shape: "signal" });
}
