import {
  BIOME_ORDER,
  BIOMES,
  COLLECTIBLES,
  COSMETICS,
  PHOTO_SUBJECTS,
  SPECIES,
  normalizeLongitude,
} from './content.js';

const SAVE_KEY = 'globular_roam_save_v2';
const OLD_META_KEY = 'cozyglobe_meta_v1';
const DB_NAME = 'globular_roam_photos';
const PHOTO_STORE = 'photos';
const SAVE_VERSION = 2;

export function createDefaultSave() {
  return {
    version: SAVE_VERSION,
    started: false,
    completed: false,
    playerName: 'Roamer',
    appearance: { shirt: '#e86e50', skin: '#c88761', hat: 'field_cap' },
    longitude: 0,
    latitude: 0,
    bells: 0,
    inventory: {},
    lifetimeCollected: {},
    discoveries: {},
    stamps: [],
    introducedBiomes: [],
    unlockedCosmetics: ['field_cap'],
    equippedCosmetic: 'field_cap',
    settings: { sound: true, reducedMotion: false },
    updatedAt: new Date().toISOString(),
  };
}

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

function sanitizeCountMap(raw, catalog) {
  if (!isRecord(raw)) return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([id, count]) => {
    const numeric = Number(count);
    if (!catalog[id] || !Number.isFinite(numeric) || numeric <= 0) return [];
    return [[id, Math.floor(numeric)]];
  }));
}

function sanitizeDiscoveries(raw) {
  if (!isRecord(raw)) return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([id, discovery]) => {
    const subject = PHOTO_SUBJECTS[id];
    if (!subject || !isRecord(discovery)) return [];
    return [[id, {
      subjectId: id,
      speciesId: SPECIES[id]?.id,
      biomeId: subject.biome,
      category: subject.category,
      discoveredAt: typeof discovery.discoveredAt === 'string'
        ? discovery.discoveredAt
        : new Date(0).toISOString(),
    }]];
  }));
}

export function sanitizeSave(raw) {
  const defaults = createDefaultSave();
  if (!isRecord(raw)) return defaults;
  const unlockedCosmetics = Array.isArray(raw.unlockedCosmetics)
    ? [...new Set(['field_cap', ...raw.unlockedCosmetics.filter((id) => COSMETICS[id])])]
    : ['field_cap'];
  const equippedCosmetic = unlockedCosmetics.includes(raw.equippedCosmetic)
    ? raw.equippedCosmetic
    : 'field_cap';
  const longitude = Number(raw.longitude);
  const latitude = Number(raw.latitude);
  const bells = Number(raw.bells);
  return {
    ...defaults,
    version: SAVE_VERSION,
    started: Boolean(raw.started),
    completed: Boolean(raw.completed),
    playerName: typeof raw.playerName === 'string'
      ? (raw.playerName.trim().slice(0, 18) || defaults.playerName)
      : defaults.playerName,
    appearance: {
      ...defaults.appearance,
      shirt: isHexColor(raw.appearance?.shirt) ? raw.appearance.shirt : defaults.appearance.shirt,
      skin: isHexColor(raw.appearance?.skin) ? raw.appearance.skin : defaults.appearance.skin,
    },
    longitude: Number.isFinite(longitude) ? normalizeLongitude(longitude) : defaults.longitude,
    latitude: Number.isFinite(latitude)
      ? Math.max(-0.31, Math.min(0.31, latitude))
      : defaults.latitude,
    bells: Number.isFinite(bells) ? Math.max(0, Math.floor(bells)) : defaults.bells,
    inventory: sanitizeCountMap(raw.inventory, COLLECTIBLES),
    lifetimeCollected: sanitizeCountMap(raw.lifetimeCollected, COLLECTIBLES),
    discoveries: sanitizeDiscoveries(raw.discoveries),
    stamps: Array.isArray(raw.stamps)
      ? [...new Set(raw.stamps.filter((id) => BIOME_ORDER.includes(id)))]
      : [],
    introducedBiomes: Array.isArray(raw.introducedBiomes)
      ? [...new Set(raw.introducedBiomes.filter((id) => BIOMES[id]))]
      : [],
    unlockedCosmetics,
    equippedCosmetic,
    settings: {
      sound: typeof raw.settings?.sound === 'boolean' ? raw.settings.sound : defaults.settings.sound,
      reducedMotion: typeof raw.settings?.reducedMotion === 'boolean'
        ? raw.settings.reducedMotion
        : defaults.settings.reducedMotion,
    },
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : defaults.updatedAt,
  };
}

function migrateLegacyMeta() {
  try {
    const legacy = JSON.parse(localStorage.getItem(OLD_META_KEY));
    if (!legacy) return null;
    const save = createDefaultSave();
    const oldUnlocks = Array.isArray(legacy.unlockedAccessories) ? legacy.unlockedAccessories : [];
    if (oldUnlocks.some((id) => id.includes('crown'))) save.unlockedCosmetics.push('sun_hat');
    if (oldUnlocks.some((id) => id.includes('backpack') || id.includes('umbrella'))) {
      save.unlockedCosmetics.push('camera_strap');
    }
    return save;
  } catch {
    return null;
  }
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return sanitizeSave(JSON.parse(raw));
  } catch {
    // Fall through to a clean or migrated save.
  }
  return sanitizeSave(migrateLegacyMeta());
}

export function saveProgress(save) {
  const clean = sanitizeSave({ ...save, updatedAt: new Date().toISOString() });
  localStorage.setItem(SAVE_KEY, JSON.stringify(clean));
  return clean;
}

export function clearProgress() {
  localStorage.removeItem(SAVE_KEY);
}

function openPhotoDatabase() {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) db.createObjectStore(PHOTO_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function storePhoto(speciesId, blob) {
  const db = await openPhotoDatabase();
  if (!db || !blob) return false;
  return new Promise((resolve) => {
    const transaction = db.transaction(PHOTO_STORE, 'readwrite');
    transaction.objectStore(PHOTO_STORE).put(blob, speciesId);
    transaction.oncomplete = () => {
      db.close();
      resolve(true);
    };
    transaction.onerror = () => {
      db.close();
      resolve(false);
    };
  });
}

export async function loadPhoto(speciesId) {
  const db = await openPhotoDatabase();
  if (!db) return null;
  return new Promise((resolve) => {
    const transaction = db.transaction(PHOTO_STORE, 'readonly');
    const request = transaction.objectStore(PHOTO_STORE).get(speciesId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
    transaction.oncomplete = () => db.close();
  });
}

export async function clearPhotos() {
  const db = await openPhotoDatabase();
  if (!db) return;
  await new Promise((resolve) => {
    const transaction = db.transaction(PHOTO_STORE, 'readwrite');
    transaction.objectStore(PHOTO_STORE).clear();
    transaction.oncomplete = resolve;
    transaction.onerror = resolve;
  });
  db.close();
}
