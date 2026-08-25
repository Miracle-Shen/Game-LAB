import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 174, 210], density: 52, pulse: 1.15, seed: 5.2, shape: "wave" });
}
