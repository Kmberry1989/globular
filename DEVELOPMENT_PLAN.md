# Globular Roam — Further Development Plan

## Current status

Milestone 0 implementation is substantially complete in the repository:

- mobile camera controls and notices have automated viewport/overlap checks;
- sound and reduced motion have an accessible, persisted settings panel;
- reduced motion affects both interface and 3D world motion;
- content, progression, economy, and save sanitization have fast rule tests;
- the full expedition test starts its own server and covers mobile settings;
- clean-checkout CI builds, runs rule tests, completes the browser route, and
  uploads browser artifacts on failure;
- current Vite architecture and verification guidance replaced prototype-era
  instructions.

The remaining Milestone 0 release gate is real-device completion of the first
Clover Commons stamp on iOS Safari and Android Chrome.

## Product direction

Build outward from the photography loop, not from the size of the world.

The recommended next release is **Living Field Guide**: make finding, observing,
framing, and keeping wildlife photographs meaningfully different from one
another. First Orbit already proves that the four-biome expedition can be
completed. The next milestone should prove that roaming and taking a better
photo is enjoyable even when it is not required by a quest.

Avoid adding multiplayer, accounts, a backend, or additional biomes until the
current 14 species support a deeper and replayable photography loop.

## Current baseline

Implemented:

- One seamless four-biome globe with desktop and touch movement.
- Four ranger requests and a complete hub-to-finale expedition.
- Fourteen species, seven required photographs, and eight collectible types.
- Camera framing, captured thumbnails, field guide, inventory, selling, and
  three equippable cosmetics plus the finale reward.
- Versioned local saves and IndexedDB photo storage.
- Day/night atmosphere, lightweight audio feedback, reduced-motion CSS, and
  fullscreen support.
- Player-readable and deterministic browser-test hooks.

Validated on 2026-07-26:

- `npm run build` passes.
- `npm run test:smoke` passes the complete desktop route, duplicate-photo
  rewards, photo persistence after reload, and a mobile emulation smoke flow.
- The current npm audit reports no known vulnerabilities.

Known gaps:

- Physical iOS Safari and Android Chrome touch behavior is not yet proven.
- The current mobile camera screenshot allows transient UI to compete with the
  shutter area; camera actions and safe areas need a real-device pass.
- The main game class is 1,130 lines and owns rendering, world construction,
  input, progression, audio, persistence, and test hooks.
- Progression tests rely heavily on teleport/framing helpers. They prove state
  transitions but not that a player can naturally find and frame every subject.
- There are no focused unit tests for content rules, save migration, economy,
  or chapter progression.
- The saved `sound` and `reducedMotion` settings have no complete in-game
  settings experience.
- The checked-in Copilot instructions and the legacy `smoke.js` describe the
  superseded single-file prototype.
- The bundled `models/` and `sprites/` libraries are not part of the current
  runtime art pipeline.
- `archiver` is present in the uncommitted dependency changes but is not used by
  application code. Decide whether it belongs to a future photo-export tool
  before incorporating it.

## Milestone 0 — Make the slice release-safe

Effort: 2–4 focused days.

This is the next work to do. It reduces regression risk before gameplay systems
start changing.

1. Verify touch controls on at least one real iPhone and one real Android phone.
   Cover movement while holding the joystick, context actions, camera drag,
   shutter, modal scrolling, rotation, safe areas, resume from background, and
   fullscreen behavior.
2. Fix camera-layer stacking so toasts, instructions, and photo results never
   cover the shutter or close control at small and short viewport sizes.
3. Add a visible settings panel for sound and reduced motion. Reduced motion
   must change wildlife bobbing, transitions, camera flash, and atmosphere—not
   only CSS animation.
4. Split automated checks into:
   - fast rule tests for biome boundaries, requirements, rewards, save
     sanitization, and migrations;
   - a short UI smoke test for startup, movement, camera, and modals;
   - the existing full expedition test.
5. Add CI that installs from the lockfile, builds, starts Vite, runs the test
   suites, and uploads browser artifacts only on failure.
6. Remove or replace the obsolete legacy smoke script and rewrite the stale
   repository instructions around the Vite modules.
7. Resolve the unused `archiver` dependency and decide whether generated
   screenshots are committed golden references or ignored run artifacts.

Exit criteria:

- No critical control is obscured at 320×568, 390×844, common Android sizes, or
  landscape orientation.
- Real iOS and Android sessions can complete the first Clover Commons stamp.
- CI passes from a clean checkout.
- Save v2 data survives an upgrade test and malformed saves fall back safely.
- Tests fail on a deliberately broken requirement, reward, or save migration.

## Milestone 1 — Make photography the game

Effort: 1–2 weeks.

### Photo quality

Give every shutter press an explainable score composed of:

- subject visibility;
- framing and center distance;
- subject size/distance;
- facing or pose;
- environmental bonus, such as habitat or time of day.

Show a short result card with the score breakdown, award bells only for a new
discovery or a new personal best, and keep the best photo for each species.
Scoring must be deterministic and expressed in `render_game_to_text`.

### Camera tools

- Add limited zoom with mouse wheel, keys, and an accessible touch control.
- Add focus feedback that distinguishes “too far,” “partly hidden,” “off
  center,” and “ready.”
- Let players compare the new shot with their current best before replacing it.
- Store score, capture time, biome, and optional pose metadata with each photo.
- Add a small album/detail view from the field guide; do not build a separate
  social-sharing system yet.

### Wildlife behavior

Give species a small authored behavior set rather than more geometry:

- idle, locomotion, and signature behavior;
- a habitat radius and preferred landmark;
- calm/alert state based on player distance;
- one photographable behavior bonus per species family.

Exit criteria:

- Every one of the 14 species can receive at least three distinguishable photo
  quality levels.
- A poor shot, a good shot, and a new-best shot produce different, testable
  outcomes.
- A player can understand how to improve a photo without reading documentation.
- Repeated photography does not become an unlimited currency exploit.

## Milestone 2 — Improve discovery and traversal

Effort: 1–2 weeks.

1. Give each biome a readable visual route: ranger hub, signature landmark,
   habitat pockets, and a transition landmark toward the next region.
2. Add a lightweight compass or field-note hint only after a player has searched
   unsuccessfully; preserve discovery instead of drawing permanent objective
   arrows to every subject.
3. Add collision and camera handling for trees, landmarks, and crowded habitat
   areas so the player and camera do not clip through focal objects.
4. Make day/night and weather affect encounters:
   - a few species become more likely or perform special behaviors;
   - lighting remains readable enough for photography;
   - no required species is locked behind a long real-time wait.
5. Add a nearby-subject sound/visual cue with separate accessibility controls.
6. Establish performance budgets and use instancing or shared geometry/materials
   where profiling shows value.

Exit criteria:

- A first-time player can reach each ranger without debug teleports.
- All required species can be naturally found in a recorded end-to-end run.
- No required encounter depends on waiting longer than two minutes.
- The game sustains 30 FPS on the selected lower-end mobile reference device
  and 60 FPS on a mid-range desktop reference.

## Milestone 3 — Turn requests into stories

Effort: 1–2 weeks.

Replace the current checklist-only progression with a small authored arc while
keeping First Orbit compact:

- each ranger gives an introduction, a mid-request observation, and a stamp
  handoff;
- one requirement per biome uses photo quality or behavior, not just species ID;
- one optional request per biome highlights a currently non-required species;
- completed requests add a field-note or habitat fact to the guide;
- the finale reflects optional discoveries and best-photo quality;
- post-finale roaming adds rotating local requests without invalidating the
  finished expedition.

Keep gathering supportive. Treasures should fund camera/outfit expression, not
gate the ability to finish the wildlife story.

Exit criteria:

- The required route takes roughly 35–60 minutes for a first-time player.
- Each biome introduces one new photography idea.
- Optional requests remain completable after the finale.
- Dialogue, objectives, and field-guide state restore correctly after reload.

## Milestone 4 — Build a maintainable content pipeline

Effort: about 1 week, overlapping with Milestones 1–3 as needed.

Refactor only along proven feature boundaries:

- `world/` — globe construction, placement, habitats, landmarks;
- `entities/` — player, ranger, wildlife, collectible factories and behavior;
- `systems/` — movement, interaction, photography, progression, atmosphere,
  audio, and persistence;
- `content/` — validated data for biomes, species, requests, rewards, and world
  placements;
- `ui/` — shell, modal controllers, guide, camera, outfitter, and settings;
- `testing/` — public deterministic harness separated from production logic.

Choose one intentional runtime art direction:

1. Keep procedural low-poly assets and remove misleading dormant asset docs; or
2. Introduce the GLB library through an asset registry with fallbacks, load
   progress, disposal, compression, and visual QA.

Do not migrate all systems at once. Extract one boundary when a milestone needs
it, preserve behavior with tests, then continue.

Exit criteria:

- Adding a species normally requires content data, an asset/shape definition,
  behavior selection, and tests—not edits across the central game loop.
- World placement data can be validated for unknown IDs and impossible
  requirements.
- Renderer resources and object URLs have explicit cleanup paths.
- Production builds do not expose mutation-oriented debug helpers unless a test
  build flag enables them.

## Milestone 5 — Public beta and v1 hardening

Effort: 1–2 weeks after the gameplay milestones.

- Add an installable offline-capable PWA shell if field testing shows that
  players value it.
- Add explicit save reset plus JSON export/import. Consider photo ZIP export
  separately; that is the only currently plausible need for `archiver`.
- Handle unavailable IndexedDB, storage quota errors, WebGL context loss, and
  audio-context suspension with player-facing recovery.
- Complete keyboard-only navigation, focus management, contrast, scalable text,
  reduced motion, mute, and non-audio feedback.
- Test save migration from every shipped save version.
- Run an external playtest with at least five first-time players and record:
  time to first photo, first stamp completion, confusion points, abandoned
  objectives, and favorite species.
- Create a release build, deployment preview, smoke check against the deployed
  URL, rollback instructions, and a concise known-issues list.

Release gates:

- No high-severity accessibility, save-loss, input, or progression defects.
- All critical flows pass on the supported browser/device matrix.
- A clean deployment passes the same smoke suite as local development.
- The current save schema and migration policy are documented.

## Suggested implementation order

The first ten work items should be:

1. Real-device first-stamp test and camera-overlay fixes.
2. Settings UI and complete reduced-motion behavior.
3. Rule-level test harness.
4. CI and clean-checkout validation.
5. Photo-score model and deterministic tests.
6. Photo result breakdown and best-shot persistence migration.
7. Field-guide photo detail/compare view.
8. Signature wildlife behaviors for the four required biome leads.
9. Natural-route Playwright test without teleporting subjects into frame.
10. Biome landmark and discovery-hint pass based on that natural-route test.

## Explicitly deferred

- Multiplayer or shared worlds.
- Login, cloud saves, or a server-authoritative economy.
- User-generated content or a level editor.
- More biomes before the current 14 species are differentiated.
- Randomized live-service challenges.
- Monetization.

These can be reconsidered after playtesting demonstrates that players return for
better photographs and optional discoveries.
