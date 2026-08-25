import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [143, 255, 178], density: 46, pulse: 1.35, seed: 6.6, shape: "signal" });
}
