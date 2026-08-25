import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [248,178,87], density: 94, pulse: 1.55, seed: 42.6, shape: "wave" });
}
