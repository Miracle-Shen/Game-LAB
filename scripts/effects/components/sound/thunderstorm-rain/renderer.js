import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [103, 182, 255], density: 120, pulse: 0.85, seed: 64.2, shape: "wave" });
}
