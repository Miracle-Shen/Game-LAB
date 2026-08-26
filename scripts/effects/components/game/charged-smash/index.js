import { defineEffectComponent } from "../../../component-registry.js";
import { fighterControlMarkup, mountFighterControl } from "../../../shared/fighter-library.js";
import { draw } from "./renderer.js";

const controlsMarkup = () => fighterControlMarkup({ stateKey: "fighter" });

export default defineEffectComponent({
  id: "charged-smash",
  category: "game",
  draw,
  createState: () => ({ charging: false, chargeStart: 0, lastInput: 0, impacts: [], fighter: "stick" }),
  onPointerDown: ({ state, now }) => {
    state.custom.charging = true;
    state.custom.chargeStart = now;
    state.custom.lastInput = now;
  },
  onPointerMove: ({ state }) => {
    if (state.pointer.down) state.custom.lastInput = state.now;
  },
  onPointerUp: ({ state, instance }) => {
    const now = performance.now();
    const power = Math.max(0.15, Math.min(1, (now - state.custom.chargeStart) / 1400));
    state.custom.impacts.push({
      x: state.pointer.x || instance.width * 0.5,
      y: state.pointer.y || instance.height * 0.62,
      power,
      time: now,
    });
    state.custom.impacts = state.custom.impacts.slice(-4);
    state.custom.charging = false;
    state.custom.lastInput = now;
  },
  controlsMarkup,
  mountDetail: ({ root, instance }) => mountFighterControl({ root, instance, stateKey: "fighter" }),
  card: {
    index: "G-19", track: "ACTION COMBAT", tags: ["战斗", "蓄力", "冲击"],
    interaction: "按住积蓄力量并移动落点，松开后根据蓄力等级制造不同规模的重击",
    title: "蓄力重击", subtitle: "HOLD / IMPACT RELEASE",
    summary: "持续聚能、目标跟随、武器压缩、地面裂纹与分级冲击波形成完整的蓄力释放闭环。",
    sourceName: "Godot Demo Projects", sourceUrl: "https://github.com/godotengine/godot-demo-projects",
    license: "MIT", status: "CHARGE RELEASE",
    notes: "参考 Godot 官方 2D 粒子与输入示例；人物可独立选择 Canvas 火柴人或本案例内的 OpenGame 角色资源。",
  },
});
