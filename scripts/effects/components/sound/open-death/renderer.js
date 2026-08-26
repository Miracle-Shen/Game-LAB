import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [174,91,123], density: 74, pulse: 1.4, seed: 106.3, shape: "wave" });
}
