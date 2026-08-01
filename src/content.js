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
  hedgehog: { id: 'hedgehog', name: 'Clover Hedgehog', emoji: '🦔', biome: 'grassland', note: 'A round little forager that rustles through the clover after rain.', colors: [0x9a6849, 0x4a332b], form: 'hedgehog' },
  songbird: { id: 'songbird', name: 'Willow Songbird', emoji: '🐦', biome: 'grassland', note: 'Its clear three-note call carries between the meadow trees.', colors: [0x6b91c7, 0xf2d789], form: 'bird' },
  frog: { id: 'frog', name: 'Pondleaf Frog', emoji: '🐸', biome: 'grassland', note: 'A bright-eyed hopper that rests beside the smallest pools.', colors: [0x5aa85d, 0xd9e26d], form: 'frog' },
  squirrel: { id: 'squirrel', name: 'Acorn Squirrel', emoji: '🐿️', biome: 'grassland', note: 'Quick paws and an even quicker tail make it hard to photograph.', colors: [0xb76f3f, 0xf1d1a0], form: 'squirrel' },
  meerkat: { id: 'meerkat', name: 'Sentinel Meerkat', emoji: '🦦', biome: 'desert', note: 'One always stands watch while the others search the warm sand.', colors: [0xc89b5f, 0x5b4632], form: 'meerkat' },
  desert_tortoise: { id: 'desert_tortoise', name: 'Sunstone Tortoise', emoji: '🐢', biome: 'desert', note: 'It carries a patterned shell like a tiny sandstone dome.', colors: [0x9f8b4f, 0x46513a], form: 'tortoise' },
  roadrunner: { id: 'roadrunner', name: 'Dune Roadrunner', emoji: '🐦', biome: 'desert', note: 'A long-tailed bird that zips between the cactus shadows.', colors: [0x85745b, 0xd2a250], form: 'bird' },
  gecko: { id: 'gecko', name: 'Ember Gecko', emoji: '🦎', biome: 'desert', note: 'A tiny climber with a tail the color of sunset sandstone.', colors: [0xe1834f, 0x584235], form: 'gecko' },
  seal: { id: 'seal', name: 'Drift Seal', emoji: '🦭', biome: 'snow', note: 'It naps on the ice, then slips into the cold water without a splash.', colors: [0x9daeb9, 0x3f5665], form: 'seal' },
  snowy_owl: { id: 'snowy_owl', name: 'Moonwing Owl', emoji: '🦉', biome: 'snow', note: 'Its quiet wings disappear against the pale evening sky.', colors: [0xf4f2df, 0x8b765a], form: 'bird' },
  arctic_hare: { id: 'arctic_hare', name: 'Frost Hare', emoji: '🐇', biome: 'snow', note: 'A soft white blur with long ears and an alert little nose.', colors: [0xf2f4ef, 0x71808a], form: 'hare' },
  musk_ox: { id: 'musk_ox', name: 'Northwind Musk Ox', emoji: '🐂', biome: 'snow', note: 'A shaggy, steady neighbor with curled horns built for winter.', colors: [0x573e36, 0xd6c7aa], form: 'musk_ox' },
  lion: { id: 'lion', name: 'Sunmane Lion', emoji: '🦁', biome: 'safari', note: 'A patient watcher whose mane glows at the edge of the grass.', colors: [0xc98b3d, 0x70452d], form: 'lion' },
  hippo: { id: 'hippo', name: 'Riverbank Hippo', emoji: '🦛', biome: 'safari', note: 'A cool-water giant with tiny ears and an enormous yawn.', colors: [0x7f7182, 0x514959], form: 'hippo' },
  warthog: { id: 'warthog', name: 'Brush Warthog', emoji: '🐗', biome: 'safari', note: 'It trots with its tail raised like a small grassland flag.', colors: [0x71533c, 0xe3d4b5], form: 'warthog' },
  hornbill: { id: 'hornbill', name: 'Golden Hornbill', emoji: '🐦', biome: 'safari', note: 'Its bright bill makes a flash of color in the canopy.', colors: [0x34383b, 0xe4aa37], form: 'bird' },
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
  clover_mushroom: { id: 'clover_mushroom', name: 'Clover Mushroom', emoji: '🍄', value: 42, color: 0xdc7b63, biome: 'grassland', form: 'mushroom' },
  acorn: { id: 'acorn', name: 'Polished Acorn', emoji: '🌰', value: 38, color: 0x9a623c, biome: 'grassland', form: 'acorn' },
  dewberry: { id: 'dewberry', name: 'Dewberry', emoji: '🫐', value: 52, color: 0x536ec1, biome: 'grassland', form: 'berry' },
  wild_mint: { id: 'wild_mint', name: 'Wild Mint', emoji: '🌿', value: 46, color: 0x76b963, biome: 'grassland', form: 'sprig' },
  cactus_fruit: { id: 'cactus_fruit', name: 'Cactus Fruit', emoji: '🍐', value: 58, color: 0xdb5471, biome: 'desert', form: 'fruit' },
  desert_pearl: { id: 'desert_pearl', name: 'Desert Pearl', emoji: '🫧', value: 78, color: 0xf1d7a1, biome: 'desert', form: 'pearl' },
  amber_shard: { id: 'amber_shard', name: 'Amber Shard', emoji: '🟠', value: 74, color: 0xdb9138, biome: 'desert', form: 'crystal' },
  date_cluster: { id: 'date_cluster', name: 'Date Cluster', emoji: '🍇', value: 56, color: 0x6f432d, biome: 'desert', form: 'berry' },
  frostberry: { id: 'frostberry', name: 'Frostberry', emoji: '🫐', value: 64, color: 0x7f9fe3, biome: 'snow', form: 'berry' },
  pinecone: { id: 'pinecone', name: 'Silver Pinecone', emoji: '🌲', value: 50, color: 0x846d53, biome: 'snow', form: 'pinecone' },
  aurora_shell: { id: 'aurora_shell', name: 'Aurora Shell', emoji: '🐚', value: 86, color: 0x91d4cb, biome: 'snow', form: 'shell' },
  snow_crystal: { id: 'snow_crystal', name: 'Snow Crystal', emoji: '❄️', value: 82, color: 0xc5e9f4, biome: 'snow', form: 'crystal' },
  baobab_pod: { id: 'baobab_pod', name: 'Baobab Pod', emoji: '🥜', value: 68, color: 0x987044, biome: 'safari', form: 'pod' },
  amber_bead: { id: 'amber_bead', name: 'Amber Bead', emoji: '🟠', value: 72, color: 0xce7f36, biome: 'safari', form: 'pearl' },
  river_reed: { id: 'river_reed', name: 'River Reed', emoji: '🌾', value: 48, color: 0x89a84f, biome: 'safari', form: 'reed' },
  painted_stone: { id: 'painted_stone', name: 'Painted Stone', emoji: '🪨', value: 62, color: 0xb16d50, biome: 'safari', form: 'stone' },
};

export const STRUCTURES = {
  windmill: { id: 'windmill', name: 'Clover Windmill', biome: 'grassland', color: 0xe8d7a2, accent: 0x71965b, form: 'windmill' },
  stone_bridge: { id: 'stone_bridge', name: 'Mossy Stone Bridge', biome: 'grassland', color: 0x8d9b84, accent: 0x5d864c, form: 'bridge' },
  birdhouse: { id: 'birdhouse', name: 'Meadow Birdhouse', biome: 'grassland', color: 0xd18a4c, accent: 0x5a7747, form: 'birdhouse' },
  picnic_shelter: { id: 'picnic_shelter', name: 'Clover Picnic Shelter', biome: 'grassland', color: 0xc98d5c, accent: 0x4f7950, form: 'shelter' },
  oasis_well: { id: 'oasis_well', name: 'Oasis Well', biome: 'desert', color: 0xc89f63, accent: 0x5fa6ad, form: 'well' },
  sandstone_ruins: { id: 'sandstone_ruins', name: 'Sandstone Ruins', biome: 'desert', color: 0xbd7c43, accent: 0x9a5d37, form: 'ruins' },
  desert_tent: { id: 'desert_tent', name: 'Desert Tent', biome: 'desert', color: 0xd9a65c, accent: 0xa14e3f, form: 'tent' },
  wind_tower: { id: 'wind_tower', name: 'Sunwind Tower', biome: 'desert', color: 0xc99b62, accent: 0x6f7d70, form: 'tower' },
  igloo: { id: 'igloo', name: 'Frostcap Igloo', biome: 'snow', color: 0xdcecf0, accent: 0x7fb1bf, form: 'igloo' },
  ice_bridge: { id: 'ice_bridge', name: 'Blue Ice Bridge', biome: 'snow', color: 0x8fd5e4, accent: 0xefffff, form: 'bridge' },
  ranger_watchtower: { id: 'ranger_watchtower', name: 'Frost Ranger Watchtower', biome: 'snow', color: 0x7896a0, accent: 0xe6f3f3, form: 'tower' },
  sled_station: { id: 'sled_station', name: 'Sled Station', biome: 'snow', color: 0xbb7161, accent: 0xdde9e8, form: 'shelter' },
  lookout_tower: { id: 'lookout_tower', name: 'Goldenleaf Lookout', biome: 'safari', color: 0x9b7042, accent: 0x6f843d, form: 'tower' },
  water_trough: { id: 'water_trough', name: 'Watering Trough', biome: 'safari', color: 0x907757, accent: 0x5babb4, form: 'trough' },
  rope_bridge: { id: 'rope_bridge', name: 'Canopy Rope Bridge', biome: 'safari', color: 0x8b633a, accent: 0x709044, form: 'bridge' },
  safari_tent: { id: 'safari_tent', name: 'Goldenleaf Tent', biome: 'safari', color: 0xc49a53, accent: 0x765643, form: 'tent' },
};

const catalogFor = (entries, category) => Object.fromEntries(Object.values(entries).map((entry) => [entry.id, {
  category,
  path: `models/${entry.id}.glb`,
  placeholder: true,
}]));

export const MODEL_ASSETS = {
  ...catalogFor(Object.fromEntries(Object.entries(SPECIES).filter(([, entry]) => entry.form && ['hedgehog', 'bird', 'frog', 'squirrel', 'meerkat', 'tortoise', 'gecko', 'seal', 'hare', 'musk_ox', 'lion', 'hippo', 'warthog'].includes(entry.form))), 'wildlife'),
  ...catalogFor(Object.fromEntries(Object.entries(COLLECTIBLES).filter(([, entry]) => entry.form)), 'collectible'),
  ...catalogFor(STRUCTURES, 'structure'),
};

export const WORLD_LAYOUT = {
  grassland: {
    wildlife: [['butterfly', -0.055, -0.045], ['ladybug', 0.075, 0.025], ['red_panda', 0.14, -0.06], ['hedgehog', -0.18, 0.1], ['songbird', -0.24, -0.08], ['frog', 0.205, 0.085], ['squirrel', 0.255, -0.02]],
    collectibles: [['starflower', -0.025, 0.02], ['starflower', 0.055, -0.025], ['starflower', 0.125, 0.07], ['apple', -0.12, 0.06], ['clover_mushroom', -0.2, -0.03], ['acorn', 0.19, -0.11], ['dewberry', 0.235, 0.12], ['wild_mint', -0.27, 0.03]],
    structures: [['windmill', -0.29, 0.13], ['stone_bridge', -0.12, -0.14], ['birdhouse', 0.28, 0.14], ['picnic_shelter', 0.22, -0.14]],
  },
  desert: {
    wildlife: [['camel', -0.045, -0.025], ['fennec', 0.085, 0.05], ['fish', 0.14, -0.075], ['meerkat', -0.19, 0.09], ['desert_tortoise', -0.25, -0.05], ['roadrunner', 0.21, 0.1], ['gecko', 0.27, -0.02]],
    collectibles: [['sunpetal', 0.025, 0.035], ['sunpetal', 0.13, 0.08], ['smooth_stone', -0.1, -0.06], ['cactus_fruit', -0.2, 0.02], ['desert_pearl', 0.205, -0.11], ['amber_shard', 0.245, 0.12], ['date_cluster', -0.26, 0.1]],
    structures: [['oasis_well', -0.3, 0.14], ['sandstone_ruins', -0.12, -0.14], ['desert_tent', 0.28, 0.13], ['wind_tower', 0.23, -0.14]],
  },
  snow: {
    wildlife: [['penguin', -0.045, 0.04], ['polar_bear', 0.085, -0.035], ['arctic_fox', 0.145, 0.065], ['seal', -0.2, 0.1], ['snowy_owl', -0.27, -0.06], ['arctic_hare', 0.2, 0.11], ['musk_ox', 0.26, -0.025]],
    collectibles: [['snowdrop', 0.02, -0.035], ['ice_glass', -0.11, 0.06], ['ice_glass', 0.14, -0.06], ['frostberry', -0.2, 0.01], ['pinecone', 0.21, -0.1], ['aurora_shell', 0.24, 0.12], ['snow_crystal', -0.27, 0.1]],
    structures: [['igloo', -0.3, 0.14], ['ice_bridge', -0.12, -0.14], ['ranger_watchtower', 0.28, 0.13], ['sled_station', 0.22, -0.14]],
  },
  safari: {
    wildlife: [['zebra', -0.07, 0.02], ['giraffe', 0.025, -0.045], ['elephant', 0.105, 0.045], ['flamingo', 0.17, -0.07], ['crab', -0.15, -0.07], ['lion', -0.26, 0.1], ['hippo', -0.22, -0.12], ['warthog', 0.23, 0.12], ['hornbill', 0.28, -0.01]],
    collectibles: [['fallen_feather', -0.025, -0.025], ['fallen_feather', 0.14, 0.07], ['seed_pod', 0.055, 0.055], ['baobab_pod', -0.2, 0.01], ['amber_bead', 0.21, -0.1], ['river_reed', 0.245, 0.12], ['painted_stone', -0.27, 0.1]],
    structures: [['lookout_tower', -0.3, 0.14], ['water_trough', -0.12, -0.14], ['rope_bridge', 0.28, 0.13], ['safari_tent', 0.22, -0.14]],
  },
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
