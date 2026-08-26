import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [102,226,216], density: 74, pulse: 1.4, seed: 118.3, shape: "wave" });
}
