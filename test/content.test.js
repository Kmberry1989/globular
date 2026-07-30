import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BIOME_ORDER,
  BIOMES,
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
