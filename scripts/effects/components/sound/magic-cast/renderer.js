import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [180, 112, 255], density: 86, pulse: 2.2, seed: 66.3, shape: "signal" });
}
