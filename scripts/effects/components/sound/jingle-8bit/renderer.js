import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,206,85], density: 112, pulse: 1.35, seed: 50.8, shape: "wave" });
}
