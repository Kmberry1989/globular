import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultSave, sanitizeSave } from '../src/persistence.js';

test('default saves have independent nested state', () => {
  const first = createDefaultSave();
  const second = createDefaultSave();
  first.inventory.starflower = 2;
  first.settings.sound = false;

  assert.deepEqual(second.inventory, {});
  assert.equal(second.settings.sound, true);
});

test('sanitization preserves valid progress and removes unknown content', () => {
  const save = sanitizeSave({
    started: true,
    completed: false,
    playerName: '  Fern  ',
    appearance: { shirt: '#123abc', skin: 'invalid' },
    longitude: Math.PI * 2.5,
    latitude: 99,
    bells: 42.9,
    inventory: { starflower: 2.8, unknown: 50 },
    lifetimeCollected: { starflower: 3 },
    discoveries: {
      butterfly: { discoveredAt: '2026-07-26T00:00:00.000Z' },
      dragon: { discoveredAt: 'never' },
    },
    stamps: ['grassland', 'grassland', 'ocean'],
    introducedBiomes: ['grassland', 'ocean'],
    unlockedCosmetics: ['sun_hat', 'made_up_hat'],
    equippedCosmetic: 'sun_hat',
    settings: { sound: false, reducedMotion: true },
  });

  assert.equal(save.playerName, 'Fern');
  assert.equal(save.appearance.shirt, '#123abc');
  assert.equal(save.appearance.skin, '#c88761');
  assert.ok(Math.abs(save.longitude - Math.PI / 2) < 1e-9);
  assert.equal(save.latitude, 0.31);
  assert.equal(save.bells, 42);
  assert.deepEqual(save.inventory, { starflower: 2 });
  assert.deepEqual(Object.keys(save.discoveries), ['butterfly']);
  assert.deepEqual(save.stamps, ['grassland']);
  assert.deepEqual(save.introducedBiomes, ['grassland']);
  assert.deepEqual(save.unlockedCosmetics, ['field_cap', 'sun_hat']);
  assert.equal(save.equippedCosmetic, 'sun_hat');
  assert.deepEqual(save.settings, { sound: false, reducedMotion: true });
});

test('malformed values fall back without granting progress or currency', () => {
  const save = sanitizeSave({
    playerName: [],
    longitude: 'not-a-number',
    latitude: null,
    bells: -100,
    inventory: ['starflower'],
    discoveries: { butterfly: true },
    stamps: 'grassland',
    unlockedCosmetics: ['unknown'],
    equippedCosmetic: 'first_orbit_crown',
    settings: { sound: 'yes', reducedMotion: 1 },
  });

  assert.equal(save.playerName, 'Roamer');
  assert.equal(save.longitude, 0);
  assert.equal(save.latitude, 0);
  assert.equal(save.bells, 0);
  assert.deepEqual(save.inventory, {});
  assert.deepEqual(save.discoveries, {});
  assert.deepEqual(save.stamps, []);
  assert.deepEqual(save.unlockedCosmetics, ['field_cap']);
  assert.equal(save.equippedCosmetic, 'field_cap');
  assert.deepEqual(save.settings, { sound: true, reducedMotion: false });
});
