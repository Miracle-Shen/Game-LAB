import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [150, 221, 255], density: 96, pulse: 1.45, seed: 3.7, shape: "impact" });
}
