import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,208,83], density: 108, pulse: 1.25, seed: 62.2, shape: "wave" });
}
