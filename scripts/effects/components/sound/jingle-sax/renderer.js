import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [247,125,148], density: 78, pulse: 2, seed: 53.2, shape: "signal" });
}
