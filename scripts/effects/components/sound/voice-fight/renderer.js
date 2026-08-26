import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 156, 63], density: 74, pulse: 2.05, seed: 74.3, shape: "voice" });
}
