import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [175,102,255], density: 88, pulse: 2.25, seed: 109.3, shape: "impact" });
}
