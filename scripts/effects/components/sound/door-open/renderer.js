import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [213, 158, 107], density: 70, pulse: 0.95, seed: 25.9, shape: "wave" });
}
