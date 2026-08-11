# Asset Roadmap Sheets

These sheets are 2D modeling references for the next GLB replacement pass. They are intentionally label-free for clean visual use; this README maps each sheet to the runtime IDs.

## Bird Expansion Sheet

File: `bird-expansion-sheet.png`

Left-to-right, top-to-bottom:

| Slot | Runtime ID | Target model |
| --- | --- | --- |
| 1 | `willow_wren` | `models/bird.glb` |
| 2 | `cardinal` | `models/cardinal.glb` |
| 3 | `blue_jay` | `models/blue_jay.glb` |
| 4 | `ruby_throated_hummingbird` | `models/ruby_throated_hummingbird.glb` |
| 5 | `red_tailed_hawk` | `models/red_tailed_hawk.glb` |
| 6 | `bald_eagle` | `models/bald_eagle.glb` |
| 7 | `snowy_owl_variant` | `models/snowy_owl_variant.glb` |
| 8 | `roadrunner` | `models/roadrunner.glb` |
| 9 | `hornbill` | `models/hornbill.glb` |
| 10 | `ostrich` | `models/ostrich.glb` |

## Insect, Plant, And Tree Sheet

File: `insect-plant-tree-sheet.png`

Left-to-right, top-to-bottom:

| Slot | Runtime ID | Target model |
| --- | --- | --- |
| 1 | `firefly` | `models/firefly.glb` |
| 2 | `bumblebee` | `models/bumblebee.glb` |
| 3 | `dragonfly` | `models/dragonfly.glb` |
| 4 | `grasshopper` | `models/grasshopper.glb` |
| 5 | `stag_beetle` | `models/stag_beetle.glb` |
| 6 | `daisy` | `models/daisy.glb` |
| 7 | `desert_marigold` | `models/desert_marigold.glb` |
| 8 | `arctic_poppy` | `models/arctic_poppy.glb` |
| 9 | `savanna_lily` | `models/savanna_lily.glb` |
| 10 | `bush` | `models/bush.glb` |
| 11 | `oak_tree` | `models/oak_tree.glb` |
| 12 | `palm_tree` | `models/palm_tree.glb` |
| 13 | `pine_tree` | `models/pine_tree.glb` |
| 14 | `baobab_tree` | `models/baobab_tree.glb` |

## Modular Character Sheet

File: `modular-character-sheet.png`

Use these as separate part references for a modular player kit. The live player remains composed from parts; `models/player.glb` is reserved as a legacy mannequin/reference model.

| Part group | Suggested future model IDs |
| --- | --- |
| Head shapes | `head_round`, `head_oval`, `head_square` |
| Hair | `hair_short`, `hair_curly` |
| Hats | `hat_field_cap`, `hat_sun_hat`, `hat_beanie`, `hat_crown` |
| Upper body | `top_explorer_shirt`, `top_rain_jacket`, `top_ranger_vest`, `top_sweater` |
| Lower body | `lower_trail_pants`, `lower_trail_shorts`, `lower_skirt` |
| Shoes | `shoes_hiking_boots`, `shoes_sneakers` |
| Accessories | `backpack_field`, `camera_strap`, `camera` |

## Export Notes

- Keep each GLB +Y up and origin-centered on its ground/contact point.
- Preserve clear species silhouettes; small birds and insects need exaggerated readable wings, beaks, crests, legs, or antennae.
- Author modular character parts around the current player proportions so pieces can swap without changing gameplay movement.
