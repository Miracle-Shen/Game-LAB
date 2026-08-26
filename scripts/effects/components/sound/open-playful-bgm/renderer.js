import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [103,225,164], density: 74, pulse: 1.4, seed: 110.3, shape: "wave" });
}
