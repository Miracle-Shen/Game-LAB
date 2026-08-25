import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [173,221,255], density: 62, pulse: 3, seed: 49.7, shape: "impact" });
}
