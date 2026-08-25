import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [209, 166, 255], density: 68, pulse: 0.72, seed: 7.3, shape: "wave" });
}
