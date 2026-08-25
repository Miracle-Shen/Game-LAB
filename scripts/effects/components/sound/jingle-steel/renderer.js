import { drawSoundWaveform } from "../../../shared/sound-waveform.js";
export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [112,229,207], density: 94, pulse: 1.55, seed: 52.1, shape: "wave" });
}
