import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [130,210,255], density: 72, pulse: 2, seed: 34.7, shape: "signal" });
}
