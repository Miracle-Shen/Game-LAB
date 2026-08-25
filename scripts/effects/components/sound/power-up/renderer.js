import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [102, 255, 191], density: 68, pulse: 1.8, seed: 18.2, shape: "signal" });
}
