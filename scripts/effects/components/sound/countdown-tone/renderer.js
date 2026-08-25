import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 217, 92], density: 60, pulse: 1.55, seed: 20.4, shape: "signal" });
}
