import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,100,69], density: 88, pulse: 2.8, seed: 54.3, shape: "impact" });
}
