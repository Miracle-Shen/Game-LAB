import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [129,230,119], density: 88, pulse: 2.25, seed: 78.3, shape: "impact" });
}
