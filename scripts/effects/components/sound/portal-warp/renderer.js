import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [181,118,255], density: 104, pulse: 1.6, seed: 31.4, shape: "wave" });
}
