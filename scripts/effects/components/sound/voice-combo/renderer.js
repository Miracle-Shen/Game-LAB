import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,117,79], density: 98, pulse: 1.55, seed: 61.1, shape: "signal" });
}
