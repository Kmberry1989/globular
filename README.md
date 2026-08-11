# Globular Roam — First Orbit

A mobile-first cozy first-person photography expedition built with Vite and Three.js.

Travel around a seamless tiny planet from an eye-height explorer view, photograph wildlife, insects, plants, trees, finds, and landmarks, gather natural treasures, help four local rangers, fill a persistent field guide, and return home after earning every biome stamp.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown by Vite.

## Controls

- Move: thumbstick, WASD, or arrow keys
- Camera: on-screen camera button or `C`
- Photograph: shutter button or `Space`
- Interact/gather: context button or `E`
- Field guide: book button or `G`
- Settings: gear button
- Full screen: utility button or `F`
- Exit camera/full screen: `Esc`

## Expedition route

1. Clover Commons — photograph a meadow butterfly and gather two starflowers.
2. Sunpetal Sands — photograph the dune camel and gather a sunpetal.
3. Frostcap Reach — photograph a penguin and a polar bear.
4. Goldenleaf Wilds — photograph a zebra, giraffe, and elephant.
5. Return to Mira in Clover Commons to complete First Orbit.

Wildlife is recorded through photography and is never added to inventory. Plants, trees, finds, structures, fish, and shoreline creatures are also photographable field-guide subjects; there is no fishing mechanic.

The playable camera is first-person in both roaming and camera mode. The modular player body is hidden during normal play to avoid self-occlusion; `models/player.glb` remains available as a legacy roamer mannequin/reference model.

## Asset Direction

The model folder is now an active runtime registry. Every root `models/*.glb` file has an owner in `src/content.js`, and the game loads wildlife, collectibles/plants, structures, world props, rangers, and the camera through the same model library.

- `models/bird.glb` is now the specific `willow_wren` model.
- New bird placeholders include eagle, cardinal, hawk, blue jay, hummingbird, and owl variants.
- New insect placeholders include firefly, bumblebee, dragonfly, grasshopper, and stag beetle.
- New plant/tree placeholders include identifiable flowers, bush, oak, palm, pine, and baobab variants.
- The live player remains modular. `models/player.glb` is used as a legacy roamer mannequin/reference model while future player work moves toward swappable head, hat, top, lower-body, shoe, and accessory parts.

Reference sheets for the new asset pass are in `concept-art/asset-roadmap-sheets/`; the broader GLB replacement handoff is in `ASSET_PROP_SHEET.md`.

## Verification

```bash
npm run test:unit
npm run build
npm run test:smoke
```

`test:unit` covers content, progression, economy, and save sanitization without
starting WebGL. The smoke command starts its own strict-port Vite server,
completes the full expedition in Chromium, checks mobile controls and settings,
then shuts the server down. Set `GLOBULAR_ROAM_URL` to test an already-running
or deployed build instead.

Run every local gate with:

```bash
npm run test:all
```

The game exposes:

- `window.render_game_to_text()` for concise, player-relevant state.
- `window.advanceTime(ms)` for deterministic frame stepping.

Browser artifacts are written under `output/playwright/first-orbit/` by default. The asset-expansion proof run is checked in under `output/playwright/asset-expansion/`.

## Project structure

- `src/game.js` — Three.js world, movement, progression, interactions, and finale.
- `src/photography.js` — viewfinder targeting and render-target photo capture.
- `src/progression.js` — pure request progress and economy rules.
- `src/ui.js` — mobile HUD, dialogs, field guide, outfitter, and finale.
- `src/content.js` — biomes, photo subjects, model registries, requests, collectibles, and cosmetics.
- `src/persistence.js` — versioned saves and IndexedDB photo storage.
- `test/` — fast content, progression, economy, and save tests.
- `.github/workflows/ci.yml` — clean-checkout build and browser verification.
