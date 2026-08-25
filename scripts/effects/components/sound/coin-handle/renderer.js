import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 210, 77], density: 94, pulse: 1.65, seed: 24.8, shape: "wave" });
}
