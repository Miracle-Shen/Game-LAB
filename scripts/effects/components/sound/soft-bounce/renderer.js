import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 146, 197], density: 48, pulse: 1.4, seed: 16.9, shape: "impact" });
}
