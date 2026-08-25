import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,213,82], density: 82, pulse: 2.1, seed: 28.1, shape: "signal" });
}
