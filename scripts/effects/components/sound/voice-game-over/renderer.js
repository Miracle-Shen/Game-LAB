import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [214,105,128], density: 106, pulse: 1.1, seed: 59.8, shape: "wave" });
}
