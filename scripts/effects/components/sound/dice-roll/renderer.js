import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [244, 244, 236], density: 84, pulse: 1.7, seed: 22.6, shape: "impact" });
}
