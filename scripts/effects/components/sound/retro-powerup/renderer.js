import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [91,239,151], density: 96, pulse: 1.9, seed: 39.3, shape: "wave" });
}
