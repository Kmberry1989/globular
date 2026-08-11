import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  ALL_MODEL_ASSETS,
  BIOME_ORDER,
  BIOMES,
  CHARACTER_MODEL_ASSETS,
  COLLECTIBLES,
  MODEL_ASSETS,
  PHOTO_SUBJECTS,
  SPECIES,
  STRUCTURES,
  WORLD_PROP_ASSETS,
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

test('expanded catalog keeps every placed subject wired to content and models', () => {
  const categoryCounts = { wildlife: 0, collectible: 0, structure: 0 };
  for (const [id, asset] of Object.entries(MODEL_ASSETS)) {
    assert.match(asset.path, /^models\/[a-z0-9_]+\.glb$/);
    assert.ok(PHOTO_SUBJECTS[id], `${id} should be photographable`);
    categoryCounts[asset.category] += 1;
  }
  assert.deepEqual(categoryCounts, {
    wildlife: Object.keys(SPECIES).length,
    collectible: Object.keys(COLLECTIBLES).length,
    structure: Object.keys(STRUCTURES).length,
  });

  for (const biomeId of BIOME_ORDER) {
    const layout = WORLD_LAYOUT[biomeId];
    assert.ok(layout.wildlife.length >= 9, `${biomeId} should include expanded wildlife`);
    assert.ok(layout.collectibles.length >= 8, `${biomeId} should include plant/find variants`);
    assert.ok(layout.structures.length >= 5, `${biomeId} should include environment variants`);
    for (const [id] of layout.wildlife) assert.ok(SPECIES[id], `${biomeId} wildlife ${id}`);
    for (const [id] of layout.collectibles) assert.ok(COLLECTIBLES[id], `${biomeId} collectible ${id}`);
    for (const [id] of layout.structures) assert.ok(STRUCTURES[id], `${biomeId} structure ${id}`);
  }
});

test('world dressing has explicit replacement slots', () => {
  assert.deepEqual(Object.keys(WORLD_PROP_ASSETS), [
    'tree', 'cactus', 'ice_patch', 'picnic_shelter', 'sandstone_ruins',
  ]);
  for (const [id, asset] of Object.entries(WORLD_PROP_ASSETS)) {
    assert.match(asset.path, /^models\/[a-z0-9_]+\.glb$/);
    assert.ok(asset.role, `${id} should describe its art role`);
  }
});

test('character and equipment model slots are explicit', () => {
  assert.deepEqual(Object.keys(CHARACTER_MODEL_ASSETS), [
    'ranger_grassland', 'ranger_desert', 'ranger_snow', 'ranger_safari', 'camera',
  ]);
  for (const [id, asset] of Object.entries(CHARACTER_MODEL_ASSETS)) {
    assert.match(asset.path, /^models\/[a-z0-9_]+\.glb$/);
    assert.ok(asset.role, `${id} should describe its runtime role`);
  }
});

test('every root model file is owned by a runtime asset registry entry', () => {
  const runtimeFiles = new Set(Object.values(ALL_MODEL_ASSETS).map((asset) => asset.path));
  const existingFiles = fs.readdirSync(new URL('../models/', import.meta.url))
    .filter((file) => file.endsWith('.glb'))
    .map((file) => `models/${file}`);
  for (const file of existingFiles) assert.ok(runtimeFiles.has(file), `${file} should be referenced by a runtime asset`);
});

test('bird, insect, plant, and tree expansion subjects are photographable', () => {
  for (const id of ['willow_wren', 'bald_eagle', 'cardinal', 'red_tailed_hawk', 'blue_jay', 'ruby_throated_hummingbird']) {
    assert.equal(PHOTO_SUBJECTS[id]?.category, 'Wildlife');
  }
  for (const id of ['firefly', 'bumblebee', 'dragonfly', 'grasshopper', 'stag_beetle']) {
    assert.equal(PHOTO_SUBJECTS[id]?.category, 'Wildlife');
  }
  for (const id of ['daisy', 'desert_marigold', 'arctic_poppy', 'savanna_lily', 'oak_tree', 'palm_tree', 'pine_tree', 'baobab_tree']) {
    assert.ok(PHOTO_SUBJECTS[id], `${id} should be a photo subject`);
  }
});

test('expanded flower set includes multiple identifiable blooms per biome', () => {
  const expectedFlowers = {
    grassland: ['daisy', 'bluebell', 'red_clover', 'black_eyed_susan', 'lavender_spike'],
    desert: ['desert_marigold', 'prickly_pear_blossom', 'desert_lupine', 'evening_primrose', 'firecracker_penstemon'],
    snow: ['arctic_poppy', 'edelweiss', 'alpine_forget_me_not', 'glacier_lily', 'purple_saxifrage'],
    safari: ['savanna_lily', 'flame_lily', 'bird_of_paradise_flower', 'aloe_bloom', 'acacia_blossom'],
  };
  for (const [biomeId, flowerIds] of Object.entries(expectedFlowers)) {
    const placed = new Set(WORLD_LAYOUT[biomeId].collectibles.map(([id]) => id));
    for (const id of flowerIds) {
      assert.equal(COLLECTIBLES[id]?.form, 'flower', `${id} should be authored as a flower`);
      assert.equal(COLLECTIBLES[id]?.biome, biomeId, `${id} should belong to ${biomeId}`);
      assert.equal(PHOTO_SUBJECTS[id]?.category, 'Plants', `${id} should save as a plant photo`);
      assert.ok(placed.has(id), `${id} should be placed in ${biomeId}`);
      assert.equal(MODEL_ASSETS[id]?.path, `models/${id}.glb`, `${id} should have its own model slot`);
    }
  }
});

test('expanded content does not alter First Orbit requirements', () => {
  assert.deepEqual(BIOMES.grassland.requirements.map((entry) => entry.target), ['butterfly', 'starflower']);
  assert.deepEqual(BIOMES.desert.requirements.map((entry) => entry.target), ['camel', 'sunpetal']);
  assert.deepEqual(BIOMES.snow.requirements.map((entry) => entry.target), ['penguin', 'polar_bear']);
  assert.deepEqual(BIOMES.safari.requirements.map((entry) => entry.target), ['zebra', 'giraffe', 'elephant']);
});
