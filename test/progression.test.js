import test from 'node:test';
import assert from 'node:assert/strict';
import { BIOMES, COLLECTIBLES } from '../src/content.js';
import {
  calculateInventoryValue,
  isBiomeRequestComplete,
  isRequirementComplete,
  requirementProgress,
} from '../src/progression.js';

const emptySave = () => ({ discoveries: {}, lifetimeCollected: {} });

test('photo and gathering requirements report player progress', () => {
  const save = emptySave();
  save.discoveries.butterfly = { speciesId: 'butterfly' };
  save.lifetimeCollected.starflower = 1;

  assert.equal(requirementProgress(save, BIOMES.grassland.requirements[0]), 1);
  assert.equal(requirementProgress(save, BIOMES.grassland.requirements[1]), 1);
  assert.equal(isRequirementComplete(save, BIOMES.grassland.requirements[0]), true);
  assert.equal(isRequirementComplete(save, BIOMES.grassland.requirements[1]), false);
});

test('a biome request completes only when every requirement is met', () => {
  const save = emptySave();
  save.discoveries.butterfly = { speciesId: 'butterfly' };
  save.lifetimeCollected.starflower = 2;

  assert.equal(isBiomeRequestComplete(save, BIOMES.grassland), true);
  delete save.discoveries.butterfly;
  assert.equal(isBiomeRequestComplete(save, BIOMES.grassland), false);
});

test('inventory value ignores unknown, negative, and non-numeric entries', () => {
  const inventory = {
    starflower: 2,
    apple: 1,
    unknown: 99,
    sunpetal: -3,
    smooth_stone: 'not-a-number',
  };
  assert.equal(calculateInventoryValue(inventory, COLLECTIBLES), 120);
});
