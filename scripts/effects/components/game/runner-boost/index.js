import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "runner-boost", category: "game", draw,
  createState: () => ({ lastJump: 0, lastPickup: 0, coinCount: 0 }),
  onPointerDown: ({ state, now }) => {
    state.custom.lastJump = now;
    state.custom.lastPickup = now;
    state.custom.coinCount += 1;
  },
  card: {
    index: "G-12", track: "CLASSIC GAME", tags: ["探索", "移动", "加速"],
    interaction: "移动控制跑道位置，点击触发跳跃和加速反馈",
    title: "跑酷冲刺", subtitle: "RUNNER / SPEED BOOST",
    summary: "透视路面、速度线、金币轨迹和跳跃动作构成跑酷游戏的高速场景。",
    sourceName: "Godot 3D Platformer Coin", sourceUrl: "https://github.com/godotengine/godot-demo-projects/tree/master/3d/platformer/coin",
    license: "MIT", status: "ENDLESS RUNNER",
    notes: "参考 Godot 3D Platformer 的金币场景：币体持续旋转并带外发光，点击跳跃时触发隐藏、16 粒子爆发和计数反馈。",
  },
});
