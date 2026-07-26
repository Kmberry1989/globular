export const BIOME_ORDER = ['grassland', 'desert', 'snow', 'safari'];

export const BIOMES = {
  grassland: {
    id: 'grassland',
    name: 'Clover Commons',
    shortName: 'Commons',
    emoji: '🌿',
    color: 0x78b85a,
    accent: '#5d9b45',
    sky: '#9fded1',
    center: 0,
    ranger: { name: 'Mira', emoji: '🦝', color: 0xc67b4f },
    intro: 'Our field guide is full of blank pages. Photograph a meadow butterfly and gather two starflowers for the first stamp.',
    requirements: [
      { kind: 'photo', target: 'butterfly', count: 1, label: 'Photograph a meadow butterfly' },
      { kind: 'gather', target: 'starflower', count: 2, label: 'Gather 2 starflowers' },
    ],
    stamp: 'Meadow Stamp',
  },
  desert: {
    id: 'desert',
    name: 'Sunpetal Sands',
    shortName: 'Sands',
    emoji: '☀️',
    color: 0xd9aa62,
    accent: '#bd7b36',
    sky: '#f6c886',
    center: Math.PI / 2,
    ranger: { name: 'Sol', emoji: '🐪', color: 0xb9793e },
    intro: 'Welcome to the Sands! Find our patient camel and bring back one sunpetal bloom.',
    requirements: [
      { kind: 'photo', target: 'camel', count: 1, label: 'Photograph the dune camel' },
      { kind: 'gather', target: 'sunpetal', count: 1, label: 'Gather a sunpetal bloom' },
    ],
    stamp: 'Sun Stamp',
  },
  snow: {
    id: 'snow',
    name: 'Frostcap Reach',
    shortName: 'Frostcap',
    emoji: '❄️',
    color: 0xd9edf2,
    accent: '#77a8bd',
    sky: '#b8d7ed',
    center: Math.PI,
    ranger: { name: 'Nivi', emoji: '🐧', color: 0x64859b },
    intro: 'Quiet steps make the best photographs here. Record both a penguin and a polar bear.',
    requirements: [
      { kind: 'photo', target: 'penguin', count: 1, label: 'Photograph a penguin' },
      { kind: 'photo', target: 'polar_bear', count: 1, label: 'Photograph a polar bear' },
    ],
    stamp: 'Frost Stamp',
  },
  safari: {
    id: 'safari',
    name: 'Goldenleaf Wilds',
    shortName: 'Wilds',
    emoji: '🌾',
    color: 0x9dac52,
    accent: '#7c873c',
    sky: '#f1bc73',
    center: -Math.PI / 2,
    ranger: { name: 'Kito', emoji: '🦒', color: 0xa96631 },
    intro: 'Your final page needs a grand trio: zebra, giraffe, and elephant. Take your time and frame each one.',
    requirements: [
      { kind: 'photo', target: 'zebra', count: 1, label: 'Photograph a zebra' },
      { kind: 'photo', target: 'giraffe', count: 1, label: 'Photograph a giraffe' },
      { kind: 'photo', target: 'elephant', count: 1, label: 'Photograph an elephant' },
    ],
    stamp: 'Goldenleaf Stamp',
  },
};

export const SPECIES = {
  butterfly: {
    id: 'butterfly',
    name: 'Meadow Butterfly',
    emoji: '🦋',
    biome: 'grassland',
    note: 'A bright pollinator that loops lazily above starflowers.',
    colors: [0xf7c948, 0xe85d75],
    form: 'butterfly',
  },
  ladybug: {
    id: 'ladybug',
    name: 'Clover Ladybug',
    emoji: '🐞',
    biome: 'grassland',
    note: 'Tiny, determined, and fond of the sunniest clover leaves.',
    colors: [0xdc3f45, 0x232323],
    form: 'bug',
  },
  red_panda: {
    id: 'red_panda',
    name: 'Rustleaf Red Panda',
    emoji: '🦝',
    biome: 'grassland',
    note: 'A shy treetop neighbor with a magnificently striped tail.',
    colors: [0xc95f38, 0x3c2b25],
    form: 'quadruped',
  },
  camel: {
    id: 'camel',
    name: 'Dune Camel',
    emoji: '🐪',
    biome: 'desert',
    note: 'A steady traveler that knows every cool hollow in the dunes.',
    colors: [0xbe8553, 0x6d4934],
    form: 'camel',
  },
  fennec: {
    id: 'fennec',
    name: 'Sunset Fennec',
    emoji: '🦊',
    biome: 'desert',
    note: 'Its enormous ears can hear beetles moving beneath the sand.',
    colors: [0xe5ad68, 0x5d3b2b],
    form: 'fox',
  },
  fish: {
    id: 'fish',
    name: 'Glassfin Fish',
    emoji: '🐟',
    biome: 'desert',
    note: 'A shoreline glimmer best photographed from the oasis bank.',
    colors: [0x55b8d0, 0x236d85],
    form: 'fish',
  },
  penguin: {
    id: 'penguin',
    name: 'Frostcap Penguin',
    emoji: '🐧',
    biome: 'snow',
    note: 'A sociable waddler that gathers beside blue ice crystals.',
    colors: [0x222a35, 0xf4f5ef],
    form: 'penguin',
  },
  polar_bear: {
    id: 'polar_bear',
    name: 'Cloudcoat Bear',
    emoji: '🐻‍❄️',
    biome: 'snow',
    note: 'Gentle from afar, with fur the color of morning snow.',
    colors: [0xf2f3e9, 0x303840],
    form: 'bear',
  },
  arctic_fox: {
    id: 'arctic_fox',
    name: 'Tundra Fox',
    emoji: '🦊',
    biome: 'snow',
    note: 'A quick white blur with a dark nose and a curious gaze.',
    colors: [0xe8eef0, 0x44505a],
    form: 'fox',
  },
  zebra: {
    id: 'zebra',
    name: 'Goldenleaf Zebra',
    emoji: '🦓',
    biome: 'safari',
    note: 'No two stripe patterns are quite the same.',
    colors: [0xf0eee2, 0x242526],
    form: 'zebra',
  },
  giraffe: {
    id: 'giraffe',
    name: 'Canopy Giraffe',
    emoji: '🦒',
    biome: 'safari',
    note: 'Tall enough to nibble leaves no other neighbor can reach.',
    colors: [0xe2a84c, 0x82502d],
    form: 'giraffe',
  },
  elephant: {
    id: 'elephant',
    name: 'Dawn Elephant',
    emoji: '🐘',
    biome: 'safari',
    note: 'A thoughtful giant that dusts itself in the morning light.',
    colors: [0x89949c, 0x555f67],
    form: 'elephant',
  },
  flamingo: {
    id: 'flamingo',
    name: 'Blush Flamingo',
    emoji: '🦩',
    biome: 'safari',
    note: 'Often found balancing at the edge of the watering hollow.',
    colors: [0xf08ba6, 0x5a3842],
    form: 'flamingo',
  },
  crab: {
    id: 'crab',
    name: 'Pebble Crab',
    emoji: '🦀',
    biome: 'safari',
    note: 'A sideways shoreline scuttler with bright coral claws.',
    colors: [0xe55a4f, 0x812f32],
    form: 'crab',
  },
};

export const COLLECTIBLES = {
  starflower: { id: 'starflower', name: 'Starflower', emoji: '🌼', value: 35, color: 0xf5d35d, biome: 'grassland' },
  apple: { id: 'apple', name: 'Clover Apple', emoji: '🍎', value: 50, color: 0xd84c4c, biome: 'grassland' },
  sunpetal: { id: 'sunpetal', name: 'Sunpetal Bloom', emoji: '🌻', value: 70, color: 0xf4b83f, biome: 'desert' },
  smooth_stone: { id: 'smooth_stone', name: 'Smooth Stone', emoji: '🪨', value: 45, color: 0xa77c5c, biome: 'desert' },
  snowdrop: { id: 'snowdrop', name: 'Snowdrop', emoji: '🪻', value: 65, color: 0xbac7ff, biome: 'snow' },
  ice_glass: { id: 'ice_glass', name: 'Ice Glass', emoji: '💎', value: 80, color: 0x8bd3e6, biome: 'snow' },
  fallen_feather: { id: 'fallen_feather', name: 'Fallen Feather', emoji: '🪶', value: 55, color: 0xe8d5a8, biome: 'safari' },
  seed_pod: { id: 'seed_pod', name: 'Golden Seed Pod', emoji: '🌰', value: 60, color: 0xa4773e, biome: 'safari' },
};

export const COSMETICS = {
  field_cap: { id: 'field_cap', name: 'Field Cap', emoji: '🧢', price: 0 },
  sun_hat: { id: 'sun_hat', name: 'Sun Hat', emoji: '👒', price: 180 },
  camera_strap: { id: 'camera_strap', name: 'Golden Camera Strap', emoji: '📷', price: 260 },
  first_orbit_crown: { id: 'first_orbit_crown', name: 'First Orbit Crown', emoji: '👑', price: null },
};

export function normalizeLongitude(value) {
  let result = value % (Math.PI * 2);
  if (result > Math.PI) result -= Math.PI * 2;
  if (result <= -Math.PI) result += Math.PI * 2;
  return result;
}

export function biomeForLongitude(longitude) {
  const wrapped = ((normalizeLongitude(longitude) + Math.PI / 4 + Math.PI * 2) % (Math.PI * 2));
  return BIOME_ORDER[Math.floor(wrapped / (Math.PI / 2)) % BIOME_ORDER.length];
}

export function currentChapter(stamps) {
  return BIOME_ORDER.find((id) => !stamps.includes(id)) ?? 'return_home';
}
