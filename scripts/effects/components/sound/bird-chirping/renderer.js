import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [124, 230, 128], density: 92, pulse: 1.6, seed: 63.1, shape: "wave" });
}
