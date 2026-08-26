import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [91, 221, 180], density: 72, pulse: 1.55, seed: 71.1, shape: "impact" });
}
