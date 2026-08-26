import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

const RUNNERS = [
  ["stick", "Canvas 火柴人"],
  ["player", "OpenGame · 参赛跑者"],
  ["youth", "OpenGame · 青年跑者"],
  ["auntie", "OpenGame · 女跑者"],
];

function controlsMarkup() {
  return `
    <label class="effect-select fighter-select">
      <span>RUNNER</span>
      <select data-runner-select aria-label="选择被扫描人物">
        ${RUNNERS.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
      </select>
    </label>`;
}

function mountDetail({ root, instance }) {
  const select = root.querySelector("[data-runner-select]");
  if (!select || !instance) return null;

  const applySelection = (replay = true) => {
    instance.interaction.custom.runner = select.value;
    if (replay) instance.interaction.custom.lastScan = performance.now();
  };
  const handleChange = () => applySelection();
  select.addEventListener("change", handleChange);
  applySelection(false);

  return {
    replay() {
      applySelection(false);
    },
    destroy() {
      select.removeEventListener("change", handleChange);
    },
  };
}

export default defineEffectComponent({
  id: "red-green-scan",
  category: "game",
  draw,
  createState: () => ({ lastScan: 0, runner: "stick" }),
  onPointerDown: ({ state, now }) => {
    state.custom.lastScan = now;
  },
  controlsMarkup,
  mountDetail,
  card: {
    index: "G-43", track: "SURVIVAL SIGNAL", tags: ["生存", "扫描", "失败反馈"], interaction: "点击重播红灯扫描；扫描触及移动角色时立即标记违规",
    title: "红灯移动侦测", subtitle: "RED LIGHT / MOTION DETECT", summary: "红灯亮起后扫描区掠过场地，并在检测到仍在移动的角色时完成锁定。",
    sourceName: "OpenGame · Red Light Green Light", sourceUrl: "https://yelonlft.github.io/OpenGame-landing-page/games/squidGame/index.html", license: "Apache-2.0", status: "SCAN ACTIVE",
    notes: "原子化呈现 OpenGame 生存演示中的红灯违规判定：只保留红灯亮起、扫描移动、角色被检出三个连续反馈。",
  },
});
