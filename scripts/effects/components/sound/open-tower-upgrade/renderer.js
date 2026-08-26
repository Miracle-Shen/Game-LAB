import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,218,91], density: 74, pulse: 2.25, seed: 77.3, shape: "signal" });
}
