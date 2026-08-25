import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [226, 210, 174], density: 78, pulse: 1.75, seed: 26.1, shape: "wave" });
}
