import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 192, 74], density: 72, pulse: 2.8, seed: 70.8, shape: "signal" });
}
