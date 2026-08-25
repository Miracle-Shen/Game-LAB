import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [127, 221, 126], density: 54, pulse: 0.9, seed: 15.8, shape: "wave" });
}
