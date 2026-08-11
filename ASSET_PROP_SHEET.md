# Globular Roam — required prop sheet

This is the replacement handoff for the next art pass. The game now routes biome dressing and arrival landmarks through the same GLB loader as wildlife, collectibles, and structures. Replace the files in `models/` in place; no layout or gameplay changes should be necessary.

## Export rules

| Requirement | Target |
| --- | --- |
| Format | Binary glTF 2.0 (`.glb`) |
| Orientation | +Y up, forward toward -Z |
| Origin | Centered on the ground contact point |
| Scale | Authored around 1 world unit ≈ 1 meter; runtime applies semantic spans |
| Materials | Readable low-poly PBR, roughness 0.65–0.9, no required environment map |
| Animation | Optional; simple loops only, with a static pose fallback |
| Budget | Aim for <50 KB per prop and <25k triangles for large landmarks |

## Active placeholder slots

These props are now loaded into the live world. They are the first replacement targets because they account for most of the remaining primitive presentation.

| Priority | Slot | Runtime file | Used in | Target authored span | Current fallback |
| --- | --- | --- | --- | ---: | --- |
| P0 | Meadow / biome tree | `models/tree.glb` | Grassland, desert, snow, safari dressing; safari arrival landmark | 1.0–3.4 m | Faceted trunk + crown |
| P0 | Desert cactus | `models/cactus.glb` | Desert dressing | 1.0–1.5 m | Capsule trunk + arms |
| P0 | Frost ice patch | `models/ice_patch.glb` | Snow dressing; frost arrival landmark | 0.9–2.8 m | Three crystal shards |
| P0 | Meadow station | `models/picnic_shelter.glb` | Clover Commons arrival landmark | 2.8 m | Cabin, roof, and camera lens |
| P0 | Desert arrival arch | `models/sandstone_ruins.glb` | Sunpetal Sands arrival landmark | 2.8 m | Two sandstone pillars + arch |

The P0 slots are intentionally shared where the same prop reads correctly at different scales. If a biome needs a bespoke silhouette later, add a new canonical filename instead of branching the layout code.

## Existing encounterable asset set

The 48 expanded encounterable models remain required and are already wired to the field guide, photography, gathering, inventory, selling, and persistence systems:

- Wildlife: 16 named GLBs across the four biomes, including `hedgehog`, `songbird`, `frog`, `squirrel`, `meerkat`, `desert_tortoise`, `roadrunner`, `gecko`, `seal`, `snowy_owl`, `arctic_hare`, `musk_ox`, `lion`, `hippo`, `warthog`, and `hornbill`.
- Collectibles: 16 named GLBs including `clover_mushroom`, `acorn`, `dewberry`, `wild_mint`, `cactus_fruit`, `desert_pearl`, `amber_shard`, `date_cluster`, `frostberry`, `pinecone`, `aurora_shell`, `snow_crystal`, `baobab_pod`, `amber_bead`, `river_reed`, and `painted_stone`.
- Structures: 16 named GLBs including windmills, bridges, shelters, wells, ruins, towers, igloos, and tents. The full list is in [`concept-art/glb-prop-sheets/README.md`](concept-art/glb-prop-sheets/README.md).

Use the nine existing concept sheets as the visual reference for that set. They are catalog sheets, not final production art.

## Next required character and equipment props

The ranger and camera slots are now model-backed runtime slots. The live player remains modular and procedural so it can move toward interchangeable parts; `models/player.glb` is used as a legacy mannequin/reference model in the world instead of replacing the player.

| Priority | Proposed file | Role | Notes |
| --- | --- | --- | --- |
| P1 | `models/ranger_grassland.glb` | Mira NPC | Compact readable silhouette; optional facial animation |
| P1 | `models/ranger_desert.glb` | Sol NPC | Hat and pack should be authored as named child nodes |
| P1 | `models/ranger_snow.glb` | Nivi NPC | Cold-weather silhouette, stable on a small globe patch |
| P1 | `models/ranger_safari.glb` | Kito NPC | Tall, warm-color silhouette with clear head/hand focus |
| P1 | `models/camera.glb` | Held camera prop | Separate lens node for the camera-strap cosmetic |
| P1 | `models/player.glb` | Legacy roamer mannequin | Placed as a world reference; do not use as the live modular player |

## New bird, insect, plant, and tree slots

The field guide now saves photos for wildlife, plants/finds, trees, shrubs, and landmarks. The expanded bird/insect/environment pass is active in the world and has label-free concept sheets in [`concept-art/asset-roadmap-sheets/`](concept-art/asset-roadmap-sheets/).

| Group | Active runtime IDs |
| --- | --- |
| Birds | `willow_wren`, `cardinal`, `blue_jay`, `ruby_throated_hummingbird`, `red_tailed_hawk`, `bald_eagle`, `snowy_owl_variant`, plus existing `songbird`, `roadrunner`, `snowy_owl`, `hornbill`, and `ostrich` |
| Insects | `firefly`, `bumblebee`, `dragonfly`, `grasshopper`, `stag_beetle`, plus existing `butterfly` and `ladybug` |
| Flowers and plants | `daisy`, `bluebell`, `red_clover`, `black_eyed_susan`, `lavender_spike`, `desert_marigold`, `prickly_pear_blossom`, `desert_lupine`, `evening_primrose`, `firecracker_penstemon`, `arctic_poppy`, `edelweiss`, `alpine_forget_me_not`, `glacier_lily`, `purple_saxifrage`, `savanna_lily`, `flame_lily`, `bird_of_paradise_flower`, `aloe_bloom`, `acacia_blossom`, plus existing biome plants and gatherables |
| Trees and shrubs | `bush`, `oak_tree`, `palm_tree`, `pine_tree`, `baobab_tree`, plus shared `tree` dressing |
| Existing model variants | `lion_variant`, `snowy_owl_variant`, `ranger_watchtower_variant`, `safari_tent_variant` |

The original generic `models/bird.glb` is now assigned to `willow_wren`, making it a specific bird instead of a catch-all bird slot.

## Modular player direction

The player should move toward swappable part GLBs instead of a single full-body `player.glb`. Use `modular-character-sheet.png` as the visual reference for these future part slots:

- Head and hair: `head_round`, `head_oval`, `head_square`, `hair_short`, `hair_curly`
- Hats: `hat_field_cap`, `hat_sun_hat`, `hat_beanie`, `hat_crown`
- Upper body: `top_explorer_shirt`, `top_rain_jacket`, `top_ranger_vest`, `top_sweater`
- Lower body: `lower_trail_pants`, `lower_trail_shorts`, `lower_skirt`
- Shoes and accessories: `shoes_hiking_boots`, `shoes_sneakers`, `backpack_field`, `camera_strap`, `camera`

## VFX reference pack

Weather is currently procedural and does not need GLBs. The production handoff still needs four small, transparent texture/material studies: pollen motes, rain streaks, snowflakes, and dust/haze. Keep them legible on a 390×844 mobile frame and avoid text, logos, or watermarks.

## Acceptance checklist

- [ ] Silhouette reads at the default camera distance and at 390×844.
- [ ] Ground contact is clean after runtime span normalization.
- [ ] Materials remain readable in clear, rain, snow, and night lighting.
- [ ] GLB opens in Three.js without external texture URLs.
- [ ] Existing gameplay still passes with the asset removed, using the procedural fallback.
