import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,213,81], density: 74, pulse: 2.25, seed: 107.3, shape: "signal" });
}
