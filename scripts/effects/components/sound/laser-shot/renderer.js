import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [92, 175, 255], density: 96, pulse: 2.5, seed: 17.1, shape: "signal" });
}
