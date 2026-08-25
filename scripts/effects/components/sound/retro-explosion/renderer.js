import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,111,67], density: 106, pulse: 2.6, seed: 35.8, shape: "impact" });
}
