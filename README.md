# Globular Roam — First Orbit

A mobile-first cozy photography expedition built with Vite and Three.js.

Travel around a seamless tiny planet, photograph wildlife, gather natural treasures, help four local rangers, fill a persistent field guide, and return home after earning every biome stamp.

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

Wildlife is recorded through photography and is never added to inventory. Fish and shoreline creatures remain photographable field-guide subjects; there is no fishing mechanic.

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

Browser artifacts are written under `output/playwright/first-orbit/`.

## Project structure

- `src/game.js` — Three.js world, movement, progression, interactions, and finale.
- `src/photography.js` — viewfinder targeting and render-target photo capture.
- `src/progression.js` — pure request progress and economy rules.
- `src/ui.js` — mobile HUD, dialogs, field guide, outfitter, and finale.
- `src/content.js` — biomes, species, requests, collectibles, and cosmetics.
- `src/persistence.js` — versioned saves and IndexedDB photo storage.
- `test/` — fast content, progression, economy, and save tests.
- `.github/workflows/ci.yml` — clean-checkout build and browser verification.
