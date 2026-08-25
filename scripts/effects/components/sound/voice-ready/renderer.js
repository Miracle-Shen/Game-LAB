import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [130,198,255], density: 82, pulse: 1.7, seed: 55.4, shape: "wave" });
}
