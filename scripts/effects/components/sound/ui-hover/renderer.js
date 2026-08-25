import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [126,204,255], density: 76, pulse: 2.25, seed: 48.6, shape: "signal" });
}
