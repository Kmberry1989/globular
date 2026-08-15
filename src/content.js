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
  snowy_owl_variant: { id: 'snowy_owl_variant', name: 'Speckled Snowy Owl', emoji: '🦉', biome: 'snow', note: 'A spotted snowy owl variant with darker flecks across its wings.', colors: [0xf5f4e8, 0x6f6658], form: 'bird' },
  arctic_hare: { id: 'arctic_hare', name: 'Frost Hare', emoji: '🐇', biome: 'snow', note: 'A soft white blur with long ears and an alert little nose.', colors: [0xf2f4ef, 0x71808a], form: 'hare' },
  musk_ox: { id: 'musk_ox', name: 'Northwind Musk Ox', emoji: '🐂', biome: 'snow', note: 'A shaggy, steady neighbor with curled horns built for winter.', colors: [0x573e36, 0xd6c7aa], form: 'musk_ox' },
  lion: { id: 'lion', name: 'Sunmane Lion', emoji: '🦁', biome: 'safari', note: 'A patient watcher whose mane glows at the edge of the grass.', colors: [0xc98b3d, 0x70452d], form: 'lion' },
  lion_variant: { id: 'lion_variant', name: 'Rockmane Lion', emoji: '🦁', biome: 'safari', note: 'A darker-maned lion variant that rests near warm stones.', colors: [0xb87836, 0x4b2f24], form: 'lion' },
  hippo: { id: 'hippo', name: 'Riverbank Hippo', emoji: '🦛', biome: 'safari', note: 'A cool-water giant with tiny ears and an enormous yawn.', colors: [0x7f7182, 0x514959], form: 'hippo' },
  warthog: { id: 'warthog', name: 'Brush Warthog', emoji: '🐗', biome: 'safari', note: 'It trots with its tail raised like a small grassland flag.', colors: [0x71533c, 0xe3d4b5], form: 'warthog' },
  hornbill: { id: 'hornbill', name: 'Golden Hornbill', emoji: '🐦', biome: 'safari', note: 'Its bright bill makes a flash of color in the canopy.', colors: [0x34383b, 0xe4aa37], form: 'bird' },
  willow_wren: { id: 'willow_wren', name: 'Willow Wren', emoji: '🐦', biome: 'grassland', note: 'The original field-guide bird is now a named meadow wren with a pale belly and quick hops.', colors: [0x8c7a52, 0xe9d7a6], form: 'bird' },
  cardinal: { id: 'cardinal', name: 'Northern Cardinal', emoji: '🐦', biome: 'grassland', note: 'A bright red songbird that perches where the clover paths meet the hedgerow.', colors: [0xc9252f, 0x3a2425], form: 'bird' },
  blue_jay: { id: 'blue_jay', name: 'Blue Jay', emoji: '🐦', biome: 'grassland', note: 'A bold blue-and-white bird with a crisp crest and black necklace markings.', colors: [0x3874c8, 0xf1f4ee], form: 'bird' },
  ruby_throated_hummingbird: { id: 'ruby_throated_hummingbird', name: 'Ruby-throated Hummingbird', emoji: '🐦', biome: 'grassland', note: 'A tiny hoverer with fast wings and a ruby flash at the throat.', colors: [0x2e9f68, 0xc22c44], form: 'bird' },
  red_tailed_hawk: { id: 'red_tailed_hawk', name: 'Red-tailed Hawk', emoji: '🦅', biome: 'desert', note: 'A broad-winged raptor circling over the warm sandstone ridges.', colors: [0x8a5d3d, 0xd3b17c], form: 'bird' },
  bald_eagle: { id: 'bald_eagle', name: 'Bald Eagle', emoji: '🦅', biome: 'snow', note: 'A strong-winged eagle with a white head, dark body, and bright hooked beak.', colors: [0x44352c, 0xf4f1df], form: 'bird' },
  firefly: { id: 'firefly', name: 'Dusk Firefly', emoji: '✨', biome: 'grassland', note: 'A tiny evening insect with a soft glowing tail.', colors: [0x30342c, 0xf4d35e], form: 'bug' },
  bumblebee: { id: 'bumblebee', name: 'Clover Bumblebee', emoji: '🐝', biome: 'grassland', note: 'A chunky striped pollinator that works low over bright flowers.', colors: [0xf2c94c, 0x2f2b25], form: 'bug' },
  dragonfly: { id: 'dragonfly', name: 'Oasis Dragonfly', emoji: '🪰', biome: 'desert', note: 'A slim-winged insect flashing blue near the oasis reeds.', colors: [0x5fb7c9, 0x2f5964], form: 'bug' },
  grasshopper: { id: 'grasshopper', name: 'Savanna Grasshopper', emoji: '🦗', biome: 'safari', note: 'A long-legged jumper that blends into the dry golden grass.', colors: [0x8fa353, 0xd0b35d], form: 'bug' },
  stag_beetle: { id: 'stag_beetle', name: 'Frost Stag Beetle', emoji: '🪲', biome: 'snow', note: 'A glossy dark beetle tucked beside hardy alpine roots.', colors: [0x2d3340, 0x96b5c6], form: 'bug' },
  monkey: { id: 'monkey', name: 'Canopy Monkey', emoji: '🐒', biome: 'safari', note: 'A nimble branch-leaper that watches the path from above.', colors: [0x8a5d3d, 0xd8b48a], form: 'monkey' },
  koala: { id: 'koala', name: 'Sleepy Koala', emoji: '🐨', biome: 'grassland', note: 'A soft gray tree-hugger visiting the meadow grove.', colors: [0x9fa6a8, 0xf0e8d6], form: 'koala' },
  ostrich: { id: 'ostrich', name: 'Plains Ostrich', emoji: '🐦', biome: 'safari', note: 'A tall runner with powerful legs and a long alert neck.', colors: [0x2f2c28, 0xd8c3a1], form: 'bird' },
  feline: { id: 'feline', name: 'Reed Cat', emoji: '🐈', biome: 'safari', note: 'A small spotted cat that slips quietly through the river reeds.', colors: [0xc89455, 0x513b2b], form: 'feline' },
  rabbit: { id: 'rabbit', name: 'Meadow Rabbit', emoji: '🐇', biome: 'grassland', note: 'A long-eared hopper that pauses at the edge of the clover paths.', colors: [0x8d7968, 0xd7c4ae], form: 'hare' },
  sheep: { id: 'sheep', name: 'Cloud Sheep', emoji: '🐑', biome: 'grassland', note: 'A woolly meadow grazer with a round cloudlike coat.', colors: [0xd9d4c9, 0x4b463f], form: 'quadruped' },
  cow: { id: 'cow', name: 'Patchwork Cow', emoji: '🐄', biome: 'grassland', note: 'A gentle field neighbor with black-and-white markings and small horns.', colors: [0xece8dd, 0x2b2f32], form: 'quadruped' },
  chicken: { id: 'chicken', name: 'Clover Chicken', emoji: '🐔', biome: 'grassland', note: 'A white barnyard bird that pecks quickly between the meadow flowers.', colors: [0xefeee8, 0xc83d28], form: 'bird' },
  deer: { id: 'deer', name: 'Spotted Meadow Deer', emoji: '🦌', biome: 'grassland', note: 'A careful grazer with pale spots and small branching antlers.', colors: [0xb5773d, 0xf0dbb9], form: 'quadruped' },
  lizard: { id: 'lizard', name: 'Painted Dune Lizard', emoji: '🦎', biome: 'desert', note: 'A bright low-bellied runner with a long tapering tail.', colors: [0xe36d38, 0x2d9b9a], form: 'gecko' },
  scorpion: { id: 'scorpion', name: 'Shadeclaw Scorpion', emoji: '🦂', biome: 'desert', note: 'A dark desert hunter with pincers and a curled raised tail.', colors: [0x23202a, 0x6d5b47], form: 'bug' },
  snake: { id: 'snake', name: 'Sand Ribbon Snake', emoji: '🐍', biome: 'desert', note: 'A smooth S-curve of warm sand color slipping over flat stones.', colors: [0xb4864f, 0x6c5136], form: 'snake' },
  dolphin: { id: 'dolphin', name: 'Oasis Dolphin', emoji: '🐬', biome: 'desert', note: 'A blue arcing visitor that surfaces in the deepest oasis pocket.', colors: [0x246fbd, 0xd8edf4], form: 'fish' },
  aquatic_turtle: { id: 'aquatic_turtle', name: 'Oasis Turtle', emoji: '🐢', biome: 'desert', note: 'A paddle-flipper turtle gliding through the shaded oasis water.', colors: [0x597b3f, 0xb0b36a], form: 'tortoise' },
  walrus: { id: 'walrus', name: 'Tusked Walrus', emoji: '🦭', biome: 'snow', note: 'A heavy brown icebank neighbor with long ivory tusks.', colors: [0x6f4933, 0xe7d6b6], form: 'seal' },
  moose: { id: 'moose', name: 'Paddlehorn Moose', emoji: '🫎', biome: 'snow', note: 'A tall dark wanderer with broad antlers that read from far away.', colors: [0x3c2f29, 0xa88755], form: 'quadruped' },
  whale: { id: 'whale', name: 'Blue Ice Whale', emoji: '🐋', biome: 'snow', note: 'A huge blue shape seen breaching beyond the Frostcap ice.', colors: [0x1f5ea8, 0xd5e6ee], form: 'fish' },
  rhino: { id: 'rhino', name: 'Stonehide Rhino', emoji: '🦏', biome: 'safari', note: 'A sturdy grey browser with a strong front horn and heavy stance.', colors: [0x656a6d, 0x393d40], form: 'quadruped' },
  duck: { id: 'duck', name: 'River Mallard', emoji: '🦆', biome: 'safari', note: 'A green-headed duck that bobs at the watering hollow.', colors: [0x2b6a3f, 0x8a5a35], form: 'bird' },
  parrot: { id: 'parrot', name: 'Canopy Parrot', emoji: '🦜', biome: 'safari', note: 'A bright red-and-blue perch bird with a bold hooked beak.', colors: [0xc7332f, 0x2f67b7], form: 'bird' },
  seagull: { id: 'seagull', name: 'River Gull', emoji: '🐦', biome: 'safari', note: 'A pale water-edge bird with grey wings and a yellow beak.', colors: [0xe8e5dc, 0x626870], form: 'bird' },
  ostrich_variant: { id: 'ostrich_variant', name: 'Greytail Ostrich', emoji: '🐦', biome: 'safari', note: 'A second ostrich silhouette with softer grey tail feathers.', colors: [0x262422, 0xd7c1a3], form: 'bird' },
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
  daisy: { id: 'daisy', name: 'Meadow Daisy', emoji: '🌼', value: 44, color: 0xf5f1c8, biome: 'grassland', form: 'flower', note: 'White petals around a warm yellow center make this meadow flower easy to identify.' },
  bluebell: { id: 'bluebell', name: 'Clover Bluebell', emoji: '🪻', value: 46, color: 0x6d82d8, biome: 'grassland', form: 'flower', note: 'A drooping violet-blue bell flower with a thin arched stem.' },
  red_clover: { id: 'red_clover', name: 'Red Clover Bloom', emoji: '🌸', value: 48, color: 0xd76a9f, biome: 'grassland', form: 'flower', note: 'A round pink clover head made from many tiny clustered petals.' },
  black_eyed_susan: { id: 'black_eyed_susan', name: 'Black-eyed Susan', emoji: '🌻', value: 52, color: 0xf0b83f, biome: 'grassland', form: 'flower', note: 'Golden ray petals around a dark raised center make this meadow bloom distinct.' },
  lavender_spike: { id: 'lavender_spike', name: 'Lavender Spike', emoji: '🪻', value: 50, color: 0x9b7bd2, biome: 'grassland', form: 'flower', note: 'A slim purple flower spike with stacked blossoms and gray-green leaves.' },
  desert_marigold: { id: 'desert_marigold', name: 'Desert Marigold', emoji: '🌼', value: 66, color: 0xf2b438, biome: 'desert', form: 'flower', note: 'A golden bloom that survives in dry sand with a low rosette of leaves.' },
  prickly_pear_blossom: { id: 'prickly_pear_blossom', name: 'Prickly Pear Blossom', emoji: '🌺', value: 72, color: 0xffce55, biome: 'desert', form: 'flower', note: 'A waxy yellow cactus flower that grows from a flat green pad.' },
  desert_lupine: { id: 'desert_lupine', name: 'Desert Lupine', emoji: '🪻', value: 70, color: 0x6b65c8, biome: 'desert', form: 'flower', note: 'A purple-blue cone of pea-shaped blooms rising above sandy leaves.' },
  evening_primrose: { id: 'evening_primrose', name: 'Evening Primrose', emoji: '🌼', value: 68, color: 0xfff0a8, biome: 'desert', form: 'flower', note: 'A pale four-petal desert flower with a soft glowing cup shape.' },
  firecracker_penstemon: { id: 'firecracker_penstemon', name: 'Firecracker Penstemon', emoji: '🌺', value: 74, color: 0xe84d3d, biome: 'desert', form: 'flower', note: 'A red tubular flower cluster with upright stems and pointed leaves.' },
  arctic_poppy: { id: 'arctic_poppy', name: 'Arctic Poppy', emoji: '🌼', value: 72, color: 0xffe36a, biome: 'snow', form: 'flower', note: 'A small yellow flower that turns its cup toward the pale winter sun.' },
  edelweiss: { id: 'edelweiss', name: 'Frost Edelweiss', emoji: '✳️', value: 82, color: 0xf0f1df, biome: 'snow', form: 'flower', note: 'A star-shaped white alpine flower with woolly leaves around a pale center.' },
  alpine_forget_me_not: { id: 'alpine_forget_me_not', name: 'Alpine Forget-me-not', emoji: '🌸', value: 78, color: 0x74a8ff, biome: 'snow', form: 'flower', note: 'Tiny sky-blue petals around a yellow eye, clustered close to the snow.' },
  glacier_lily: { id: 'glacier_lily', name: 'Glacier Lily', emoji: '🌼', value: 80, color: 0xffdf5f, biome: 'snow', form: 'flower', note: 'A nodding yellow lily with swept-back petals and narrow cold-weather leaves.' },
  purple_saxifrage: { id: 'purple_saxifrage', name: 'Purple Saxifrage', emoji: '🌸', value: 84, color: 0xb64fa7, biome: 'snow', form: 'flower', note: 'A low cushion of vivid purple blooms tucked into frosty stones.' },
  savanna_lily: { id: 'savanna_lily', name: 'Savanna Lily', emoji: '🌺', value: 76, color: 0xf08a58, biome: 'safari', form: 'flower', note: 'A warm orange lily rising above dry grass near the watering hollow.' },
  flame_lily: { id: 'flame_lily', name: 'Flame Lily', emoji: '🌺', value: 88, color: 0xf04e37, biome: 'safari', form: 'flower', note: 'A climbing red-and-yellow lily with curled flame-like petals.' },
  bird_of_paradise_flower: { id: 'bird_of_paradise_flower', name: 'Bird of Paradise Flower', emoji: '🌺', value: 92, color: 0xf28a2e, biome: 'safari', form: 'flower', note: 'A tall orange-and-blue bloom with a crane-like angled silhouette.' },
  aloe_bloom: { id: 'aloe_bloom', name: 'Aloe Torch Bloom', emoji: '🌺', value: 84, color: 0xe46b48, biome: 'safari', form: 'flower', note: 'A red-orange torch of small tubular flowers above spiky green aloe leaves.' },
  acacia_blossom: { id: 'acacia_blossom', name: 'Acacia Puff Blossom', emoji: '🌼', value: 82, color: 0xf4d15f, biome: 'safari', form: 'flower', note: 'A round yellow puff flower with small paired leaves on a woody sprig.' },
  orange: { id: 'orange', name: 'Trail Orange', emoji: '🍊', value: 58, color: 0xf28c28, biome: 'safari', form: 'fruit', note: 'A round orange trail fruit with a glossy low-poly peel.' },
  coin: { id: 'coin', name: 'Field Token', emoji: '🪙', value: 90, color: 0xf0c85a, biome: 'desert', form: 'coin', note: 'A bright token left by earlier researchers to mark a safe route.' },
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
  ranger_watchtower_variant: { id: 'ranger_watchtower_variant', name: 'Aurora Watchtower', biome: 'snow', color: 0x6f8fa2, accent: 0xc9f0ea, form: 'tower', note: 'A frost watchtower variant with cooler aurora-tinted trim.' },
  sled_station: { id: 'sled_station', name: 'Sled Station', biome: 'snow', color: 0xbb7161, accent: 0xdde9e8, form: 'shelter' },
  lookout_tower: { id: 'lookout_tower', name: 'Goldenleaf Lookout', biome: 'safari', color: 0x9b7042, accent: 0x6f843d, form: 'tower' },
  water_trough: { id: 'water_trough', name: 'Watering Trough', biome: 'safari', color: 0x907757, accent: 0x5babb4, form: 'trough' },
  rope_bridge: { id: 'rope_bridge', name: 'Canopy Rope Bridge', biome: 'safari', color: 0x8b633a, accent: 0x709044, form: 'bridge' },
  safari_tent: { id: 'safari_tent', name: 'Goldenleaf Tent', biome: 'safari', color: 0xc49a53, accent: 0x765643, form: 'tent' },
  safari_tent_variant: { id: 'safari_tent_variant', name: 'Riverland Research Tent', biome: 'safari', color: 0xb98c49, accent: 0x5f7650, form: 'tent', note: 'A lower research tent variant with green field canvas.' },
  bush: { id: 'bush', name: 'Clover Berry Bush', biome: 'grassland', color: 0x5f9b58, accent: 0xd96b7b, form: 'bush', note: 'A rounded berry bush used as a clear low shrub silhouette.' },
  oak_tree: { id: 'oak_tree', name: 'Roundleaf Oak', biome: 'grassland', color: 0x4f8b4b, accent: 0x805538, form: 'tree', note: 'A broad-canopy oak with a chunky trunk and readable round leaves.' },
  palm_tree: { id: 'palm_tree', name: 'Oasis Date Palm', biome: 'desert', color: 0x6f9d5d, accent: 0x8b5a32, form: 'tree', note: 'A tall palm with fan-like leaves and a warm desert trunk.' },
  pine_tree: { id: 'pine_tree', name: 'Frost Pine', biome: 'snow', color: 0x7eb2a9, accent: 0x6d5745, form: 'tree', note: 'A conical evergreen with snow-dusted layered branches.' },
  baobab_tree: { id: 'baobab_tree', name: 'Riverland Baobab', biome: 'safari', color: 0x8f9046, accent: 0x8b6138, form: 'tree', note: 'A thick-trunked savanna tree with a flattened leafy crown.' },
  legacy_player_model: { id: 'legacy_player_model', name: 'Legacy Roamer Mannequin', biome: 'safari', color: 0x4b91c7, accent: 0xd8b48a, form: 'statue', model: 'player', note: 'The old single-piece player model is now a reference mannequin while the live player moves to modular parts.' },
  hay_bale: { id: 'hay_bale', name: 'Meadow Hay Bale', biome: 'grassland', color: 0xb28b38, accent: 0x6b5127, form: 'prop', note: 'A low rectangular straw bale used for cozy meadow dressing.' },
  clover_patch: { id: 'clover_patch', name: 'Dense Clover Patch', biome: 'grassland', color: 0x496b38, accent: 0x8baf63, form: 'bush', note: 'A low patch of clustered clover leaves for ground-level photos.' },
  fern_cluster: { id: 'fern_cluster', name: 'Fern Cluster', biome: 'grassland', color: 0x3f6b3d, accent: 0x7fa36d, form: 'bush', note: 'A dense cluster of low leafy ferns tucked beside the trail.' },
  mossy_rocks: { id: 'mossy_rocks', name: 'Mossy Rocks', biome: 'grassland', color: 0x627052, accent: 0x3d5e36, form: 'rock', note: 'A low rock group softened by green moss.' },
  fallen_log: { id: 'fallen_log', name: 'Fallen Meadow Log', biome: 'grassland', color: 0x6f4b32, accent: 0x3a261c, form: 'prop', note: 'A grounded branch pile that adds natural trail cover.' },
  barrel_cactus: { id: 'barrel_cactus', name: 'Barrel Cactus', biome: 'desert', color: 0x2f6f42, accent: 0xb8a16c, form: 'cactus', note: 'A rounded ribbed cactus with visible thorn detail.' },
  succulent_cluster: { id: 'succulent_cluster', name: 'Succulent Cluster', biome: 'desert', color: 0x2d7c45, accent: 0x78a36c, form: 'bush', note: 'A compact desert succulent cluster for low dry-ground dressing.' },
  dry_grass_patch: { id: 'dry_grass_patch', name: 'Dry Grass Patch', biome: 'desert', color: 0xa68a42, accent: 0x5a4b2b, form: 'grass', note: 'A straw-colored patch of hardy desert grass.' },
  wooden_fence: { id: 'wooden_fence', name: 'Weathered Fence', biome: 'desert', color: 0x8d7048, accent: 0x57412b, form: 'fence', note: 'A simple rail fence marking an old safe route.' },
  oasis_pool: { id: 'oasis_pool', name: 'Oasis Pool', biome: 'desert', color: 0x1f6f83, accent: 0x9fd4d6, form: 'water', note: 'A shallow blue oasis pool that anchors water-edge wildlife.' },
  desert_shrub: { id: 'desert_shrub', name: 'Desert Shrub', biome: 'desert', color: 0x596341, accent: 0x9c9060, form: 'bush', note: 'A low dry shrub shaped for readability on sand.' },
  frost_rock_cluster: { id: 'frost_rock_cluster', name: 'Frost Rock Cluster', biome: 'snow', color: 0x8ca6b5, accent: 0xd8e7ed, form: 'rock', note: 'A cool blue-grey rock group for snowfield dressing.' },
  shadow_pool: { id: 'shadow_pool', name: 'Shadowed Ice Pool', biome: 'snow', color: 0x263646, accent: 0x6fa6bc, form: 'water', note: 'A thin dark meltwater pool that reads against pale snow.' },
  snow_pine_tree: { id: 'snow_pine_tree', name: 'Snow Pine Variant', biome: 'snow', color: 0x6d978d, accent: 0xe6f0ef, form: 'tree', note: 'A smaller snow-dusted pine variant for colder paths.' },
  acacia_tree: { id: 'acacia_tree', name: 'Flat-top Acacia', biome: 'safari', color: 0x335c3e, accent: 0x6a432b, form: 'tree', note: 'A flat-canopy savanna tree with a compact readable trunk.' },
  wooden_platform: { id: 'wooden_platform', name: 'Ranger Platform', biome: 'safari', color: 0x7b5632, accent: 0x4a3525, form: 'platform', note: 'A low wooden ranger platform for camp-edge dressing.' },
  young_palm_tree: { id: 'young_palm_tree', name: 'Young Palm', biome: 'safari', color: 0x4f7d41, accent: 0x7a5832, form: 'tree', note: 'A shorter palm silhouette for layering around river paths.' },
};

const MODEL_FILE_OVERRIDES = {
  red_panda: 'redpanda',
  polar_bear: 'polarbear',
  arctic_fox: 'fox',
  fennec: 'fox',
  willow_wren: 'bird',
  starflower: 'flower',
  sunpetal: 'flower',
  snowdrop: 'flower',
  ice_glass: 'ice_patch',
  seed_pod: 'baobab_pod',
};

const modelFileFor = (entry) => entry.model || MODEL_FILE_OVERRIDES[entry.id] || entry.id;

const catalogFor = (entries, category) => Object.fromEntries(Object.values(entries).map((entry) => [entry.id, {
  category,
  path: `models/${modelFileFor(entry)}.glb`,
  placeholder: true,
}]));

export const MODEL_ASSETS = {
  ...catalogFor(SPECIES, 'wildlife'),
  ...catalogFor(COLLECTIBLES, 'collectible'),
  ...catalogFor(STRUCTURES, 'structure'),
};

// These are the next production-facing prop slots. Their current files are
// intentionally lightweight placeholders or existing low-poly stand-ins;
// keeping the paths canonical lets artists replace them without touching the
// world layout or gameplay code.
export const WORLD_PROP_ASSETS = {
  tree: { category: 'environment', path: 'models/tree.glb', role: 'Meadow, desert, snow, and safari dressing' },
  cactus: { category: 'environment', path: 'models/cactus.glb', role: 'Desert dressing' },
  ice_patch: { category: 'environment', path: 'models/ice_patch.glb', role: 'Snow dressing and frost landmark' },
  picnic_shelter: { category: 'landmark', path: 'models/picnic_shelter.glb', role: 'Grassland research station' },
  sandstone_ruins: { category: 'landmark', path: 'models/sandstone_ruins.glb', role: 'Desert arrival arch' },
};

export const CHARACTER_MODEL_ASSETS = {
  ranger_grassland: { category: 'character', path: 'models/ranger_grassland.glb', role: 'Mira, Clover Commons ranger' },
  ranger_desert: { category: 'character', path: 'models/ranger_desert.glb', role: 'Sol, Sunpetal Sands ranger' },
  ranger_snow: { category: 'character', path: 'models/ranger_snow.glb', role: 'Nivi, Frostcap Reach ranger' },
  ranger_safari: { category: 'character', path: 'models/ranger_safari.glb', role: 'Kito, Goldenleaf Wilds ranger' },
  camera: { category: 'equipment', path: 'models/camera.glb', role: 'Held camera prop on the modular player' },
};

export const ALL_MODEL_ASSETS = {
  ...MODEL_ASSETS,
  ...WORLD_PROP_ASSETS,
  ...CHARACTER_MODEL_ASSETS,
};

const photoSubjectFromSpecies = (entry) => ({
  id: entry.id,
  name: entry.name,
  emoji: entry.emoji,
  biome: entry.biome,
  note: entry.note,
  category: 'Wildlife',
});

const photoSubjectFromCollectible = (entry) => ({
  id: entry.id,
  name: entry.name,
  emoji: entry.emoji,
  biome: entry.biome,
  note: entry.note || `A recognizable ${entry.name.toLowerCase()} specimen for the field guide.`,
  category: ['flower', 'sprig', 'reed', 'fruit', 'berry', 'pod', 'pinecone'].includes(entry.form) ? 'Plants' : 'Finds',
});

const photoSubjectFromStructure = (entry) => ({
  id: entry.id,
  name: entry.name,
  emoji: entry.form === 'tree' ? '🌳' : entry.form === 'bush' ? '🌿' : '🏕️',
  biome: entry.biome,
  note: entry.note || `A ${entry.name.toLowerCase()} landmark documented during the orbit.`,
  category: entry.form === 'tree' || entry.form === 'bush' ? 'Trees & Plants' : 'Landmarks',
});

export const PHOTO_SUBJECTS = {
  ...Object.fromEntries(Object.values(SPECIES).map((entry) => [entry.id, photoSubjectFromSpecies(entry)])),
  ...Object.fromEntries(Object.values(COLLECTIBLES).map((entry) => [entry.id, photoSubjectFromCollectible(entry)])),
  ...Object.fromEntries(Object.values(STRUCTURES).map((entry) => [entry.id, photoSubjectFromStructure(entry)])),
};

export const WORLD_LAYOUT = {
  grassland: {
    wildlife: [['butterfly', -0.055, -0.045], ['ladybug', 0.075, 0.025], ['red_panda', 0.14, -0.06], ['hedgehog', -0.18, 0.1], ['songbird', -0.24, -0.08], ['frog', 0.205, 0.085], ['squirrel', 0.255, -0.02], ['willow_wren', -0.305, -0.125], ['cardinal', -0.33, 0.025], ['blue_jay', 0.325, 0.075], ['ruby_throated_hummingbird', 0.32, -0.105], ['firefly', -0.16, -0.125], ['bumblebee', 0.17, 0.145], ['koala', 0.03, 0.145], ['rabbit', -0.37, 0.035], ['sheep', -0.08, 0.145], ['cow', 0.105, -0.145], ['chicken', 0.37, 0.015], ['deer', 0.37, -0.125]],
    collectibles: [['starflower', -0.025, 0.02], ['starflower', 0.055, -0.025], ['starflower', 0.125, 0.07], ['apple', -0.12, 0.06], ['clover_mushroom', -0.2, -0.03], ['acorn', 0.19, -0.11], ['dewberry', 0.235, 0.12], ['wild_mint', -0.27, 0.03], ['daisy', -0.34, 0.11], ['bluebell', -0.31, -0.125], ['red_clover', -0.245, 0.135], ['black_eyed_susan', 0.295, -0.055], ['lavender_spike', 0.325, 0.125]],
    structures: [['windmill', -0.29, 0.13], ['stone_bridge', -0.12, -0.14], ['birdhouse', 0.28, 0.14], ['picnic_shelter', 0.22, -0.14], ['bush', -0.335, -0.055], ['oak_tree', 0.335, -0.15], ['hay_bale', 0.13, 0.16], ['clover_patch', -0.37, -0.02], ['fern_cluster', -0.02, -0.16], ['mossy_rocks', 0.24, 0.03], ['fallen_log', -0.245, -0.16]],
  },
  desert: {
    wildlife: [['camel', -0.045, -0.025], ['fennec', 0.085, 0.05], ['fish', 0.14, -0.075], ['meerkat', -0.19, 0.09], ['desert_tortoise', -0.25, -0.05], ['roadrunner', 0.21, 0.1], ['gecko', 0.27, -0.02], ['red_tailed_hawk', -0.315, -0.115], ['dragonfly', 0.32, 0.105], ['lizard', -0.365, 0.055], ['scorpion', -0.35, -0.055], ['snake', 0.365, -0.025], ['dolphin', 0.03, -0.145], ['aquatic_turtle', 0.36, 0.12]],
    collectibles: [['sunpetal', 0.025, 0.035], ['sunpetal', 0.13, 0.08], ['smooth_stone', -0.1, -0.06], ['cactus_fruit', -0.2, 0.02], ['desert_pearl', 0.205, -0.11], ['amber_shard', 0.245, 0.12], ['date_cluster', -0.26, 0.1], ['desert_marigold', -0.335, 0.025], ['coin', 0.335, -0.06], ['prickly_pear_blossom', -0.315, -0.13], ['desert_lupine', -0.235, 0.135], ['evening_primrose', 0.285, 0.02], ['firecracker_penstemon', 0.33, 0.13]],
    structures: [['oasis_well', -0.3, 0.14], ['sandstone_ruins', -0.12, -0.14], ['desert_tent', 0.28, 0.13], ['wind_tower', 0.23, -0.14], ['palm_tree', 0.335, 0.02], ['barrel_cactus', -0.37, 0.13], ['succulent_cluster', -0.16, 0.16], ['dry_grass_patch', 0.05, 0.16], ['wooden_fence', 0.36, -0.13], ['oasis_pool', 0.16, -0.15], ['desert_shrub', -0.245, -0.145]],
  },
  snow: {
    wildlife: [['penguin', -0.045, 0.04], ['polar_bear', 0.085, -0.035], ['arctic_fox', 0.145, 0.065], ['seal', -0.2, 0.1], ['snowy_owl', -0.27, -0.06], ['snowy_owl_variant', -0.335, 0.13], ['arctic_hare', 0.2, 0.11], ['musk_ox', 0.26, -0.025], ['bald_eagle', -0.325, -0.12], ['stag_beetle', 0.325, 0.075], ['walrus', -0.365, 0.025], ['moose', 0.365, -0.055], ['whale', -0.095, -0.145]],
    collectibles: [['snowdrop', 0.02, -0.035], ['ice_glass', -0.11, 0.06], ['ice_glass', 0.14, -0.06], ['frostberry', -0.2, 0.01], ['pinecone', 0.21, -0.1], ['aurora_shell', 0.24, 0.12], ['snow_crystal', -0.27, 0.1], ['arctic_poppy', 0.335, -0.045], ['edelweiss', -0.335, -0.11], ['alpine_forget_me_not', -0.235, 0.135], ['glacier_lily', 0.295, 0.1], ['purple_saxifrage', 0.325, -0.135]],
    structures: [['igloo', -0.3, 0.14], ['ice_bridge', -0.12, -0.14], ['ranger_watchtower', 0.28, 0.13], ['ranger_watchtower_variant', 0.335, -0.13], ['sled_station', 0.22, -0.14], ['pine_tree', -0.335, 0.025], ['frost_rock_cluster', -0.37, -0.095], ['shadow_pool', 0.11, -0.155], ['snow_pine_tree', 0.37, 0.11]],
  },
  safari: {
    wildlife: [['zebra', -0.07, 0.02], ['giraffe', 0.025, -0.045], ['elephant', 0.105, 0.045], ['flamingo', 0.17, -0.07], ['crab', -0.15, -0.07], ['lion', -0.26, 0.1], ['lion_variant', -0.335, 0.14], ['hippo', -0.22, -0.12], ['warthog', 0.23, 0.12], ['hornbill', 0.28, -0.01], ['ostrich', -0.335, -0.12], ['monkey', 0.335, 0.04], ['feline', 0.05, 0.145], ['grasshopper', -0.06, -0.145], ['rhino', -0.365, 0.015], ['duck', 0.365, -0.045], ['parrot', 0.365, 0.12], ['seagull', 0.12, -0.15], ['ostrich_variant', -0.365, -0.135]],
    collectibles: [['fallen_feather', -0.025, -0.025], ['fallen_feather', 0.14, 0.07], ['seed_pod', 0.055, 0.055], ['baobab_pod', -0.2, 0.01], ['amber_bead', 0.21, -0.1], ['river_reed', 0.245, 0.12], ['painted_stone', -0.27, 0.1], ['savanna_lily', -0.335, 0.02], ['orange', 0.335, -0.085], ['flame_lily', -0.315, -0.125], ['bird_of_paradise_flower', -0.225, 0.135], ['aloe_bloom', 0.285, 0.11], ['acacia_blossom', 0.33, -0.02]],
    structures: [['lookout_tower', -0.3, 0.14], ['water_trough', -0.12, -0.14], ['rope_bridge', 0.28, 0.13], ['safari_tent', 0.22, -0.14], ['safari_tent_variant', 0.335, -0.135], ['baobab_tree', -0.335, 0.115], ['legacy_player_model', -0.335, -0.145], ['acacia_tree', -0.37, 0.045], ['wooden_platform', 0.37, 0.0], ['young_palm_tree', 0.16, 0.15]],
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
