const CASE_CATEGORIES = new Set(["game", "music", "sound"]);

class EffectComponentRegistry {
  #components = new Map();

  register(component) {
    if (!component?.id || !CASE_CATEGORIES.has(component.category)) {
      throw new TypeError("Effect components require an id and a supported category.");
    }
    if (this.#components.has(component.id)) {
      throw new Error(`Effect component already registered: ${component.id}`);
    }
    if (typeof component.draw !== "function") {
      throw new TypeError(`Effect component renderer is missing: ${component.id}`);
    }
    const expectedHash = `#/${component.category}/${component.id}`;
    if (component.hash !== expectedHash) {
      throw new Error(`Effect component hash must be ${expectedHash}: ${component.id}`);
    }
    const registered = Object.freeze(component);
    this.#components.set(component.id, registered);
    return registered;
  }

  get(id) {
    return this.#components.get(id);
  }

  has(id) {
    return this.#components.has(id);
  }

  list() {
    return [...this.#components.values()];
  }
}

export function defineEffectComponent(config) {
  if (!config?.id || !config?.category || !config?.card?.title) {
    throw new TypeError("defineEffectComponent requires id, category and card metadata.");
  }
  return Object.freeze({
    createState: () => ({}),
    ...config,
    hash: `#/${config.category}/${config.id}`,
    card: Object.freeze({
      ...config.card,
      id: config.id,
      component: config.id,
    }),
  });
}

export const effectComponentRegistry = new EffectComponentRegistry();
