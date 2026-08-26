export const OPEN_GAME_FIGHTERS = Object.freeze([
  ["chunli", "Chun-Li"],
  ["ryu", "Ryu"],
  ["goku", "Goku"],
  ["vegeta", "Vegeta"],
  ["nezha", "Nezha"],
  ["aobing", "Ao Bing"],
  ["kyo", "Kyo"],
  ["iori", "Iori"],
  ["monkeyking", "Monkey King"],
  ["erlangshen", "Erlang Shen"],
  ["jotaro", "Jotaro"],
  ["dio", "Dio"],
]);

export const OPEN_GAME_FIGHTER_PAIRS = Object.freeze([
  ["kyo-iori", "Kyo / Iori", ["kyo", "iori"]],
  ["chunli-ryu", "Chun-Li / Ryu", ["chunli", "ryu"]],
  ["goku-vegeta", "Goku / Vegeta", ["goku", "vegeta"]],
  ["nezha-aobing", "Nezha / Ao Bing", ["nezha", "aobing"]],
  ["monkeyking-erlangshen", "Monkey King / Erlang Shen", ["monkeyking", "erlangshen"]],
  ["jotaro-dio", "Jotaro / Dio", ["jotaro", "dio"]],
]);

const pairById = new Map(OPEN_GAME_FIGHTER_PAIRS.map(([id, , fighters]) => [id, fighters]));

export function getFighterPair(id) {
  return pairById.get(id) || null;
}

export function fighterControlMarkup({ mode = "single", stateKey = "fighter", defaultValue = "stick" } = {}) {
  const choices = mode === "pair"
    ? [["stick", "Canvas 火柴人"], ...OPEN_GAME_FIGHTER_PAIRS.map(([id, label]) => [id, `OpenGame · ${label}`])]
    : [["stick", "Canvas 火柴人"], ...OPEN_GAME_FIGHTERS.map(([id, label]) => [id, `OpenGame · ${label}`])];
  const ariaLabel = mode === "pair" ? "选择对阵人物" : "选择人物";
  return `
    <label class="effect-select fighter-select">
      <span>${mode === "pair" ? "FIGHTERS" : "FIGHTER"}</span>
      <select data-fighter-select="${stateKey}" aria-label="${ariaLabel}">
        ${choices.map(([value, label]) => `<option value="${value}"${value === defaultValue ? " selected" : ""}>${label}</option>`).join("")}
      </select>
    </label>`;
}

export function mountFighterControl({ root, instance, stateKey = "fighter", onChange }) {
  const select = root.querySelector(`[data-fighter-select="${stateKey}"]`);
  if (!select || !instance) return null;

  const applySelection = (restart = true) => {
    instance.interaction.custom[stateKey] = select.value;
    if (restart) onChange?.({ instance, value: select.value });
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

export function fighterAssetUrlsFromModules(modules) {
  return Object.fromEntries(Object.entries(modules).map(([path, url]) => [path.split("/").pop().replace(".png", ""), url]));
}

export function createFighterImageLoader(assetUrls) {
  const cache = new Map();
  return (fighter, pose = "neutral") => {
    if (!fighter || fighter === "stick" || typeof Image === "undefined") return null;
    const key = `${fighter}_${pose}`;
    const src = assetUrls[key];
    if (!src) return null;
    if (!cache.has(key)) {
      const image = new Image();
      image.src = src;
      cache.set(key, image);
    }
    return cache.get(key);
  };
}

export function drawFighterImage(ctx, image, {
  x,
  y,
  size,
  facing = 1,
  rotation = 0,
  alpha = 1,
  glow = "#ffffff",
  blur = 12,
  anchorY = 0.72,
} = {}) {
  if (!image?.complete || !image.naturalWidth) return false;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = glow;
  ctx.shadowBlur = blur;
  ctx.drawImage(image, -size * 0.5, -size * anchorY, size, size);
  ctx.restore();
  return true;
}
