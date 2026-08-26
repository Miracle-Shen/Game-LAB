import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [87,211,255], density: 74, pulse: 2.25, seed: 103.3, shape: "signal" });
}
