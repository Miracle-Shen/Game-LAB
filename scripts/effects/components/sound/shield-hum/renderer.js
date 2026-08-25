import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [79,219,255], density: 108, pulse: 1.45, seed: 43.1, shape: "wave" });
}
