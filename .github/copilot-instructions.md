# Copilot Instructions for Globular Roam

## Product

Globular Roam: First Orbit is a mobile-first cozy field-guide photography game.
Players travel around one seamless tiny planet, photograph wildlife, insects,
plants, trees, finds, and landmarks, gather natural treasures, help four
rangers, fill a persistent field guide, and return to Clover Commons for the
finale.

Wildlife is photographed and never collected as inventory. Plants, trees, finds,
structures, fish, and shoreline animals are also field-guide subjects; there is
no fishing mechanic.

The current product direction is documented in `DEVELOPMENT_PLAN.md`. Deepen the
photography and wildlife-observation loop before adding more biomes, multiplayer,
accounts, or backend systems.

## Runtime architecture

- `src/main.js` creates the UI, loads the save, and starts the game.
- `src/game.js` owns the Three.js scene and coordinates game systems.
- `src/photography.js` handles camera targeting and captured image data.
- `src/progression.js` contains pure requirement and economy rules.
- `src/content.js` contains biome, photo-subject, model-registry, request,
  collectible, structure, and cosmetic data.
- `src/persistence.js` sanitizes/version-saves local progress and stores photos
  in IndexedDB.
- `src/ui.js` renders and binds the start screen, HUD, camera, dialogs, field
  guide, outfitter, settings, and finale.
- `src/styles.css` contains the responsive and reduced-motion presentation.

The world currently uses an intentional procedural low-poly treatment with GLB
replacement slots. Root `models/*.glb` files are active runtime assets owned by
`MODEL_ASSETS`, `WORLD_PROP_ASSETS`, or `CHARACTER_MODEL_ASSETS`; keep new model
paths represented in those registries and placed in `WORLD_LAYOUT` when they
should appear in-game.

`models/bird.glb` is intentionally the specific `willow_wren` model. The live
player remains modular/procedural; `models/player.glb` is used as a legacy
roamer mannequin/reference model rather than the controllable player. Use
`concept-art/asset-roadmap-sheets/` and `ASSET_PROP_SHEET.md` for the current
bird, insect, plant/tree, ranger, camera, and modular character direction.

## Gameplay invariants

- The biome order is grassland → desert → snow → safari → return home.
- A stamp is earned only when every authored requirement for the current biome
  is complete.
- Duplicate photographs do not grant another discovery reward.
- Gathering changes inventory and lifetime totals; selling clears inventory but
  must not erase lifetime quest progress.
- Saves are treated as untrusted data and sanitized against known photo-subject,
  collectible, biome, and cosmetic IDs.
- A fresh expedition clears both local progress and stored photo thumbnails.
- Settings persist with the expedition. Reduced motion affects 3D motion and
  flashes as well as CSS animation.
- Critical camera controls must remain inside safe areas and unobstructed at
  phone sizes.

Put reusable rules in `src/progression.js` or another pure system module rather
than duplicating them in UI and scene code.

## Input and accessibility

- Move: thumbstick, WASD, or arrow keys.
- Camera: on-screen camera button or `C`.
- Shutter: on-screen button or `Space` while in camera mode.
- Interact/gather: context button, `E`, or `Space` while roaming.
- Field guide: book button or `G`.
- Fullscreen: utility button or `F`; `Esc` exits camera/fullscreen.

Keep pointer controls compatible with simultaneous mobile input. Do not allow
toasts, modals, or safe-area changes to cover the shutter or close button.
Maintain button labels, focus behavior, `role="switch"` state, keyboard
navigation, and reduced-motion behavior when changing UI.

## Verification

Use small implementation steps and run the relevant fast tests first:

```bash
npm run test:unit
npm run build
npm run test:smoke
```

`npm run test:all` runs all three gates. The smoke command starts and stops its
own Vite server unless `GLOBULAR_ROAM_URL` points to an existing build.

For gameplay changes:

1. Exercise the affected multi-step flow, not only the final state.
2. Inspect `window.render_game_to_text()` and ensure it matches the visuals.
3. Use `window.advanceTime(ms)` for deterministic stepping.
4. Inspect the latest relevant browser screenshots.
5. Check browser console and page errors.
6. Append material decisions, fixes, verification, and remaining device-only
   work to `progress.md`.

Use the test-only helpers under `window.__globularTest` for state-transition
coverage. Also preserve at least one route that uses real player input when the
feature concerns discoverability, traversal, or controls.

Browser artifacts are written under `output/playwright/first-orbit/` by default.
The checked-in asset-expansion proof run is under
`output/playwright/asset-expansion/`. The complete route includes desktop
progression, duplicate-photo economy, plant/tree photo capture, IndexedDB
thumbnails, save reload, mobile safe-area controls, settings, and settings
persistence.
