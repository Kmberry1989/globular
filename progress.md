Original prompt: Implement the approved “Globular Roam: First Orbit” mobile-first photography vertical slice, replacing fishing with wildlife photography, a four-biome expedition, field guide, quests, persistence, modular Vite/Three.js structure, deterministic test hooks, and a finale.

## 2026-07-26

- Began from the existing single-file Cozy Globe prototype.
- Confirmed the current GLB, WAV, and sprite directories contain placeholders; the new slice will use a deliberate procedural low-poly style and only rely on real bundled assets.
- Initialized Git and committed the untouched original prototype as `6486d40`.
- Replaced the single-file app with a modular Vite/Three.js implementation.
- Implemented the four-biome First Orbit route, ranger requests, wildlife photography, field-guide thumbnails in IndexedDB, gathering, outfitter cosmetics, versioned saves, and finale.
- Added `render_game_to_text`, deterministic `advanceTime`, and a full-route Playwright test.
- First browser pass caught a camera-overlay transition bug when a photograph completed a biome; fixed by exiting camera mode before showing the stamp response.
- Full desktop route, duplicate-photo rewards, save reload, and seven persisted photo thumbnails now pass.
- Verified mobile layout at 390×844 with touch input for opening the camera; no horizontal overflow and both primary controls remain visible.
- Visually inspected start, all four regions, first-person camera, persisted field guide, mobile HUD, invalid-shot feedback, and finale screenshots.
- The official web-game client confirmed real keyboard movement, camera entry, empty-shot feedback, state output, and no browser errors.
- `npm run build`, `npm run test:smoke`, and `git diff --check` pass.
- Physical-device Safari/Chrome touch testing remains a release follow-up; it cannot be proven by browser emulation alone.
- Audited the completed slice to plan further development. Re-ran the production build and full expedition browser test successfully, and confirmed no currently reported npm vulnerabilities.
- Added `DEVELOPMENT_PLAN.md`. The recommended next release is “Living Field Guide”: first harden real-device input and testing, then deepen photo quality, camera tools, and wildlife behavior before adding more biomes.
- Planning pass found follow-ups for the next implementation session: the mobile camera layer needs real-device safe-area/stacking QA; `game.js` needs incremental feature-boundary extraction; saved sound/reduced-motion settings need a complete UI; the Copilot instructions and legacy smoke script are stale; and the uncommitted `archiver` dependency is not referenced by runtime code.
- Began Milestone 0 hardening. Added an in-game settings panel with persisted sound and reduced-motion switches. Reduced motion now calms CSS transitions, player bounce, wildlife bobbing/wing motion, collectible pulsing, sky rotation, and camera flash.
- Camera-mode toasts now move to a safe top position instead of covering the mobile shutter. Added safe-area-aware mobile viewfinder, focus label, close button, instructions, and shutter placement.
- The official web-game client exercised onboarding, keyboard movement, opening settings, and enabling reduced motion; `render_game_to_text` reported the new setting and the visually inspected settings panel rendered correctly without console errors.
- Extracted reusable progression rules for requirement progress, biome completion, and inventory value. Added nine fast Node tests covering biome mapping/chapter order, photo and gathering requirements, economy totals, independent default saves, valid sanitization, and malformed-save fallback.
- Strengthened the mobile browser route to assert that the shutter and close button remain inside the viewport, camera notices do not overlap the shutter, both settings update accessible switch state, and settings persist after reload.
- Added a self-contained smoke runner that starts Vite on a strict port, completes the browser route, and shuts the server down. `npm run test:all` now runs all rule, build, and browser gates locally.
- Added clean-checkout GitHub Actions verification with failure-only browser artifact upload. Replaced the obsolete single-file smoke script and prototype-era Copilot instructions, and updated the README for the current controls, modules, and test commands.
- Final local Milestone 0 verification: all 9 rule tests, production build, full desktop expedition, persistence reload, mobile camera layout, accessible settings state, and mobile settings reload pass. Real iOS Safari and Android Chrome first-stamp runs remain the only unverified Milestone 0 release gate.

## 2026-07-30

- Added the Expanded Biome Entity Catalog: 16 optional wildlife discoveries, 16 gatherables, and 16 non-blocking low-poly structures across the four existing biomes. First Orbit requirements remain unchanged.
- Added the future-art `MODEL_ASSETS` registry plus `npm run assets:placeholders`, which safely creates 48 canonical, valid named GLB placeholders without overwriting existing art.
- Extended content and persistence tests for catalog counts, placement integrity, unchanged requirements, and expanded save data. The full browser route now photographs and gathers one new entity per biome and checks world totals (30 wildlife, 29 collectibles, 16 structures).
- Verified `npm run test:unit`, `npm run build`, `git diff --check`, and the isolated full browser route. Visually inspected the expanded Safari gameplay screenshot. Real-device mobile testing remains a separate release gate.

## 2026-08-10

- Replaced placeholder entity presentation with live Draco GLB loading and canonical model publishing.
- Added semantic model spans to preserve realistic size relationships across animals, resources, and structures; strengthened sky/fill lighting and added biome forecasts with rain, snow, pollen, dust, and haze particles.
- Verified the live Frost flurry with the deterministic weather hook: 64 GLBs loaded, zero failures, expected weather state, readable model lighting, and correctly scaled watchtower, bridge, animals, and resources. `npm run test:unit`, `npm run build`, and `git diff --check` pass. The legacy full smoke runner reached the fourth biome again but did not emit its completion marker in this host session; the deterministic live weather check is the completed browser proof for this pass.

## 2026-08-10 — biome prop model pass

- Routed the globe's repeated tree, cactus, and ice-cluster dressing through cached GLB slots, replacing those primitive presentations when `tree.glb`, `cactus.glb`, or `ice_patch.glb` loads successfully.
- Routed the four biome arrival landmarks through model slots: `picnic_shelter.glb`, `sandstone_ruins.glb`, `ice_patch.glb`, and `tree.glb`. Procedural landmark geometry remains the decode/missing-asset fallback.
- Added `WORLD_PROP_ASSETS` coverage and `ASSET_PROP_SHEET.md` with export rules, P0 replacement slots, the existing 48-asset catalog, and the next player/ranger/camera requirements.
- `npm run test:unit` passes all 13 tests; `npm run build` and `git diff --check` pass. The browser route reached the snow scene and the inspected screenshot shows loaded snow props and landmark geometry. A fresh smoke run did not emit its final completion marker in this host session, matching the known runner limitation; no browser error was reported before the route stopped.

## 2026-08-11 — active bird, insect, plant, and modular character asset pass

- Expanded the active world with named bird species including `willow_wren`, `cardinal`, `blue_jay`, `ruby_throated_hummingbird`, `red_tailed_hawk`, and `bald_eagle`; `models/bird.glb` is now assigned to the specific `willow_wren` subject.
- Added the first insect batch (`firefly`, `bumblebee`, `dragonfly`, `grasshopper`, `stag_beetle`) plus plant/tree variants (`daisy`, `desert_marigold`, `arctic_poppy`, `savanna_lily`, `bush`, `oak_tree`, `palm_tree`, `pine_tree`, `baobab_tree`) and placed them in the globe layout.
- Converted the photo system from wildlife-only to shared photo subjects, so plants, trees, finds, structures, and landmarks can save photos into the field guide alongside animals while First Orbit requirements remain unchanged.
- Wired `ranger_grassland`, `ranger_desert`, `ranger_snow`, `ranger_safari`, and `camera` as runtime model slots. The live player remains modular; `models/player.glb` is used as a legacy roamer mannequin/reference model.
- Added concept sheets in `concept-art/asset-roadmap-sheets/` for bird expansion, insect/plant/tree variants, and modular character parts. Future GLB replacements should use those sheets plus `ASSET_PROP_SHEET.md`.

## 2026-08-11 — first-person perspective pass

- Converted roaming and camera mode from a third-person chase/orbit presentation to an eye-height first-person view while preserving the existing tiny-planet movement, biome progression, gathering, and photo-subject systems.
- Hid the procedural player body during roaming and camera mode so the modular character/legacy mannequin geometry does not occlude the view. `models/player.glb` remains available for non-playable/reference use.
- Added first-person view state to `window.render_game_to_text()` so browser tests and future QA can confirm the active perspective, camera position, and player-body visibility.
- Kept the runtime camera model attached when a fresh expedition rebuilds the player rig, preserving active use of the camera asset slot.
- Split collectible visuals from their photo focus markers and preserved structure focus markers during GLB replacement, so first-person photo targeting still works after model swaps for plants, trees, finds, and landmarks.
- Reduced ranger GLB spans for first-person readability, moved the legacy mannequin out of the opening biome, and guarded atmosphere updates against invalid transient test coordinates.

## 2026-08-11 — expanded flower pass

- Added 16 more named, identifiable flower photo subjects and gatherables: `bluebell`, `red_clover`, `black_eyed_susan`, `lavender_spike`, `prickly_pear_blossom`, `desert_lupine`, `evening_primrose`, `firecracker_penstemon`, `edelweiss`, `alpine_forget_me_not`, `glacier_lily`, `purple_saxifrage`, `flame_lily`, `bird_of_paradise_flower`, `aloe_bloom`, and `acacia_blossom`.
- Placed the new flowers across grassland, desert, snow, and safari without changing First Orbit stamp requirements.
- Added per-flower model spans, generated canonical missing `models/<flower-id>.glb` placeholders, and added `flower-expansion-sheet.png` as the modeling reference map.
- Extended content tests and the browser smoke route to prove one new flower photo from each biome saves into the field guide.
- Updated the model loader so generated triangle placeholders reserve canonical GLB slots without replacing the clearer procedural fallback visuals.

## 2026-08-13 — first-person walking stride pass

- Added subtle camera-space walking bob, lateral sway, forward micro-shift, and roll while roaming; camera/photo mode remains steady for framing.
- Wired the stride effect through Reduced motion and exposed compact stride state in `render_game_to_text()` for browser verification.
- Extended the browser smoke route to assert idle, walking, camera-mode, and Reduced motion stride behavior.
- Hardened weather selection so stale or invalid forecast indexes cannot throw during long browser smoke routes.

## 2026-08-15 — object GLB import pass

- Renamed all 83 `models/object*.glb` imports to descriptive runtime filenames. Existing canonical model slots now use the supplied low-poly GLBs, and no root model file still begins with `object`.
- Added the unrepresented animal batch as optional wildlife photo subjects: rabbit, sheep, cow, chicken, deer, lizard, scorpion, snake, dolphin, aquatic turtle, walrus, moose, whale, rhino, duck, parrot, seagull, and an ostrich variant.
- Added imported environmental prop slots for hay, clover, ferns, rocks, logs, cacti, succulents, pools, shrubs, platforms, fences, and tree variants so every renamed GLB is owned by the runtime asset registry.
- Updated the smoke route to wait for the app/test hook and model-settled status instead of global network idle, which is too strict now that the first world load fetches many more GLBs.
- Verified `npm run test:unit`, `npm run build`, `git diff --check`, and `GLOBULAR_ROAM_OUTPUT_DIR=output/playwright/object-glb-import npm run test:smoke`; the smoke run completed all four stamps, saved 17 field-guide photos, restored persistence, and passed mobile layout/settings checks.
