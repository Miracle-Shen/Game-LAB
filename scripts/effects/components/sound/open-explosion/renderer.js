import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,112,61], density: 88, pulse: 2.25, seed: 104.3, shape: "impact" });
}
