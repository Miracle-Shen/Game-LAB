import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [182, 196, 206], density: 118, pulse: 3.1, seed: 4.8, shape: "wave" });
}
