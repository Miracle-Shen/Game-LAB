# Repository Rules

## One Directory Equals One Case

Every visible effect card must be a self-contained, route-addressable component directory. This is a required repository invariant.

The only accepted layout is:

```text
scripts/effects/components/{category}/{case-id}/
├── index.js       # component contract, card metadata, state and event hooks
├── renderer.js    # all case-specific rendering code
└── assets/        # every image, video, audio or model used by this case
```

Rules:

1. The directory name is the public case ID: `card.id === card.component === component.id === directory name`.
2. The canonical URL is `#/{category}/{case-id}` and is derived by `defineEffectComponent`; do not hand-write another detail URL.
3. `index.js` must export one `defineEffectComponent(...)` value and contain that case's complete card metadata in `card`.
4. `renderer.js` must contain the case-specific rendering implementation. Do not place case renderers in `scripts/effects.js` or a central renderer map.
5. Component-specific state and pointer handlers belong in the case directory.
6. Every local asset used by a case must be below that case's `assets/` directory. Do not add case assets to a global `assets/` folder.
7. Only genuinely generic, case-agnostic utilities may live in `scripts/effects/shared/`. The runtime in `scripts/effects.js` handles Canvas lifecycle, sizing, timing and pointer dispatch only.
8. Register each directory in `scripts/effects/components/index.js`. `scripts/data.js` consumes card metadata from this manifest and must not duplicate case definitions.
9. Existing directory names and hashes are public links. Do not rename them without an explicit redirect or migration request.
10. A new card is incomplete until its directory, renderer, metadata, registration, Hash route and any local assets all exist.

Before completing any case change, run:

```bash
node --check scripts/app.js scripts/data.js scripts/effects.js scripts/effects/component-registry.js
node scripts/validate-components.mjs
```

The validator must report equal card and component counts with no mapping, directory or asset errors.
