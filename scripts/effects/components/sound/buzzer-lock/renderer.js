import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255, 91, 78], density: 82, pulse: 2.35, seed: 73.7, shape: "signal" });
}
