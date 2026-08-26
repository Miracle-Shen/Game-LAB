import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [78, 242, 204], density: 80, pulse: 2.6, seed: 69.5, shape: "signal" });
}
