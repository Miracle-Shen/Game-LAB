import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 216, 92], density: 62, pulse: 1.82, seed: 72.4, shape: "signal" });
}
