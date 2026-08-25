import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 216, 104], density: 58, pulse: 1.7, seed: 1.1, shape: "signal" });
}
