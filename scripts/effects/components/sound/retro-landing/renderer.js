import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [111,198,255], density: 68, pulse: 3.1, seed: 30.3, shape: "impact" });
}
