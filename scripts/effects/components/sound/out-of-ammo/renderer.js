import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [238,109,128], density: 64, pulse: 3.4, seed: 37.1, shape: "signal" });
}
