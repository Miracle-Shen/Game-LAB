import { existsSync, readdirSync } from "node:fs";
import { categoryCases } from "./data.js";
import { getRegisteredEffectComponents } from "./effects.js";

const components = getRegisteredEffectComponents();
const componentById = new Map(components.map((component) => [component.id, component]));
const cardKeys = new Set();
const errors = [];

["game", "music", "sound"].forEach((category) => {
  const categoryUrl = new URL(`./effects/components/${category}/`, import.meta.url);
  readdirSync(categoryUrl, { withFileTypes: true }).forEach((entry) => {
    if (entry.isFile() && entry.name.endsWith(".js")) {
      errors.push(`${category}/${entry.name}: flat component files are forbidden`);
    }
    if (entry.isDirectory()) {
      const component = componentById.get(entry.name);
      if (!component || component.category !== category) {
        errors.push(`${category}/${entry.name}: case directory is not registered`);
      }
    }
  });
});

Object.entries(categoryCases).forEach(([category, cases]) => {
  cases.forEach((item) => {
    const key = `${category}/${item.id}`;
    const component = componentById.get(item.component);
    cardKeys.add(key);
    if (item.id !== item.component) errors.push(`${key}: id must equal component`);
    if (!component) errors.push(`${key}: component is not registered`);
    if (component && component.category !== category) errors.push(`${key}: category mismatch`);
    if (component && component.hash !== `#/${key}`) errors.push(`${key}: hash mismatch`);
    if (component && component.card !== item) errors.push(`${key}: card metadata must come from its component`);
    if (component?.renderer) errors.push(`${key}: renderer must be imported inside the case directory`);
    if (category === "game" && (!Array.isArray(item.tags) || item.tags.length < 2)) {
      errors.push(`${key}: game card requires at least two tags`);
    }
    const directoryUrl = new URL(`./effects/components/${category}/${item.id}/`, import.meta.url);
    if (!existsSync(new URL("index.js", directoryUrl))) errors.push(`${key}: index.js is missing`);
    if (!existsSync(new URL("renderer.js", directoryUrl))) errors.push(`${key}: renderer.js is missing`);
    if (item.motion && !item.motion.src.includes(`/components/${category}/${item.id}/assets/`)) {
      errors.push(`${key}: motion asset must live inside the case directory`);
    }
    if (item.motion && !existsSync(new URL(item.motion.src))) {
      errors.push(`${key}: motion asset does not exist`);
    }
    if (item.audio && !item.audio.src.includes(`/components/${category}/${item.id}/assets/`)) {
      errors.push(`${key}: audio asset must live inside the case directory`);
    }
    if (item.audio && !existsSync(new URL(item.audio.src))) {
      errors.push(`${key}: audio asset does not exist`);
    }
  });
});

components.forEach((component) => {
  const key = `${component.category}/${component.id}`;
  if (!cardKeys.has(key)) errors.push(`${key}: registered component has no card`);
});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${cardKeys.size} cards and ${components.length} effect components.`);
}
