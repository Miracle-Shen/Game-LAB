import { defineEffectComponent } from "../../../component-registry.js";
import { draw, PARRY_CYCLE } from "./renderer.js";

export default defineEffectComponent({
  id: "critical-parry",
  category: "game",
  draw,
  createState: () => ({ result: "idle", resultTime: 0, streak: 0 }),
  onPointerDown: ({ point, state, now, instance }) => {
    const radius = Math.min(instance.width, instance.height) * 0.3;
    const inside = Math.hypot(point.x - instance.width * 0.5, point.y - instance.height * 0.62) < radius;
    const phase = ((now - instance.start) % PARRY_CYCLE) / PARRY_CYCLE;
    const error = Math.abs(phase - 0.74);
    const result = inside && error < 0.055 ? "perfect" : inside && error < 0.12 ? "block" : "miss";
    state.custom.result = result;
    state.custom.resultTime = now;
    state.custom.streak = result === "perfect" ? state.custom.streak + 1 : result === "block" ? state.custom.streak : 0;
  },
  card: {
    index: "G-17", track: "COMBAT FEEDBACK",
    interaction: "在攻击环收束到金色判定区时点击，打出格挡或完美弹反",
    title: "临界弹反", subtitle: "PARRY / TIMING WINDOW",
    summary: "预警收束、精确判定、命中停顿、反击闪光和连胜计数共同强化高风险时机反馈。",
    sourceName: "Godot Demo Projects", sourceUrl: "https://github.com/godotengine/godot-demo-projects",
    license: "MIT", status: "PRECISION PARRY",
    notes: "参考 Godot 官方输入与 2D 动画示例，判定窗口、连胜状态和所有战斗图形均在组件内程序化实现。",
  },
});
