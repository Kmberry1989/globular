Globular Roam — Local run & smoke-test

Quick start

1. Start a simple static server from the project root:

```bash
# Python 3
python3 -m http.server 8000
```

2. Open the game in your browser:

http://localhost:8000/index.html

Quick smoke-test checklist

- Confirm the globe renders and the player avatar appears at the North pole.
- Use the on-screen joystick (or mouse drag) to move the globe — verify player movement direction is intuitive.
- Walk into nearby entities and confirm items collect (floating text appears, inventory updates).
- Open shops by approaching a `shop` entity — confirm NPC greeting appears in the shop modal.
- Approach coins — verify coins rotate, bob, and pickup awards `bells` and shows floating coin text.
- Find flamingos, monkeys, koalas, felines, foxes and observe animations and occasional sounds.
- Press `F` near water to open fishing modal and test casting.

Developer notes

- Main file: `index.html` (single-file app: HTML + CSS + JS)
- Important symbols:
  - `spawnProceduralEntity()` — entity spawn logic
  - `updateWildlife(delta)` — per-entity animation behaviors
  - `ITEM_TYPES`, `BIOMES`, `SHOP_NPCS` — content lists to edit
  - `state` — central non-reactive game state

Next recommended steps

- Run the game locally and test interactions.
- If frame drops appear on low-end hardware, I can add an entity cap and LOD.
- Optional: replace procedural SFX tones with short audio files for richer sound.

If you want, I can add a small performance cap (e.g., max 400 entities) and a UI toggle to limit spawns.
