import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [173, 118, 255], density: 88, pulse: 2.1, seed: 19.3, shape: "wave" });
}
