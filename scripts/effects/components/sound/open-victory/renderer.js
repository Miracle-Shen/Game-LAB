import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,198,79], density: 74, pulse: 1.4, seed: 108.3, shape: "wave" });
}
