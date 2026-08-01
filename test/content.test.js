import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BIOME_ORDER,
  BIOMES,
  COLLECTIBLES,
  MODEL_ASSETS,
  SPECIES,
  STRUCTURES,
  WORLD_LAYOUT,
  biomeForLongitude,
  currentChapter,
  normalizeLongitude,
} from '../src/content.js';

test('every biome center resolves to its own region', () => {
  for (const id of BIOME_ORDER) {
    assert.equal(biomeForLongitude(BIOMES[id].center), id);
  }
});

test('longitude normalization wraps in both directions', () => {
  assert.equal(normalizeLongitude(Math.PI * 2), 0);
  assert.equal(normalizeLongitude(-Math.PI * 2), -0);
  assert.ok(Math.abs(normalizeLongitude(Math.PI * 2.5) - Math.PI / 2) < 1e-9);
  assert.ok(Math.abs(normalizeLongitude(-Math.PI * 2.5) + Math.PI / 2) < 1e-9);
});

test('chapter order ignores later stamps until earlier requests are complete', () => {
  assert.equal(currentChapter([]), 'grassland');
  assert.equal(currentChapter(['safari']), 'grassland');
  assert.equal(currentChapter(['grassland', 'desert']), 'snow');
  assert.equal(currentChapter(BIOME_ORDER), 'return_home');
});

test('expanded catalog gives every biome four new animals, collectibles, and structures', () => {
  const categoryCounts = { wildlife: 0, collectible: 0, structure: 0 };
  for (const [id, asset] of Object.entries(MODEL_ASSETS)) {
    assert.match(asset.path, new RegExp(`^models/${id}\\.glb$`));
    categoryCounts[asset.category] += 1;
  }
  assert.deepEqual(categoryCounts, { wildlife: 16, collectible: 16, structure: 16 });

  for (const biomeId of BIOME_ORDER) {
    const layout = WORLD_LAYOUT[biomeId];
    assert.equal(layout.wildlife.length, 7 + (biomeId === 'safari' ? 2 : 0));
    assert.equal(layout.collectibles.length, { grassland: 8, desert: 7, snow: 7, safari: 7 }[biomeId]);
    assert.equal(layout.structures.length, 4);
    for (const [id] of layout.wildlife) assert.ok(SPECIES[id], `${biomeId} wildlife ${id}`);
    for (const [id] of layout.collectibles) assert.ok(COLLECTIBLES[id], `${biomeId} collectible ${id}`);
    for (const [id] of layout.structures) assert.ok(STRUCTURES[id], `${biomeId} structure ${id}`);
  }
});

test('expanded content does not alter First Orbit requirements', () => {
  assert.deepEqual(BIOMES.grassland.requirements.map((entry) => entry.target), ['butterfly', 'starflower']);
  assert.deepEqual(BIOMES.desert.requirements.map((entry) => entry.target), ['camel', 'sunpetal']);
  assert.deepEqual(BIOMES.snow.requirements.map((entry) => entry.target), ['penguin', 'polar_bear']);
  assert.deepEqual(BIOMES.safari.requirements.map((entry) => entry.target), ['zebra', 'giraffe', 'elephant']);
});
