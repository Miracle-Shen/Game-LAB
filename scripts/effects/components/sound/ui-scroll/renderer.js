import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [186, 156, 255], density: 92, pulse: 2.4, seed: 11.4, shape: "wave" });
}
