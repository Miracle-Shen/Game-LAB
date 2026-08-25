import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,97,79], density: 116, pulse: 2.45, seed: 44.2, shape: "impact" });
}
