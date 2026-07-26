# Copilot Instructions for Globular Roam

## Project Overview
**Cozy Globe 3D** is a single-file interactive 3D globe game built with Three.js and Tailwind CSS. Players explore procedurally-spawned biomes, collect items from diverse wildlife and vegetation, and trade treasures with NPCs for currency ("Bells").

**Key File:** `index.html` (634 lines, contains all HTML, CSS, and JavaScript)

## Architecture & Core Systems

### 1. Three.js Scene Structure
- **Globe:** 50-unit radius sphere at world origin, textured with live sky gradient
- **Player:** Red cylinder body positioned at north pole (0, GLOBE_RADIUS, 0), navigates via latitude/longitude (phi/theta)
- **Atmosphere:** Rotating sun/moon orbit, star field, dynamic weather particles, lens flare effects
- **Entities:** 160+ procedurally-spawned objects (trees, animals, NPCs, weather)

**Key coordinates:** Player phi=π/2 (north pole), theta=0. Entities positioned via spherical coordinates and oriented to face globe surface.

### 2. Biome System
Four rotating regions with distinct visuals and spawning patterns:
```javascript
BIOMES: {
  GRASSLAND: (0° < theta < 120°) - trees, flowers, insects
  DESERT: (120° < theta < 240°) - cacti, camels
  SNOW: (60° < theta < 120°) - penguins, polar bears
  SAFARI: (0° < theta < 60°) - zebras, giraffes, elephants
}
```
Biome selection via `getBiomeAt(phi, theta)` based on longitude slices. Water spawns procedurally via sine wave.

### 3. Game State Management
Central `state` object (JavaScript object, not reactive):
```javascript
state = {
  bells: 0, inventory: [], time: 0, weather: 'clear',
  playerPhi/Theta, weatherIntensity, skyMode, moonPhase
}
```
Updates propagate via direct mutation. No centralized store—UI updates manually triggered after state changes.

### 4. Procedural Spawning
- **Rate:** ~0.8% chance per frame to spawn new entity (pseudo-random)
- **Collision checks:** 8-unit minimum spacing, 22-unit safety zone around player, water detection
- **Type distribution:** 12% clouds, 4% birds, 2% NPCs (house/shop), remainder environment/wildlife
- **Animation:** Entities use sine-wave patterns for movement (birds, butterflies, animals bob/drift)

## Essential Developer Workflows

### Adding New Item Types
1. Add entry to `ITEM_TYPES` object (emoji, base value, color for rendering)
2. Update `spawnProceduralEntity()` spawn probabilities
3. Add mesh generation code in entity creation section
4. Add collect logic to `checkCollisions()` if harvestable
5. Update inventory emoji rendering in `updateInventoryUI()`

### Modifying Biome Content
Edit `getBiomeAt()` return values to change latitude boundaries, or modify spawn logic in `spawnProceduralEntity()` conditional blocks. Biome colors defined in `BIOMES.{KEY}.ground`.

### Weather/Sky Effects
- Weather transitions happen in `changeWeather()` (60-second intervals)
- Sky color gradient computed in `updateAtmosphere()` based on day cycle progress
- Particle system (`weatherParticles`) controlled by weather state and intensity
- Rare sky modes ("pink"/"purple") roll every 2 minutes in `rollSkyMode()`

### Performance Tuning
- **Globe spawn:** Initial 160 entities set in `createGlobe()` loop
- **Entity limit:** No hard cap; watch for lag with >500+ entities on lower-end devices
- **Camera frustum:** Default 75° FOV, positioned 14 units away from player
- **Rendering:** WebGL renderer, shadow mapping enabled for directional sun

## Critical Patterns & Conventions

### Joystick Input Handling
Mobile-first: `setupControls()` normalizes touch/mouse input into `joystick.dx/dy` (-1 to 1 range). Player rotation calculated via `Math.atan2(dx, dy)`. Movement blocked if water detected unless player on bridge.

### Audio System
Minimal Web Audio API—no pre-loaded sounds. `playTone()` generates sine/triangle waves:
- Gather: 440→660 Hz ascending
- Sell: 523→659 Hz (major third)
- Click: 300 Hz sine pulse
Audio context must be resumed on first user interaction due to browser autoplay policy.

### Collision & Interaction
`isPositionOccupied()` checks grid cells. `checkCollisions()` uses continuous distance checks (<2.5 units triggers interaction). Different entity types have different radii (NPCs: 45 units, wildlife: 22 units).

### Time System
- **Day cycle:** 480 seconds (8 minutes) per complete sun orbit
- **Sun intensity:** Varies 0.1 (night) → 1.0 (noon) based on `cycleProgress`
- **Firefly visibility:** Only visible during twilight hours
- **Moon phases:** Visual effect (no gameplay impact)

## Integration Points

### External Dependencies
- **Three.js r128** (CDN): All 3D rendering
- **Tailwind CSS** (CDN): UI styling (glass morphism with backdrop blur)
- **Canvas API:** Dynamic sky texture, lens flare generation

### Browser APIs
- **WebGL/WebGLRenderer:** Core rendering
- **Web Audio API:** Sound generation (requires context resume)
- **Touch/Pointer Events:** Mobile input, joystick tracking
- **requestAnimationFrame:** 60 FPS animation loop

### No Build Step
Single-file architecture—changes are immediate. Reload to see modifications (no hot reload).

## Debugging Tips
- Open DevTools → Console to check `state` object in real-time
- Toggle entity visibility with `entities.forEach(e => e.mesh.visible = !e.mesh.visible)`
- Force weather change: `state.targetWeather = 'rain'; changeWeather()`
- Inspect entity positions: Entities stored in global `entities` array with `phi`, `theta`, `mesh` properties

## Common Gotchas
1. **Coordinate system:** phi=latitude (0→π), theta=longitude (-π→π). Don't confuse with traditional lat/long.
2. **Spherical rotation:** Must apply `quaternion.setFromUnitVectors()` so entities face outward on globe surface.
3. **Animation timing:** Uses `Date.now() * 0.001` for smooth loops—delta time applied separately.
4. **Inventory limits:** 8 slots UI, but state.inventory array unbounded; no overflow handling.
5. **Asset loading:** All visuals procedurally generated—no image/model imports, safe for offline use.
