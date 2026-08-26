import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [196, 205, 215], density: 104, pulse: 2.4, seed: 68.6, shape: "impact" });
}
