import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [238,177,117], density: 82, pulse: 1.9, seed: 51.9, shape: "wave" });
}
