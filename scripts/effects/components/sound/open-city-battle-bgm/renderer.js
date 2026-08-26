import { drawSoundWaveform } from "../../../shared/sound-waveform.js";

export function draw(ctx, w, h, t, intensity) {
  drawSoundWaveform(ctx, w, h, t, intensity, { accent: [93,194,255], density: 74, pulse: 1.4, seed: 117.3, shape: "wave" });
}
