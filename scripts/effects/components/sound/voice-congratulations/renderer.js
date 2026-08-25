import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,190,82], density: 104, pulse: 1.2, seed: 58.7, shape: "wave" });
}
