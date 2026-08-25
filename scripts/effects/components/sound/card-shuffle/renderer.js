import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [231, 205, 170], density: 112, pulse: 1.35, seed: 21.5, shape: "wave" });
}
