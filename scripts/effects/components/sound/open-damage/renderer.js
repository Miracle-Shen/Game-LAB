import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [239,83,98], density: 88, pulse: 2.25, seed: 105.3, shape: "impact" });
}
