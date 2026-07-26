# Asset Replacement Guide

## Overview

Globular Roam now supports custom assets for models, sounds, and character sprites. All placeholder files have been created in organized directories ready for you to replace.

---

## 📁 Directory Structure

```
globularroam/
├── models/                    # 3D model replacements (.glb files)
├── sounds/                    # Audio replacements (.wav files)
├── sprites/                   # Character sprite parts (.png files)
│   └── config.json           # Sprite metadata and asset catalog
├── index.html                # Main game file
├── create_placeholders.js    # Script that created models/sounds
└── create_sprite_placeholders.js  # Script that created sprites
```

---

## 🎨 3D Models (GLB Format)

### What to Replace

27 placeholder `.glb` files in `/models/`:

**Collectable Items:**
- `apple.glb`, `orange.glb`, `flower.glb`, `bush.glb`, `butterfly.glb`, `ladybug.glb`, `firefly.glb`, `fish.glb`

**Environment & Structures:**
- `tree.glb`, `cactus.glb`, `ice_patch.glb`

**Animals:**
- `bird.glb`, `penguin.glb`, `polarbear.glb`, `camel.glb`, `zebra.glb`, `giraffe.glb`, `elephant.glb`
- `redpanda.glb`, `fox.glb`, `ostrich.glb`, `crab.glb`
- `monkey.glb`, `koala.glb`, `flamingo.glb`, `feline.glb`

**Interactive:**
- `coin.glb` (with emissive glow applied in code)

### Integration

Models are loaded automatically via [GLTFLoader](https://cdn.jsdelivr.net/npm/three@r128/examples/js/loaders/GLTFLoader.js) at entity spawn time. Animations and behaviors defined in `updateWildlife(delta)` apply transforms to your models.

**Key Considerations:**
- GLB format (binary glTF 2.0) is required
- Models should be centered at origin (0,0,0)
- Scale: ~1 unit = 1 meter in-game (most entities 0.5-2 units)
- Animations work via Three.js `AnimationMixer` if embedded in GLB
- Procedural animations (coin bobbing, monkey climbing, etc.) apply to mesh root transforms

### How to Create

1. **Blender Workflow:**
   - Model your asset
   - Export → glTF 2.0 Binary (.glb)
   - Place in `models/` folder

2. **Online Tools:**
   - [Sketchfab](https://sketchfab.com/) (download .glb versions)
   - [Three.js Editor](https://threejs.org/editor/) (export .glb)

---

## 🔊 Sound Assets (WAV Format)

### What to Replace

13 placeholder `.wav` files in `/sounds/`:

- `gather.wav` - Item collection (ascending tone)
- `sell.wav` - Selling items (major third)
- `click.wav` - UI interactions (sine pulse)
- `weather.wav` - Weather changes (low drone)
- `fish.wav` - Fishing success (rising pitch)
- `levelup.wav` - Quest/reward completion (triumphant)
- `coin.wav` - Coin collection/pickup (chime)
- `birdcall.wav` - Bird sounds (chirps)
- `monkey.wav` - Monkey chatter (ooh-ooh)
- `koala.wav` - Koala calls (low groan)
- `flamingo.wav` - Flamingo sounds (squawks)
- `feline.wav` - Cat/feline sounds (meows/growls)
- `fox.wav` - Fox sounds (barks)

### Fallback System

If a `.wav` file is **empty or missing**, the game automatically falls back to procedural tone generation. This ensures the game always works.

### Integration

Sounds load asynchronously during game init via `loadSoundAssets()`. They're played by the `playSoundAsset(name)` function.

**Specifications:**
- Format: WAV (uncompressed or MP3 also supported)
- Sample rate: 44.1 kHz or 48 kHz recommended
- Bit depth: 16-bit PCM
- Duration: 0.1s to 2s per sound
- Avoid silence padding

### How to Create

1. **DAW Workflow (Audacity, Ableton, etc.):**
   - Record or generate sound
   - Trim to 0.1-2 second duration
   - Export as WAV (16-bit, 44.1 kHz)
   - Place in `sounds/` folder

2. **Online Sound Libraries:**
   - [Freesound.org](https://freesound.org/) (filter by CC0/CC-BY)
   - [Zapsplat](https://www.zapsplat.com/)
   - [OpenGameArt](https://opengameart.org/)

---

## 🎭 Character Sprites & Customization

### Directory Structure

```
sprites/
├── head_round.png           # Head shapes
├── head_square.png
├── head_oval.png
├── torso_default.png        # Torso styles
├── torso_muscular.png
├── torso_slim.png
├── lower_default.png        # Lower body (pants/dress)
├── lower_shorts.png
├── lower_dress.png
├── hair_short.png           # Hair styles
├── hair_long.png
├── hair_curly.png
├── hair_spiky.png
├── eyes_normal.png          # Facial features
├── eyes_happy.png
├── eyes_sleepy.png
├── eyes_surprised.png
├── hat_cap.png              # Hat accessories
├── hat_tophat.png
├── hat_crown.png
├── hat_beanie.png
├── hat_cowboy.png
├── umbrella_red.png         # Carry items
├── umbrella_blue.png
├── backpack_red.png
├── backpack_green.png
└── config.json              # Asset metadata
```

### Customization System Features

**Player Customization Modal (on startup):**
- **Skin Color:** 6 selectable color swatches (applied to head)
- **Hair Color:** 6 selectable color swatches (applied to hair shape)
- **Head Shape:** radio buttons for round/square/oval
- **Hair Style:** buttons for short/long/curly/spiky
- **Torso Style:** buttons for default/muscular/slim
- **Lower Body:** buttons for default pants/shorts/dress
- **Eyes:** buttons for normal/happy/sleepy/surprised
- **Hats:** hat_cap, hat_beanie (free); others locked until purchased
- **Carry Items:** umbrellas and backpacks (locked until purchased via shops)

**In-Game Purchase System:**
- Open any NPC shop (Tom Nook, Sahara, Olaf, Blathers)
- Accessories listed with costs
- Click to purchase if you have enough bells
- Newly unlocked accessories available in customization modal

### Currently Implemented (Code-based)

The character is currently **composed procedurally from 3D geometry** in `createPlayer()`:
- Skin color applied to head sphere/box/cone
- Hair color applied to hair sphere overlay
- Eyes rendered as black spheres with style-based positioning
- Hats rendered as 3D cones/cylinders/boxes
- Carry items rendered as umbrellas (cones) and backpacks (boxes)

### How to Switch to Sprite-Based Characters (Optional)

If you want to replace the 3D character with 2D canvas sprites:

1. **Create sprite sheets:** PNG images for each body part (e.g., 64×64px each)
2. **Compose in code:** Update `createPlayer()` to use canvas/sprite rendering instead of 3D meshes
3. **Apply colors:** Use canvas `fillStyle` + `globalCompositeOperation` to colorize layers

**Example (pseudocode):**
```javascript
function createPlayerSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Draw body parts in order
    drawSprite(ctx, spriteMap['lower_' + state.lowerStyle], 0, 32);
    drawSprite(ctx, spriteMap['torso_' + state.torsoStyle], 0, 16);
    
    // Apply color filter to skin
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = hexToRGB(state.skinColor);
    ctx.fillRect(0, 0, 64, 64);
    
    // Continue with head, hair, eyes, accessories...
}
```

### Sprite Configuration (config.json)

Pre-generated file with metadata:

```json
{
  "bodyParts": {
    "head": ["head_round", "head_square", "head_oval"],
    "torso": ["torso_default", "torso_muscular", "torso_slim"],
    "lower": ["lower_default", "lower_shorts", "lower_dress"]
  },
  "hair": ["hair_short", "hair_long", "hair_curly", "hair_spiky"],
  "eyes": ["eyes_normal", "eyes_happy", "eyes_sleepy", "eyes_surprised"],
  "accessories": [
    { "name": "hat_cap", "type": "hat", "locked": false, "cost": 0 },
    { "name": "hat_tophat", "type": "hat", "locked": true, "cost": 500 },
    ...
  ]
}
```

---

## 🔧 Implementation Details

### Audio Loading Flow

1. Game starts → `init()` calls `loadSoundAssets()`
2. Each sound file fetched from `/sounds/{name}.wav`
3. Decoded into Web Audio API `AudioBuffer`
4. Cached in `audioBuffers` object
5. On SFX trigger: `playSoundAsset(name)` plays cached buffer or falls back to tone generation

### Model Loading Flow

1. Entity spawn → `spawnProceduralEntity(phi, theta, isInitial)` called
2. Loops through entity types and creates meshes
3. **GLB models:** (Future) load via `GLTFLoader` and clone
4. **Currently:** procedural Three.js geometries (fallback)
5. Models positioned at `(phi, theta)` on globe

### Character Composition

1. Customization modal displays options on game start
2. Player selections stored in `state` object:
   - `state.skinColor` → applied to head
   - `state.hairColor` → applied to hair
   - `state.headShape`, `state.hairStyle`, etc.
3. `createPlayer()` builds character from selections
4. Preview renderer in modal updates in real-time

---

## 📋 Replacement Checklist

- [ ] **Models:** Replace 27 `.glb` files with your own
- [ ] **Sounds:** Replace 13 `.wav` files with your own
- [ ] **Sprites:** (Optional) Create `.png` sprite sheets for each body part
- [ ] **Test locally:** `python3 -m http.server 8000` → visit `localhost:8000`
- [ ] **Verify customization:** Player preview shows your colors/styles
- [ ] **Test sounds:** Collect items, sell, complete quests → hear audio
- [ ] **Test models:** Entities spawn with new visuals

---

## 💡 Tips & Troubleshooting

**Q: Models don't appear**
- A: Ensure GLB format, proper centering, and ~1-2 unit scale
- Check browser console for load errors

**Q: Sounds not playing**
- A: Fallback tone generation will trigger automatically
- Ensure WAV files are valid and in `/sounds/` folder
- User must interact with page first (browser autoplay policy)

**Q: Character preview looks wrong**
- A: Colors applied procedurally; ensure `state.skinColor` and `state.hairColor` are valid hex values
- Sprite PNGs are placeholders; code still uses 3D geometry

**Q: Accessories locked even after purchase**
- A: Item is added to `state.unlockedAccessories`
- Confirm shop NPC has accessory in their `accessories` array
- Check `ACCESSORIES_CATALOG` for correct naming

**Q: Performance issues**
- A: Max 400 entities on screen; adaptive spawn rate kicks in at 80% capacity
- GLB models should be optimized (< 50KB per file for performance)

---

## 🚀 Next Steps

1. **Immediate:** Replace a few key files (coin, apple, gather sound) and test
2. **Then:** Replace remaining models and sounds iteratively
3. **Optional:** Create sprite sheets and refactor character rendering to use them
4. **Polish:** Add custom animations to GLB files, or trigger procedural animations from animation names

---

## 📚 Resources

- **Three.js GLTFLoader Docs:** https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Blender glTF Export:** https://docs.blender.org/manual/en/latest/addons/io_scene_gltf2/index.html
- **Sprite Composition:** [Canvas Composite Operations](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

