import { defineEffectComponent } from "../../../component-registry.js";
import { draw, getOrbPositions } from "./renderer.js";

function captureOrb(point, state, instance, now) {
  const positions = getOrbPositions(instance.width, instance.height, now - instance.start);
  const radius = Math.min(instance.width, instance.height) * 0.105;
  let best = -1;
  let bestDistance = radius;
  positions.forEach((position, index) => {
    if (state.custom.chain.includes(index)) return;
    const distance = Math.hypot(point.x - position.x, point.y - position.y);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  if (best !== -1) {
    state.custom.chain.push(best);
    state.custom.lastHit = now;
  }
}

export default defineEffectComponent({
  id: "chain-lightning",
  category: "game",
  draw,
  createState: () => ({ chain: [], lastInput: 0, lastHit: 0, releasedAt: 0 }),
  onPointerDown: ({ point, state, now, instance }) => {
    state.custom.chain = [];
    state.custom.lastInput = now;
    state.custom.releasedAt = 0;
    captureOrb(point, state, instance, now);
  },
  onPointerMove: ({ point, state, instance }) => {
    if (!state.pointer.down) return;
    state.custom.lastInput = state.now;
    captureOrb(point, state, instance, state.now);
  },
  onPointerUp: ({ state }) => {
    state.custom.releasedAt = performance.now();
    state.custom.lastInput = state.custom.releasedAt;
  },
  card: {
    index: "G-18", track: "SPELL COMBAT", tags: ["战斗", "技能", "连锁"],
    interaction: "按住并依次划过能量节点，连接越多目标，闪电链和倍率越强",
    title: "连锁闪电", subtitle: "CHAIN / TARGET ROUTE",
    summary: "节点捕获、路径导电、逐段增压和满链爆发让一次拖动产生清晰的战术连锁感。",
    sourceName: "Three.js Examples", sourceUrl: "https://github.com/mrdoob/three.js",
    license: "MIT", status: "TARGET CHAIN",
    notes: "参考 Three.js 后处理与粒子示例，目标捕获、路径顺序和闪电扰动均由独立 Canvas 组件实现。",
  },
});
