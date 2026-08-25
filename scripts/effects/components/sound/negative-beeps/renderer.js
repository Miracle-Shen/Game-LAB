import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 91, 91], density: 64, pulse: 2.2, seed: 2.4, shape: "signal" });
}
