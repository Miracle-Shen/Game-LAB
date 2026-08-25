import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,151,75], density: 124, pulse: 1.15, seed: 46.4, shape: "wave" });
}
