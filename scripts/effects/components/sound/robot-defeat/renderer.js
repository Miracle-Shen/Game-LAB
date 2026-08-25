import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [104,211,226], density: 90, pulse: 2.5, seed: 40.4, shape: "signal" });
}
