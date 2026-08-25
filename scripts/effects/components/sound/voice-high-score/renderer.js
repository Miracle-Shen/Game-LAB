import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [119,218,255], density: 100, pulse: 1.3, seed: 60.9, shape: "wave" });
}
