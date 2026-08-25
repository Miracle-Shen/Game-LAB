import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [102,230,164], density: 86, pulse: 1.9, seed: 56.5, shape: "signal" });
}
