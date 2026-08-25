import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [255,86,96], density: 92, pulse: 3.2, seed: 32.5, shape: "signal" });
}
