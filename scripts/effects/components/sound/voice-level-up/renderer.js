import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [161,229,94], density: 94, pulse: 1.45, seed: 57.6, shape: "wave" });
}
