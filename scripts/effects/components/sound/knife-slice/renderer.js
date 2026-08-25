import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [139, 225, 235], density: 86, pulse: 2.25, seed: 27.2, shape: "impact" });
}
