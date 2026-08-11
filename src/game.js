import * as THREE from 'three';
import {
  BIOME_ORDER,
  BIOMES,
  COLLECTIBLES,
  COSMETICS,
  PHOTO_SUBJECTS,
  SPECIES,
  STRUCTURES,
  WORLD_LAYOUT,
  biomeForLongitude,
  currentChapter,
  normalizeLongitude,
} from './content.js';
import {
  clearPhotos,
  clearProgress,
  createDefaultSave,
  loadPhoto,
  saveProgress,
  storePhoto,
} from './persistence.js';
import { PhotographySystem } from './photography.js';
import { calculateInventoryValue, isBiomeRequestComplete } from './progression.js';
import { ModelLibrary, modelIdForCollectible, modelIdForSpecies, modelIdForStructure } from './model-assets.js';

const cameraSoundUrl = new URL('../sounds/camera.wav', import.meta.url).href;
const GLOBE_RADIUS = 28;
const PLAYER_POSITION = new THREE.Vector3(0, 0, 0);
const MOVE_SPEED = 0.25;
const LATITUDE_LIMIT = 0.31;
const INTERACTION_DISTANCE = 2.7;
const FIRST_PERSON_EYE = new THREE.Vector3(0, 1.55, -0.48);
const FIRST_PERSON_LOOK = new THREE.Vector3(0, 0.12, 7.1);
const FIRST_PERSON_CAMERA_EYE = new THREE.Vector3(0, 1.5, -0.34);
const FIRST_PERSON_CAMERA_LOOK = new THREE.Vector3(0, 0, 7.6);

const MODEL_SPANS = {
  butterfly: 0.55, ladybug: 0.26, red_panda: 0.9, hedgehog: 0.55, songbird: 0.65, frog: 0.45, squirrel: 0.7,
  willow_wren: 0.48, cardinal: 0.54, blue_jay: 0.58, ruby_throated_hummingbird: 0.32, firefly: 0.22, bumblebee: 0.24, koala: 0.85,
  camel: 1.65, fennec: 0.62, meerkat: 0.55, desert_tortoise: 0.78, roadrunner: 0.9, gecko: 0.42,
  red_tailed_hawk: 1.05, dragonfly: 0.36,
  fish: 0.7, penguin: 1.05, polar_bear: 1.8, arctic_fox: 0.75, seal: 1.35, snowy_owl: 0.85, arctic_hare: 0.65, musk_ox: 1.55,
  bald_eagle: 1.12, snowy_owl_variant: 0.86, stag_beetle: 0.28,
  zebra: 1.6, giraffe: 2.9, elephant: 2.2, flamingo: 1.75, crab: 0.55, lion: 1.45, hippo: 1.7, warthog: 0.9, hornbill: 0.8,
  lion_variant: 1.45, ostrich: 1.8, monkey: 0.82, feline: 0.68, grasshopper: 0.3,
  windmill: 2.5, stone_bridge: 2.6, birdhouse: 1.55, picnic_shelter: 2.4,
  oasis_well: 1.35, sandstone_ruins: 2.1, desert_tent: 1.8, wind_tower: 3.1,
  igloo: 1.65, ice_bridge: 2.8, ranger_watchtower: 3.3, ranger_watchtower_variant: 3.1, sled_station: 2.5,
  lookout_tower: 3.1, water_trough: 1.65, rope_bridge: 2.9, safari_tent: 2.0, safari_tent_variant: 1.8,
  bush: 1.0, oak_tree: 2.5, palm_tree: 2.6, pine_tree: 2.4, baobab_tree: 3.2, legacy_player_model: 1.9,
  daisy: 0.42, desert_marigold: 0.44, arctic_poppy: 0.36, savanna_lily: 0.5, orange: 0.4, coin: 0.32,
  ranger_grassland: 1.25, ranger_desert: 1.3, ranger_snow: 1.35, ranger_safari: 1.35, camera: 0.46,
};

const WEATHER = {
  grassland: [
    { id: 'meadow-breeze', label: 'Meadow breeze', kind: 'pollen', tint: 0xe9f7d5, fog: 63, sun: 1 },
    { id: 'spring-shower', label: 'Spring shower', kind: 'rain', tint: 0x9fb6c6, fog: 38, sun: 0.66 },
    { id: 'clear-meadow', label: 'Clear meadow', kind: 'none', tint: 0xffffff, fog: 72, sun: 1.12 },
  ],
  desert: [
    { id: 'sun-haze', label: 'Sun haze', kind: 'haze', tint: 0xffe0a4, fog: 48, sun: 1.15 },
    { id: 'dust-gust', label: 'Dust gust', kind: 'dust', tint: 0xdab06e, fog: 31, sun: 0.78 },
    { id: 'clear-dunes', label: 'Clear dunes', kind: 'none', tint: 0xffffff, fog: 70, sun: 1.2 },
  ],
  snow: [
    { id: 'crisp-air', label: 'Crisp air', kind: 'none', tint: 0xf0fbff, fog: 70, sun: 1.03 },
    { id: 'gentle-snow', label: 'Gentle snow', kind: 'snow', tint: 0xddeeff, fog: 43, sun: 0.74 },
    { id: 'frost-flurry', label: 'Frost flurry', kind: 'snow', tint: 0xc7d9ea, fog: 30, sun: 0.58 },
  ],
  safari: [
    { id: 'golden-hour', label: 'Golden hour', kind: 'pollen', tint: 0xffdf9c, fog: 62, sun: 1.1 },
    { id: 'savanna-rain', label: 'Savanna rain', kind: 'rain', tint: 0xa7b8b8, fog: 40, sun: 0.65 },
    { id: 'dry-wind', label: 'Dry wind', kind: 'dust', tint: 0xe7bd72, fog: 42, sun: 0.86 },
  ],
};

function hexToNumber(color) {
  return Number.parseInt(color.replace('#', ''), 16);
}

function roundedMaterial(color, roughness = 0.8) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02, flatShading: true });
}

function mesh(geometry, color, { y = 0, castShadow = true, receiveShadow = false } = {}) {
  const result = new THREE.Mesh(geometry, roundedMaterial(color));
  result.position.y = y;
  result.castShadow = castShadow;
  result.receiveShadow = receiveShadow;
  return result;
}

function surfaceVector(longitude, latitude, radius = GLOBE_RADIUS) {
  const cosLatitude = Math.cos(latitude);
  return new THREE.Vector3(
    Math.sin(longitude) * cosLatitude * radius,
    Math.cos(longitude) * cosLatitude * radius,
    Math.sin(latitude) * radius,
  );
}

function positionOnGlobe(object, longitude, latitude, altitude = 0) {
  const position = surfaceVector(longitude, latitude, GLOBE_RADIUS + altitude);
  object.position.copy(position);
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize());
}

function makeRanger(biome) {
  const root = new THREE.Group();
  const body = mesh(new THREE.CapsuleGeometry(0.38, 0.62, 4, 8), biome.ranger.color, { y: 0.75 });
  const head = mesh(new THREE.SphereGeometry(0.38, 10, 8), 0xd49a72, { y: 1.62 });
  const hat = mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.17, 10), biome.color, { y: 1.94 });
  const brim = mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.07, 12), biome.color, { y: 1.83 });
  const pack = mesh(new THREE.BoxGeometry(0.52, 0.62, 0.24), 0x6b5037, { y: 0.87 });
  pack.position.z = -0.38;
  const face = mesh(new THREE.SphereGeometry(0.055, 6, 6), 0x26352f, { y: 1.68 });
  face.position.z = 0.36;
  root.add(body, head, hat, brim, pack, face);
  root.userData.kind = 'ranger';
  root.userData.biomeId = biome.id;
  return root;
}

function makePlayer(save) {
  const root = new THREE.Group();
  root.name = 'player';
  const legs = new THREE.Group();
  for (const x of [-0.18, 0.18]) {
    const leg = mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.62, 7), 0x30455b, { y: 0.35 });
    leg.position.x = x;
    legs.add(leg);
  }
  const torso = mesh(new THREE.CapsuleGeometry(0.38, 0.6, 4, 8), hexToNumber(save.appearance.shirt), { y: 1.05 });
  torso.name = 'jacket';
  const head = mesh(new THREE.SphereGeometry(0.37, 12, 10), hexToNumber(save.appearance.skin), { y: 1.9 });
  const hair = mesh(new THREE.SphereGeometry(0.39, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), 0x5b3828, { y: 2.02 });
  const cameraRig = new THREE.Group();
  cameraRig.name = 'held-camera-slot';
  const camera = mesh(new THREE.BoxGeometry(0.42, 0.3, 0.22), 0x26352f, { y: 1.04 });
  camera.position.z = 0.4;
  const lens = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.14, 10), 0x6fa9a4, { y: 1.04 });
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.55;
  cameraRig.add(camera, lens);
  const strapMaterial = new THREE.MeshBasicMaterial({ color: 0xd2a54d });
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.025, 6, 20, Math.PI), strapMaterial);
  strap.rotation.z = Math.PI;
  strap.position.set(0, 1.32, 0.25);
  strap.name = 'camera-strap';
  root.add(legs, torso, head, hair, cameraRig, strap);
  updatePlayerCosmetic(root, save.equippedCosmetic);
  return root;
}

function updatePlayerCosmetic(player, cosmeticId) {
  player.getObjectByName('equipped-hat')?.removeFromParent();
  const strap = player.getObjectByName('camera-strap');
  if (strap) strap.visible = cosmeticId === 'camera_strap' || cosmeticId === 'first_orbit_crown';
  let hat = null;
  if (cosmeticId === 'field_cap') {
    hat = mesh(new THREE.SphereGeometry(0.42, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2), 0x4d826d, { y: 2.19 });
  } else if (cosmeticId === 'sun_hat') {
    hat = new THREE.Group();
    hat.add(mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.07, 14), 0xe3b952, { y: 2.16 }));
    hat.add(mesh(new THREE.CylinderGeometry(0.35, 0.43, 0.28, 12), 0xe3b952, { y: 2.31 }));
  } else if (cosmeticId === 'first_orbit_crown') {
    hat = mesh(new THREE.ConeGeometry(0.38, 0.42, 7), 0xf1c84c, { y: 2.36 });
  }
  if (hat) {
    hat.name = 'equipped-hat';
    player.add(hat);
  }
}

function makeWildlife(species) {
  const root = new THREE.Group();
  const animal = new THREE.Group();
  const [primary, secondary] = species.colors;
  let focusHeight = 0.8;
  const addLegs = (height = 0.5, spreadX = 0.35, spreadZ = 0.35, color = secondary) => {
    for (const x of [-spreadX, spreadX]) {
      for (const z of [-spreadZ, spreadZ]) {
        const leg = mesh(new THREE.CylinderGeometry(0.07, 0.09, height, 6), color, { y: height / 2 });
        leg.position.set(x, 0, z);
        animal.add(leg);
      }
    }
  };
  const addEyes = (parent, y, z, spread = 0.13) => {
    for (const x of [-spread, spread]) {
      const eye = mesh(new THREE.SphereGeometry(0.04, 6, 6), 0x17221e, { y });
      eye.position.x = x;
      eye.position.z = z;
      parent.add(eye);
    }
  };

  if (species.form === 'butterfly') {
    const body = mesh(new THREE.CapsuleGeometry(0.07, 0.32, 4, 6), secondary, { y: 1.05 });
    body.rotation.x = Math.PI / 2;
    const wingGeometry = new THREE.SphereGeometry(0.42, 8, 6);
    for (const side of [-1, 1]) {
      const wing = mesh(wingGeometry, primary, { y: 1.08 });
      wing.scale.set(0.72, 0.12, 1);
      wing.position.x = side * 0.35;
      wing.name = side < 0 ? 'wing-left' : 'wing-right';
      animal.add(wing);
    }
    animal.add(body);
    focusHeight = 1.05;
  } else if (species.form === 'bug') {
    const shell = mesh(new THREE.SphereGeometry(0.34, 9, 7), primary, { y: 0.36 });
    shell.scale.z = 1.25;
    const stripe = mesh(new THREE.BoxGeometry(0.035, 0.36, 0.62), secondary, { y: 0.44 });
    animal.add(shell, stripe);
    focusHeight = 0.4;
  } else if (species.form === 'fish') {
    const body = mesh(new THREE.SphereGeometry(0.42, 10, 7), primary, { y: 0.55 });
    body.scale.set(1.35, 0.7, 0.55);
    const tail = mesh(new THREE.ConeGeometry(0.35, 0.5, 3), secondary, { y: 0.55 });
    tail.rotation.z = Math.PI / 2;
    tail.position.x = -0.58;
    animal.add(body, tail);
    focusHeight = 0.6;
  } else if (species.form === 'penguin') {
    const body = mesh(new THREE.SphereGeometry(0.5, 10, 8), primary, { y: 0.7 });
    body.scale.y = 1.4;
    const belly = mesh(new THREE.SphereGeometry(0.35, 9, 7), secondary, { y: 0.68 });
    belly.scale.set(0.9, 1.2, 0.35); belly.position.z = 0.37;
    const beak = mesh(new THREE.ConeGeometry(0.11, 0.3, 5), 0xe5a443, { y: 1.16 });
    beak.rotation.x = Math.PI / 2; beak.position.z = 0.5;
    animal.add(body, belly, beak);
    focusHeight = 0.85;
  } else if (species.form === 'giraffe') {
    addLegs(0.78, 0.25, 0.32, secondary);
    const body = mesh(new THREE.SphereGeometry(0.55, 9, 7), primary, { y: 1.0 });
    body.scale.set(0.8, 0.65, 1.2);
    const neck = mesh(new THREE.CylinderGeometry(0.17, 0.24, 1.7, 7), primary, { y: 1.95 });
    neck.position.z = 0.35;
    const head = mesh(new THREE.SphereGeometry(0.3, 8, 7), primary, { y: 2.8 });
    head.position.z = 0.45; head.scale.z = 1.3;
    addEyes(head, 0.06, 0.26, 0.11);
    animal.add(body, neck, head);
    focusHeight = 1.8;
  } else if (species.form === 'elephant') {
    addLegs(0.58, 0.38, 0.4, primary);
    const body = mesh(new THREE.SphereGeometry(0.68, 10, 8), primary, { y: 0.85 });
    body.scale.z = 1.15;
    const head = mesh(new THREE.SphereGeometry(0.48, 9, 7), primary, { y: 1.02 });
    head.position.z = 0.68;
    const trunk = mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.72, 7), primary, { y: 0.62 });
    trunk.position.z = 1.03;
    const ears = new THREE.SphereGeometry(0.38, 8, 6);
    for (const x of [-0.42, 0.42]) {
      const ear = mesh(ears, secondary, { y: 1.12 });
      ear.position.set(x, 0, 0.62); ear.scale.z = 0.28;
      animal.add(ear);
    }
    animal.add(body, head, trunk);
    focusHeight = 1;
  } else if (species.form === 'flamingo') {
    const leg = mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0, 5), secondary, { y: 0.5 });
    const body = mesh(new THREE.SphereGeometry(0.38, 9, 7), primary, { y: 1.24 });
    body.scale.z = 1.3;
    const neck = mesh(new THREE.TorusGeometry(0.38, 0.07, 6, 14, Math.PI), primary, { y: 1.5 });
    neck.rotation.y = Math.PI / 2; neck.position.z = 0.25;
    animal.add(leg, body, neck);
    focusHeight = 1.3;
  } else if (species.form === 'crab') {
    const body = mesh(new THREE.SphereGeometry(0.35, 8, 6), primary, { y: 0.3 });
    body.scale.set(1.2, 0.55, 0.85);
    for (const x of [-0.48, 0.48]) {
      const claw = mesh(new THREE.SphereGeometry(0.18, 7, 6), primary, { y: 0.48 });
      claw.position.x = x;
      animal.add(claw);
    }
    animal.add(body);
    focusHeight = 0.35;
  } else if (species.form === 'bird') {
    const body = mesh(new THREE.SphereGeometry(0.3, 8, 7), primary, { y: 0.85 });
    body.scale.set(0.9, 1.12, 1.2);
    const head = mesh(new THREE.SphereGeometry(0.2, 8, 7), primary, { y: 1.16 });
    head.position.z = 0.24;
    const beak = mesh(new THREE.ConeGeometry(0.09, 0.28, 5), secondary, { y: 1.16 });
    beak.rotation.x = Math.PI / 2; beak.position.z = 0.49;
    for (const side of [-1, 1]) {
      const wing = mesh(new THREE.SphereGeometry(0.24, 7, 6), secondary, { y: 0.88 });
      wing.scale.set(0.28, 0.7, 1); wing.position.x = side * 0.25;
      wing.name = side < 0 ? 'wing-left' : 'wing-right'; animal.add(wing);
    }
    animal.add(body, head, beak); focusHeight = 0.95;
  } else if (species.form === 'frog') {
    const body = mesh(new THREE.SphereGeometry(0.38, 8, 7), primary, { y: 0.32 });
    body.scale.set(1.1, 0.62, 1.2);
    for (const x of [-0.15, 0.15]) {
      const eye = mesh(new THREE.SphereGeometry(0.1, 7, 6), secondary, { y: 0.58 });
      eye.position.set(x, 0, 0.18); animal.add(eye);
    }
    animal.add(body); focusHeight = 0.42;
  } else if (species.form === 'tortoise') {
    const shell = mesh(new THREE.SphereGeometry(0.5, 9, 7), primary, { y: 0.4 });
    shell.scale.set(1.15, 0.6, 1.25);
    const head = mesh(new THREE.SphereGeometry(0.16, 7, 6), secondary, { y: 0.32 }); head.position.z = 0.58;
    addLegs(0.22, 0.28, 0.3, secondary); animal.add(shell, head); focusHeight = 0.45;
  } else if (species.form === 'seal') {
    const body = mesh(new THREE.SphereGeometry(0.55, 9, 7), primary, { y: 0.38 });
    body.scale.set(0.88, 0.62, 1.5);
    const head = mesh(new THREE.SphereGeometry(0.28, 8, 7), primary, { y: 0.46 }); head.position.z = 0.58;
    const tail = mesh(new THREE.ConeGeometry(0.22, 0.46, 3), secondary, { y: 0.28 }); tail.rotation.x = Math.PI / 2; tail.position.z = -0.78;
    animal.add(body, head, tail); focusHeight = 0.48;
  } else if (species.form === 'hare' || species.form === 'squirrel') {
    const body = mesh(new THREE.SphereGeometry(0.38, 8, 7), primary, { y: 0.48 }); body.scale.z = 1.25;
    const head = mesh(new THREE.SphereGeometry(0.25, 8, 7), primary, { y: 0.7 }); head.position.z = 0.34;
    for (const x of [-0.11, 0.11]) {
      const ear = mesh(new THREE.CapsuleGeometry(0.065, species.form === 'hare' ? 0.42 : 0.24, 4, 6), secondary, { y: species.form === 'hare' ? 1.08 : 0.95 });
      ear.position.x = x; ear.position.z = 0.31; animal.add(ear);
    }
    if (species.form === 'squirrel') {
      const tail = mesh(new THREE.SphereGeometry(0.26, 7, 6), secondary, { y: 0.78 }); tail.position.z = -0.46; tail.scale.set(0.8, 1.5, 0.75); animal.add(tail);
    }
    addLegs(0.28, 0.2, 0.25, secondary); animal.add(body, head); focusHeight = 0.7;
  } else if (species.form === 'hedgehog') {
    const body = mesh(new THREE.SphereGeometry(0.47, 9, 7), primary, { y: 0.38 }); body.scale.set(1.1, 0.7, 1.2);
    const face = mesh(new THREE.ConeGeometry(0.21, 0.46, 7), secondary, { y: 0.34 }); face.rotation.x = Math.PI / 2; face.position.z = 0.48;
    animal.add(body, face); focusHeight = 0.42;
  } else if (['meerkat', 'gecko', 'musk_ox', 'lion', 'hippo', 'warthog'].includes(species.form)) {
    const isLarge = ['musk_ox', 'lion', 'hippo'].includes(species.form);
    const isHippo = species.form === 'hippo';
    const legHeight = isHippo ? 0.34 : isLarge ? 0.52 : 0.27;
    addLegs(legHeight, isLarge ? 0.36 : 0.25, isLarge ? 0.38 : 0.28, secondary);
    const body = mesh(new THREE.SphereGeometry(isLarge ? 0.58 : 0.36, 9, 7), primary, { y: legHeight + (isLarge ? 0.3 : 0.2) });
    body.scale.set(isHippo ? 1.18 : 0.9, isHippo ? 0.72 : 0.78, 1.3);
    const head = mesh(new THREE.SphereGeometry(isLarge ? 0.32 : 0.2, 8, 7), primary, { y: legHeight + (isLarge ? 0.43 : 0.35) }); head.position.z = isLarge ? 0.55 : 0.4;
    animal.add(body, head);
    if (species.form === 'musk_ox') {
      for (const x of [-0.24, 0.24]) { const horn = mesh(new THREE.TorusGeometry(0.14, 0.035, 5, 9, Math.PI), secondary, { y: legHeight + 0.65 }); horn.position.x = x; horn.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2; animal.add(horn); }
    }
    if (species.form === 'lion') { const mane = mesh(new THREE.SphereGeometry(0.4, 8, 7), secondary, { y: legHeight + 0.44 }); mane.position.z = 0.5; mane.scale.z = 0.5; animal.add(mane); }
    if (species.form === 'warthog') { for (const x of [-0.12, 0.12]) { const tusk = mesh(new THREE.ConeGeometry(0.05, 0.22, 5), secondary, { y: 0.62 }); tusk.position.set(x, 0, 0.56); tusk.rotation.x = -0.65; animal.add(tusk); } }
    focusHeight = legHeight + (isLarge ? 0.55 : 0.42);
  } else {
    const isCamel = species.form === 'camel';
    const isBear = species.form === 'bear';
    const isZebra = species.form === 'zebra';
    const isFox = species.form === 'fox';
    addLegs(isBear ? 0.38 : 0.5, isBear ? 0.34 : 0.3, 0.34, secondary);
    const body = mesh(new THREE.SphereGeometry(isBear ? 0.62 : 0.52, 9, 7), primary, { y: isBear ? 0.62 : 0.72 });
    body.scale.z = isBear ? 1.1 : 1.25;
    const head = mesh(new THREE.SphereGeometry(isBear ? 0.38 : 0.33, 9, 7), primary, { y: isBear ? 0.88 : 1.02 });
    head.position.z = isBear ? 0.62 : 0.7;
    addEyes(head, 0.06, isBear ? 0.3 : 0.27, 0.11);
    animal.add(body, head);
    if (isCamel) {
      const hump = mesh(new THREE.SphereGeometry(0.28, 8, 6), primary, { y: 1.1 });
      hump.position.z = -0.05;
      animal.add(hump);
    }
    if (isFox) {
      for (const x of [-0.17, 0.17]) {
        const ear = mesh(new THREE.ConeGeometry(0.14, 0.35, 5), primary, { y: 1.4 });
        ear.position.set(x, 0, 0.64); animal.add(ear);
      }
      const tail = mesh(new THREE.ConeGeometry(0.23, 0.9, 7), primary, { y: 0.62 });
      tail.rotation.x = -0.8; tail.position.z = -0.65; animal.add(tail);
    }
    if (isZebra) {
      for (let i = 0; i < 3; i += 1) {
        const stripe = mesh(new THREE.TorusGeometry(0.46 - i * 0.035, 0.035, 5, 12), secondary, { y: 0.72 });
        stripe.rotation.x = Math.PI / 2;
        stripe.position.z = (i - 1) * 0.24;
        animal.add(stripe);
      }
    }
    focusHeight = isBear ? 0.75 : 0.85;
  }
  animal.rotation.y = Math.PI;
  const visual = new THREE.Group();
  visual.add(animal);
  root.add(visual);
  const focus = new THREE.Object3D();
  focus.position.y = focusHeight;
  root.add(focus);
  root.userData.kind = 'wildlife';
  root.userData.speciesId = species.id;
  return { root, animal, visual, focus, species, photoSubject: PHOTO_SUBJECTS[species.id], phase: Math.random() * Math.PI * 2 };
}

function makeCollectible(item) {
  const root = new THREE.Group();
  const visual = new THREE.Group();
  root.add(visual);
  if (item.form === 'flower' || item.id.includes('flower') || item.id === 'sunpetal' || item.id === 'snowdrop') {
    const stem = mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.42, 6), 0x4e913f, { y: 0.21 });
    visual.add(stem);
    const petals = item.id === 'sunpetal' ? 9 : 6;
    for (let i = 0; i < petals; i += 1) {
      const petal = mesh(new THREE.SphereGeometry(0.1, 6, 5), item.color, { y: 0.5 });
      const angle = (i / petals) * Math.PI * 2;
      petal.position.x = Math.cos(angle) * 0.14;
      petal.position.z = Math.sin(angle) * 0.14;
      petal.scale.set(1.3, 0.45, 0.7);
      visual.add(petal);
    }
  } else if (item.id === 'apple') {
    visual.add(mesh(new THREE.SphereGeometry(0.22, 8, 7), item.color, { y: 0.26 }));
  } else if (item.id.includes('glass')) {
    visual.add(mesh(new THREE.OctahedronGeometry(0.3, 0), item.color, { y: 0.3 }));
  } else if (item.id.includes('feather')) {
    const feather = mesh(new THREE.CapsuleGeometry(0.08, 0.38, 4, 7), item.color, { y: 0.28 });
    feather.rotation.z = -0.5;
    visual.add(feather);
  } else if (item.form === 'mushroom') {
    visual.add(mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.28, 7), 0xf1e7ce, { y: 0.14 }));
    visual.add(mesh(new THREE.SphereGeometry(0.22, 8, 6), item.color, { y: 0.31 }));
  } else if (item.form === 'acorn' || item.form === 'pod' || item.form === 'pinecone') {
    const shape = mesh(new THREE.SphereGeometry(0.22, 8, 7), item.color, { y: 0.23 });
    shape.scale.y = item.form === 'pinecone' ? 1.35 : 1.1; visual.add(shape);
    visual.add(mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.09, 7), 0x5d4a32, { y: 0.42 }));
  } else if (item.form === 'berry') {
    for (const [x, z] of [[0, 0], [-0.12, 0.06], [0.12, 0.06], [0, -0.11]]) visual.add(mesh(new THREE.SphereGeometry(0.11, 7, 6), item.color, { y: 0.24 }).translateX(x).translateZ(z));
  } else if (item.form === 'sprig' || item.form === 'reed') {
    for (const x of [-0.09, 0, 0.09]) { const blade = mesh(new THREE.CapsuleGeometry(0.025, item.form === 'reed' ? 0.54 : 0.38, 4, 5), item.color, { y: item.form === 'reed' ? 0.3 : 0.22 }); blade.position.x = x; blade.rotation.z = x * 2; visual.add(blade); }
  } else if (item.form === 'fruit' || item.form === 'pearl' || item.form === 'coin') {
    visual.add(mesh(new THREE.SphereGeometry(item.form === 'pearl' ? 0.2 : 0.24, 8, 7), item.color, { y: 0.24 }));
  } else if (item.form === 'crystal') {
    const crystal = mesh(new THREE.OctahedronGeometry(0.28, 0), item.color, { y: 0.28 }); crystal.scale.y = 1.5; visual.add(crystal);
  } else if (item.form === 'shell') {
    const shell = mesh(new THREE.SphereGeometry(0.26, 8, 6), item.color, { y: 0.2 }); shell.scale.set(1.25, 0.42, 1); visual.add(shell);
  } else if (item.form === 'stone') {
    visual.add(mesh(new THREE.DodecahedronGeometry(0.25, 0), item.color, { y: 0.22 }));
  } else {
    visual.add(mesh(new THREE.DodecahedronGeometry(0.24, 0), item.color, { y: 0.22 }));
  }
  root.userData.kind = 'collectible';
  root.userData.itemId = item.id;
  const focus = new THREE.Object3D();
  focus.userData.preserveModelAttach = true;
  focus.position.y = item.form === 'reed' || item.form === 'sprig' ? 0.58 : 0.34;
  root.add(focus);
  return { root, visual, focus, item, photoSubject: PHOTO_SUBJECTS[item.id], collected: false, phase: Math.random() * Math.PI * 2 };
}

function makeStructure(structure) {
  const root = new THREE.Group();
  const { color, accent, form } = structure;
  if (form === 'windmill') {
    root.add(mesh(new THREE.CylinderGeometry(0.38, 0.58, 1.65, 8), color, { y: 0.82 }));
    const hub = mesh(new THREE.SphereGeometry(0.17, 7, 6), accent, { y: 1.5 }); hub.position.z = 0.42; root.add(hub);
    for (let index = 0; index < 4; index += 1) { const blade = mesh(new THREE.BoxGeometry(0.12, 0.72, 0.06), accent, { y: 1.5 }); blade.position.z = 0.43; blade.rotation.z = index * Math.PI / 2; blade.position.y += Math.cos(index * Math.PI / 2) * 0.2; blade.position.x += Math.sin(index * Math.PI / 2) * 0.2; root.add(blade); }
  } else if (form === 'bridge') {
    const deck = mesh(new THREE.BoxGeometry(1.8, 0.16, 0.62), color, { y: 0.52 }); root.add(deck);
    for (const x of [-0.7, 0.7]) root.add(mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.55, 6), accent, { y: 0.27 }).translateX(x));
  } else if (form === 'birdhouse') {
    root.add(mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.25, 6), accent, { y: 0.62 }));
    root.add(mesh(new THREE.BoxGeometry(0.48, 0.42, 0.4), color, { y: 1.35 }));
    const roof = mesh(new THREE.ConeGeometry(0.38, 0.32, 4), accent, { y: 1.72 }); roof.rotation.y = Math.PI / 4; root.add(roof);
  } else if (form === 'well' || form === 'trough') {
    const base = mesh(form === 'well' ? new THREE.CylinderGeometry(0.52, 0.62, 0.55, 10) : new THREE.BoxGeometry(1.25, 0.42, 0.7), color, { y: 0.28 }); root.add(base);
    const water = mesh(form === 'well' ? new THREE.CylinderGeometry(0.36, 0.36, 0.03, 10) : new THREE.BoxGeometry(0.95, 0.03, 0.45), accent, { y: form === 'well' ? 0.57 : 0.5 }); root.add(water);
  } else if (form === 'ruins') {
    for (const x of [-0.38, 0.38]) root.add(mesh(new THREE.BoxGeometry(0.26, 1.25, 0.3), color, { y: 0.62 }).translateX(x));
    root.add(mesh(new THREE.BoxGeometry(1.05, 0.2, 0.35), accent, { y: 1.28 }));
  } else if (form === 'igloo') {
    const dome = mesh(new THREE.SphereGeometry(0.82, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), color, { y: 0.02 }); root.add(dome);
    root.add(mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.45, 7), accent, { y: 0.22 }).translateZ(0.67));
  } else if (form === 'tower') {
    for (const x of [-0.38, 0.38]) for (const z of [-0.28, 0.28]) root.add(mesh(new THREE.CylinderGeometry(0.07, 0.1, 1.8, 6), accent, { y: 0.9 }).translateX(x).translateZ(z));
    root.add(mesh(new THREE.BoxGeometry(1.05, 0.18, 0.85), color, { y: 1.78 }));
    root.add(mesh(new THREE.ConeGeometry(0.72, 0.52, 4), accent, { y: 2.12 }));
  } else if (form === 'tent' || form === 'shelter') {
    root.add(mesh(new THREE.BoxGeometry(1.15, 0.08, 0.82), accent, { y: 0.04 }));
    const canopy = mesh(new THREE.ConeGeometry(0.82, 0.85, form === 'tent' ? 4 : 3), color, { y: 0.48 }); canopy.rotation.y = Math.PI / 4; root.add(canopy);
  } else if (form === 'tree') {
    const tree = makeTree(color);
    tree.scale.setScalar(structure.id === 'baobab_tree' ? 1.55 : structure.id === 'palm_tree' ? 1.35 : 1.15);
    root.add(tree);
  } else if (form === 'bush') {
    const shrub = mesh(new THREE.IcosahedronGeometry(0.58, 1), color, { y: 0.48 });
    shrub.scale.set(1.35, 0.72, 1);
    root.add(shrub);
    for (const [x, z] of [[-0.28, 0.1], [0.05, 0.25], [0.32, -0.04]]) root.add(mesh(new THREE.SphereGeometry(0.08, 6, 5), accent, { y: 0.72 }).translateX(x).translateZ(z));
  } else if (form === 'statue') {
    root.add(mesh(new THREE.CapsuleGeometry(0.35, 0.9, 4, 8), color, { y: 0.85 }));
    root.add(mesh(new THREE.SphereGeometry(0.3, 10, 8), accent, { y: 1.55 }));
  }
  root.userData.kind = 'structure'; root.userData.structureId = structure.id;
  const focus = new THREE.Object3D();
  focus.userData.preserveModelAttach = true;
  focus.position.y = form === 'tree' ? 1.55 : form === 'tower' ? 1.8 : form === 'statue' ? 1.25 : 0.75;
  root.add(focus);
  return { root, focus, structure, photoSubject: PHOTO_SUBJECTS[structure.id] };
}

function makeTree(color = 0x4d8c56) {
  const root = new THREE.Group();
  root.add(mesh(new THREE.CylinderGeometry(0.18, 0.3, 1.5, 7), 0x755036, { y: 0.75 }));
  const crown = mesh(new THREE.IcosahedronGeometry(0.9, 1), color, { y: 1.8 });
  crown.scale.set(1, 1.15, 1);
  root.add(crown);
  return root;
}

function makeCactus() {
  const root = new THREE.Group();
  root.add(mesh(new THREE.CapsuleGeometry(0.16, 1.2, 4, 7), 0x4e9b66, { y: 0.82 }));
  for (const side of [-1, 1]) {
    const arm = mesh(new THREE.CapsuleGeometry(0.09, 0.45, 4, 6), 0x4e9b66, { y: 0.85 });
    arm.position.x = side * 0.28; arm.rotation.z = side * -0.65; root.add(arm);
  }
  return root;
}

function makeCrystal() {
  const root = new THREE.Group();
  for (const [x, scale] of [[0, 1], [-0.28, 0.65], [0.3, 0.75]]) {
    const crystal = mesh(new THREE.OctahedronGeometry(0.32, 0), 0x8bd3e6, { y: 0.42 * scale });
    crystal.position.x = x; crystal.scale.y = 1.8 * scale; root.add(crystal);
  }
  return root;
}

function makeLandmark(biomeId) {
  const root = new THREE.Group();
  if (biomeId === 'grassland') {
    const cabin = mesh(new THREE.BoxGeometry(2.2, 1.6, 1.7), 0xe9c68b, { y: 0.8 });
    const roof = mesh(new THREE.ConeGeometry(1.75, 1.05, 4), 0x4f8065, { y: 2.05 });
    roof.rotation.y = Math.PI / 4;
    const lens = mesh(new THREE.CylinderGeometry(0.38, 0.5, 0.8, 10), 0x384b48, { y: 1.25 });
    lens.rotation.x = Math.PI / 2; lens.position.z = 1.1;
    root.add(cabin, roof, lens);
  } else if (biomeId === 'desert') {
    for (const x of [-0.65, 0.65]) root.add(mesh(new THREE.BoxGeometry(0.45, 2.3, 0.55), 0xb97842, { y: 1.15 }));
    const arch = mesh(new THREE.TorusGeometry(0.72, 0.25, 7, 14, Math.PI), 0xb97842, { y: 2.15 });
    root.add(arch);
  } else if (biomeId === 'snow') {
    const crystal = makeCrystal(); crystal.scale.setScalar(2.1); root.add(crystal);
  } else {
    const tree = makeTree(0x7c8f3f); tree.scale.set(1.7, 1.5, 1.7); root.add(tree);
  }
  return root;
}

export class GlobularRoamGame {
  constructor(ui, save) {
    this.ui = ui;
    this.save = save;
    this.mode = 'onboarding';
    this.elapsed = 0;
    this.keys = new Set();
    this.context = null;
    this.currentBiome = biomeForLongitude(save.longitude);
    this.previousBiome = this.currentBiome;
    this.wildlife = [];
    this.collectibles = [];
    this.structures = [];
    this.photoSubjects = [];
    this.rangers = [];
    this.lastFrame = performance.now();
    this.manualStepping = false;
    this.audioContext = null;
    this.cameraAudio = new Audio(cameraSoundUrl);
    this.cameraAudio.preload = 'auto';
    this.models = new ModelLibrary();
    this.createScene();
    this.bindUI();
    this.bindKeyboard();
    this.installTestHooks();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(BIOMES[this.currentBiome].sky);
    this.scene.fog = new THREE.Fog(BIOMES[this.currentBiome].sky, 22, 72);
    this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 220);
    this.camera.position.copy(FIRST_PERSON_EYE);
    this.camera.lookAt(FIRST_PERSON_LOOK);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.32;
    this.ui['canvas-mount'].appendChild(this.renderer.domElement);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x6d8c80, 3.4);
    this.scene.add(this.hemiLight);
    this.sunLight = new THREE.DirectionalLight(0xfff1c3, 3.2);
    this.sunLight.position.set(-9, 18, 12);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.left = -20; this.sunLight.shadow.camera.right = 20;
    this.sunLight.shadow.camera.top = 20; this.sunLight.shadow.camera.bottom = -20;
    this.scene.add(this.sunLight);
    this.fillLight = new THREE.DirectionalLight(0xd8ebff, 1.85);
    this.fillLight.position.set(10, 9, 8);
    this.scene.add(this.fillLight);

    this.createSkyDetails();
    this.createWeatherSystem();
    this.createGlobe();
    this.player = makePlayer(this.save);
    this.scene.add(this.player);
    this.syncPlayerViewVisibility();
    this.models.attach('camera', this.player.getObjectByName('held-camera-slot'), this.modelSpan({ id: 'camera' }, 0.46));
    this.photography = new PhotographySystem({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      subjects: this.photoSubjects,
      onFocusChanged: (focus) => this.ui.setCameraFocus(focus),
    });
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
  }

  createSkyDetails() {
    const starGeometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 320; i += 1) {
      const radius = 65 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const y = 12 + Math.random() * 65;
      positions.push(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xfff6d4, size: 0.45, transparent: true, opacity: 0.45 }));
    this.scene.add(this.stars);
    this.clouds = new THREE.Group();
    for (let i = 0; i < 9; i += 1) {
      const cloud = new THREE.Group();
      for (let p = 0; p < 4; p += 1) {
        const puff = mesh(new THREE.IcosahedronGeometry(1.2 + Math.random() * 0.65, 1), 0xfffbef, { castShadow: false });
        puff.position.set((p - 1.5) * 1.15, Math.random() * 0.45, Math.random() * 0.4);
        cloud.add(puff);
      }
      const angle = (i / 9) * Math.PI * 2;
      cloud.position.set(Math.cos(angle) * 32, 12 + (i % 3) * 5, Math.sin(angle) * 32);
      cloud.scale.setScalar(0.7 + (i % 2) * 0.25);
      this.clouds.add(cloud);
    }
    this.scene.add(this.clouds);
  }

  createWeatherSystem() {
    this.weatherGroup = new THREE.Group();
    this.weatherParticles = {};
    const variants = {
      pollen: { color: 0xffe7a7, size: 0.12, count: 96 },
      rain: { color: 0xa8d9ff, size: 0.09, count: 160 },
      snow: { color: 0xffffff, size: 0.16, count: 130 },
      dust: { color: 0xe7bb77, size: 0.18, count: 120 },
      haze: { color: 0xffe6b4, size: 0.34, count: 80 },
    };
    for (const [kind, config] of Object.entries(variants)) {
      const positions = new Float32Array(config.count * 3);
      for (let i = 0; i < config.count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 19;
        positions[i * 3 + 1] = Math.random() * 11 - 1;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: config.color, size: config.size, transparent: true, opacity: 0.65, depthWrite: false }));
      points.visible = false;
      this.weatherParticles[kind] = points;
      this.weatherGroup.add(points);
    }
    this.scene.add(this.weatherGroup);
  }

  createGlobe() {
    this.globe = new THREE.Group();
    this.globe.position.y = -GLOBE_RADIUS;
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 48);
    const position = geometry.getAttribute('position');
    const colors = [];
    const color = new THREE.Color();
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const y = position.getY(i);
      const longitude = Math.atan2(x, y);
      color.setHex(BIOMES[biomeForLongitude(longitude)].color);
      const noise = 0.92 + ((Math.sin(x * 1.31) + Math.cos(y * 1.73)) * 0.025);
      color.multiplyScalar(noise);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const globeMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: false }));
    globeMesh.receiveShadow = true;
    this.globe.add(globeMesh);
    this.scene.add(this.globe);

    for (const biomeId of BIOME_ORDER) {
      const biome = BIOMES[biomeId];
      const landmark = makeLandmark(biomeId);
      positionOnGlobe(landmark, biome.center - 0.2, 0.11);
      this.globe.add(landmark);
      const landmarkModelId = {
        grassland: 'picnic_shelter',
        desert: 'sandstone_ruins',
        snow: 'ice_patch',
        safari: 'tree',
      }[biomeId];
      this.models.attach(landmarkModelId, landmark, biomeId === 'safari' ? 3.4 : 2.8);
      const ranger = makeRanger(biome);
      positionOnGlobe(ranger, biome.center + 0.025, 0.045);
      this.globe.add(ranger);
      this.rangers.push({ root: ranger, biomeId });
      this.models.attach(`ranger_${biomeId}`, ranger, this.modelSpan({ id: `ranger_${biomeId}` }, 1.8));

      for (let index = 0; index < 14; index += 1) {
        const longitude = biome.center - 0.3 + (index / 13) * 0.6;
        const latitude = -0.15 + ((index * 37) % 11) / 11 * 0.3;
        let decoration;
        if (biomeId === 'grassland') decoration = makeTree(index % 2 ? 0x4d8c56 : 0x669f58);
        else if (biomeId === 'desert') decoration = index % 3 ? makeCactus() : makeTree(0x7c9050);
        else if (biomeId === 'snow') decoration = index % 2 ? makeCrystal() : makeTree(0xb8d7d2);
        else decoration = makeTree(index % 2 ? 0x738443 : 0x8e9040);
        const scale = 0.65 + (index % 4) * 0.12;
        decoration.scale.setScalar(scale);
        positionOnGlobe(decoration, longitude, latitude);
        this.globe.add(decoration);
        const decorationModelId = biomeId === 'desert'
          ? (index % 3 ? 'cactus' : 'tree')
          : biomeId === 'snow'
            ? (index % 2 ? 'ice_patch' : 'tree')
            : 'tree';
        this.models.attach(decorationModelId, decoration, biomeId === 'snow' && index % 2 ? 0.95 : 1.25);
      }

      for (const [structureId, lonOffset, latitude] of WORLD_LAYOUT[biomeId].structures) {
        const structure = makeStructure(STRUCTURES[structureId]);
        structure.longitude = biome.center + lonOffset;
        structure.latitude = latitude;
        positionOnGlobe(structure.root, structure.longitude, structure.latitude);
        this.globe.add(structure.root);
        this.structures.push(structure);
        this.photoSubjects.push(structure);
        this.models.attach(modelIdForStructure(STRUCTURES[structureId]), structure.root, this.modelSpan(STRUCTURES[structureId], 2.1));
      }

      for (const [speciesId, lonOffset, latitude] of WORLD_LAYOUT[biomeId].wildlife) {
        const subject = makeWildlife(SPECIES[speciesId]);
        subject.longitude = biome.center + lonOffset;
        subject.latitude = latitude;
        positionOnGlobe(subject.root, subject.longitude, subject.latitude, speciesId === 'fish' ? 0.14 : 0.05);
        this.globe.add(subject.root);
        this.wildlife.push(subject);
        this.photoSubjects.push(subject);
        this.models.attach(modelIdForSpecies(subject.species), subject.visual, this.modelSpan(subject.species, 1.05));
      }
      WORLD_LAYOUT[biomeId].collectibles.forEach(([itemId, lonOffset, latitude], index) => {
        const collectible = makeCollectible(COLLECTIBLES[itemId]);
        collectible.id = `${biomeId}-${itemId}-${index}`;
        collectible.longitude = biome.center + lonOffset;
        collectible.latitude = latitude;
        positionOnGlobe(collectible.root, collectible.longitude, collectible.latitude, 0.05);
        this.globe.add(collectible.root);
        this.collectibles.push(collectible);
        this.photoSubjects.push(collectible);
        this.models.attach(modelIdForCollectible(collectible.item), collectible.visual, this.modelSpan(collectible.item, 0.56));
      });
    }
    this.updateGlobeOrientation();
  }

  modelSpan(entity, fallback) {
    if (MODEL_SPANS[entity.id]) return MODEL_SPANS[entity.id];
    if (entity.form === 'berry' || entity.form === 'pearl' || entity.form === 'stone') return 0.38;
    if (entity.form === 'reed' || entity.form === 'sprig') return 0.75;
    if (entity.form === 'crystal' || entity.form === 'shell') return 0.52;
    if (entity.form === 'fruit' || entity.form === 'mushroom' || entity.form === 'pod' || entity.form === 'pinecone') return 0.5;
    return fallback;
  }

  bindUI() {
    this.ui.bind({
      start: (options) => this.start(options),
      camera: () => this.openCamera(),
      closeCamera: () => this.closeCamera(),
      shutter: () => this.takePhoto(),
      aim: (dx, dy) => this.photography.adjustAim(dx, dy),
      context: () => this.performContextAction(),
      fieldGuide: () => this.openFieldGuide(),
      outfitter: () => this.openOutfitter(),
      settings: () => this.openSettings(),
      settingChange: (key, enabled) => this.updateSetting(key, enabled),
      sell: () => this.sellInventory(),
      cosmetic: (id) => this.buyOrEquipCosmetic(id),
      fullscreen: () => this.toggleFullscreen(),
      modalClosed: () => this.resumeAfterModal(),
      keepRoaming: () => { this.mode = 'roaming'; },
    });
  }

  bindKeyboard() {
    window.addEventListener('keydown', (event) => {
      if (event.target instanceof HTMLInputElement) return;
      const key = event.key.toLowerCase();
      this.keys.add(key);
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
      if (event.repeat) return;
      if (key === 'c') this.mode === 'camera' ? this.closeCamera() : this.openCamera();
      if (key === 'e' || (key === ' ' && this.mode !== 'camera')) this.performContextAction();
      if (key === ' ' && this.mode === 'camera') this.takePhoto();
      if (key === 'g') this.openFieldGuide();
      if (key === 'f') this.toggleFullscreen();
      if (key === 'escape' && this.mode === 'camera') this.closeCamera();
    });
    window.addEventListener('keyup', (event) => this.keys.delete(event.key.toLowerCase()));
  }

  async start({ playerName, shirt, fresh }) {
    if (fresh) {
      clearProgress();
      await clearPhotos();
      this.save = createDefaultSave();
      this.save.playerName = playerName;
      this.save.appearance.shirt = shirt;
      this.player.removeFromParent();
      this.player = makePlayer(this.save);
      this.scene.add(this.player);
      this.syncPlayerViewVisibility();
      this.models.attach('camera', this.player.getObjectByName('held-camera-slot'), this.modelSpan({ id: 'camera' }, 0.46));
      this.ui.applySettings(this.save.settings);
    }
    this.save.started = true;
    this.save = saveProgress(this.save);
    this.mode = 'modal';
    this.ui.enterGame();
    this.ui.updateHUD({ save: this.save, biomeId: this.currentBiome, context: null });
    if (!this.save.introducedBiomes.includes('grassland')) {
      this.introduceBiome('grassland', true);
    } else {
      this.mode = 'roaming';
    }
  }

  introduceBiome(biomeId, first = false) {
    const biome = BIOMES[biomeId];
    if (!this.save.introducedBiomes.includes(biomeId)) {
      this.save.introducedBiomes.push(biomeId);
      this.persist();
    }
    this.mode = 'modal';
    this.ui.showDialog({
      eyebrow: first ? 'Your first assignment' : `${biome.emoji} ${biome.name}`,
      speaker: biome.ranger.name,
      emoji: biome.ranger.emoji,
      title: first ? 'The guide needs you' : `A request from ${biome.ranger.name}`,
      body: biome.intro,
      actionLabel: first ? 'Take the camera' : 'Accept request',
      dismissible: false,
      onAction: () => {
        this.mode = 'roaming';
        if (first) this.ui.toastMessage('Camera added — tap 📷 whenever wildlife is nearby.', 'gold');
      },
    });
  }

  resumeAfterModal() {
    if (this.mode === 'modal') this.mode = 'roaming';
  }

  openCamera() {
    if (this.mode !== 'roaming') return;
    this.mode = 'camera';
    this.photography.resetAim();
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();
    this.syncPlayerViewVisibility();
    this.alignForcedCameraAim();
    this.ui.setCameraMode(true);
    this.playSound('cameraOpen');
  }

  closeCamera() {
    if (this.mode !== 'camera') return;
    this.mode = 'roaming';
    this.camera.fov = 62;
    this.camera.updateProjectionMatrix();
    this.syncPlayerViewVisibility();
    this.photography.forceSubject(null);
    this.ui.setCameraMode(false);
  }

  syncPlayerViewVisibility() {
    if (!this.player) return;
    this.player.visible = this.mode !== 'roaming' && this.mode !== 'camera';
  }

  alignForcedCameraAim() {
    if (!this.photography.forcedSubjectId) return;
    for (let step = 0; step < 8; step += 1) {
      this.updateCamera();
      const focus = this.photography.update(PLAYER_POSITION);
      const focusId = focus?.subject.photoSubject?.id || focus?.subject.species?.id;
      if (focusId !== this.photography.forcedSubjectId) return;
      if (focus.valid) return;
      this.photography.adjustAim(-focus.screen.x * 0.55, focus.screen.y * 0.42);
    }
  }

  framePhotoSubjectForTest(subject, subjectId) {
    if (!Number.isFinite(subject.longitude) || !Number.isFinite(subject.latitude)) return false;
    const shifts = [-0.24, -0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18, 0.24, 0.3];
    let best = null;
    for (const longitudeShift of shifts) {
      for (const latitudeShift of shifts) {
        this.save.longitude = normalizeLongitude(subject.longitude + longitudeShift);
        this.save.latitude = THREE.MathUtils.clamp(subject.latitude + latitudeShift, -LATITUDE_LIMIT, LATITUDE_LIMIT);
        this.updateGlobeOrientation();
        this.scene.updateMatrixWorld(true);
        this.camera.position.copy(FIRST_PERSON_CAMERA_EYE);
        this.camera.lookAt(FIRST_PERSON_CAMERA_LOOK);
        this.camera.updateMatrixWorld();
        this.photography.resetAim();
        this.photography.forceSubject(subjectId);
        const focus = this.photography.update(PLAYER_POSITION);
        const focusId = focus?.subject.photoSubject?.id || focus?.subject.species?.id;
        if (focusId !== subjectId) continue;
        const score = focus.centerDistance + (focus.valid ? -1 : 1) + Math.max(0, focus.distance - 9.5);
        if (!best || score < best.score) {
          best = {
            longitude: this.save.longitude,
            latitude: this.save.latitude,
            score,
          };
        }
      }
    }
    if (!best) return false;
    this.save.longitude = best.longitude;
    this.save.latitude = best.latitude;
    this.updateGlobeOrientation();
    this.scene.updateMatrixWorld(true);
    this.updateBiome();
    this.photography.resetAim();
    this.photography.forceSubject(subjectId);
    this.updateCamera();
    this.photography.update(PLAYER_POSITION);
    this.render();
    return true;
  }

  async takePhoto() {
    if (this.mode !== 'camera' || this.capturing) return;
    this.capturing = true;
    this.ui.flash();
    this.playSound('shutter');
    const focus = this.photography.update(PLAYER_POSITION);
    if (!focus?.valid) {
      this.ui.toastMessage(focus ? 'Almost — place the subject inside the circle.' : 'No subject in frame. Try moving closer.');
      setTimeout(() => { this.capturing = false; }, 320);
      return;
    }
    const capture = await this.photography.capture();
    const subject = focus.subject.photoSubject || focus.subject.species;
    const isNew = !this.save.discoveries[subject.id];
    if (isNew) {
      this.save.discoveries[subject.id] = {
        subjectId: subject.id,
        speciesId: focus.subject.species?.id,
        biomeId: subject.biome,
        category: subject.category,
        discoveredAt: new Date().toISOString(),
      };
      this.save.bells += 25;
      if (capture.blob) await storePhoto(subject.id, capture.blob);
      this.persist();
      this.checkChapterCompletion();
    }
    this.ui.showPhotoResult({ previewUrl: capture.previewUrl, subject, isNew });
    this.capturing = false;
  }

  openFieldGuide() {
    if (!['roaming', 'camera'].includes(this.mode)) return;
    if (this.mode === 'camera') this.closeCamera();
    this.mode = 'modal';
    this.ui.showFieldGuide(this.save, loadPhoto);
  }

  openOutfitter() {
    if (this.mode !== 'roaming') return;
    this.mode = 'modal';
    this.ui.showOutfitter(this.save);
  }

  openSettings() {
    if (this.mode !== 'roaming') return;
    this.mode = 'modal';
    this.ui.showSettings(this.save);
  }

  updateSetting(key, enabled) {
    if (!['sound', 'reducedMotion'].includes(key)) return;
    this.save.settings[key] = Boolean(enabled);
    this.ui.applySettings(this.save.settings);
    this.persist();
    this.ui.updateSettingsPanel(this.save.settings);
  }

  sellInventory() {
    const total = calculateInventoryValue(this.save.inventory, COLLECTIBLES);
    if (!total) return;
    this.save.inventory = {};
    this.save.bells += total;
    this.persist();
    this.playSound('reward');
    this.ui.toastMessage(`Sold your gathered treasures for ${total} bells.`, 'gold');
    this.ui.showOutfitter(this.save);
  }

  buyOrEquipCosmetic(id) {
    const cosmetic = COSMETICS[id];
    if (!cosmetic) return;
    if (!this.save.unlockedCosmetics.includes(id)) {
      if (cosmetic.price === null || this.save.bells < cosmetic.price) return;
      this.save.bells -= cosmetic.price;
      this.save.unlockedCosmetics.push(id);
      this.playSound('reward');
    }
    this.save.equippedCosmetic = id;
    updatePlayerCosmetic(this.player, id);
    this.persist();
    this.ui.showOutfitter(this.save);
  }

  performContextAction() {
    if (this.mode !== 'roaming' || !this.context) return;
    if (this.context.kind === 'collectible') {
      const collectible = this.context.target;
      collectible.collected = true;
      collectible.root.visible = false;
      const id = collectible.item.id;
      this.save.inventory[id] = (this.save.inventory[id] || 0) + 1;
      this.save.lifetimeCollected[id] = (this.save.lifetimeCollected[id] || 0) + 1;
      this.save.bells += 5;
      this.playSound('gather');
      this.persist();
      this.ui.toastMessage(`${collectible.item.emoji} ${collectible.item.name} added to your pouch.`);
      this.checkChapterCompletion();
    } else if (this.context.kind === 'finale') {
      this.completeFinale();
    } else if (this.context.kind === 'ranger') {
      const biome = BIOMES[this.context.target.biomeId];
      this.mode = 'modal';
      this.ui.showDialog({
        eyebrow: `${biome.emoji} Local ranger`,
        speaker: biome.ranger.name,
        emoji: biome.ranger.emoji,
        title: this.save.stamps.includes(biome.id) ? `${biome.stamp} earned` : 'Expedition reminder',
        body: this.save.stamps.includes(biome.id)
          ? 'You captured what makes this region special. Keep following the orbit!'
          : biome.intro,
        actionLabel: 'Back to roaming',
        onAction: () => { this.mode = 'roaming'; },
      });
    }
  }

  checkChapterCompletion() {
    const chapter = currentChapter(this.save.stamps);
    if (chapter === 'return_home') return;
    const biome = BIOMES[chapter];
    const complete = isBiomeRequestComplete(this.save, biome);
    if (!complete) return;
    this.save.stamps.push(chapter);
    this.save.bells += 100;
    this.persist();
    this.playSound('stamp');
    const next = currentChapter(this.save.stamps);
    if (this.mode === 'camera') this.closeCamera();
    this.mode = 'modal';
    this.ui.showDialog({
      eyebrow: 'Biome complete',
      speaker: biome.ranger.name,
      emoji: biome.emoji,
      title: biome.stamp,
      body: next === 'return_home'
        ? 'That is the fourth stamp. Circle back to Mira in Clover Commons and present your completed first-orbit guide.'
        : `Beautiful work. Your next request is waiting in ${BIOMES[next].name}. Follow the orbit eastward.`,
      actionLabel: next === 'return_home' ? 'Return to Mira' : `Travel to ${BIOMES[next].shortName}`,
      dismissible: false,
      onAction: () => { this.mode = 'roaming'; },
    });
  }

  completeFinale() {
    if (!this.save.completed) {
      this.save.completed = true;
      if (!this.save.unlockedCosmetics.includes('first_orbit_crown')) this.save.unlockedCosmetics.push('first_orbit_crown');
      this.save.equippedCosmetic = 'first_orbit_crown';
      updatePlayerCosmetic(this.player, 'first_orbit_crown');
      this.persist();
    }
    this.mode = 'finale';
    this.playSound('finale');
    this.ui.showFinale(this.save);
  }

  updateGlobeOrientation() {
    const normal = surfaceVector(this.save.longitude, this.save.latitude, 1).normalize();
    this.globe.quaternion.setFromUnitVectors(normal, new THREE.Vector3(0, 1, 0));
  }

  updateMovement(delta) {
    let x = this.ui.joystick.x;
    let y = this.ui.joystick.y;
    if (this.keys.has('a') || this.keys.has('arrowleft')) x -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) x += 1;
    if (this.keys.has('w') || this.keys.has('arrowup')) y += 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) y -= 1;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    if (Math.abs(x) + Math.abs(y) < 0.02) {
      this.player.position.y = THREE.MathUtils.lerp(this.player.position.y, 0, 0.15);
      return;
    }
    this.save.longitude = normalizeLongitude(this.save.longitude + x * MOVE_SPEED * delta);
    this.save.latitude = THREE.MathUtils.clamp(this.save.latitude + y * MOVE_SPEED * delta, -LATITUDE_LIMIT, LATITUDE_LIMIT);
    this.updateGlobeOrientation();
    this.player.rotation.y = THREE.MathUtils.lerp(this.player.rotation.y, Math.atan2(x, y), 0.14);
    this.player.position.y = this.save.settings.reducedMotion
      ? 0
      : Math.abs(Math.sin(this.elapsed * 8)) * 0.1;
    this.saveDirty = true;
  }

  updateContext() {
    let nearest = null;
    const world = new THREE.Vector3();
    for (const collectible of this.collectibles) {
      if (collectible.collected || !collectible.root.visible) continue;
      collectible.root.getWorldPosition(world);
      const distance = world.distanceTo(PLAYER_POSITION);
      if (distance <= INTERACTION_DISTANCE && (!nearest || distance < nearest.distance)) {
        nearest = { kind: 'collectible', target: collectible, distance, icon: '🤲', label: 'Gather' };
      }
    }
    for (const ranger of this.rangers) {
      ranger.root.getWorldPosition(world);
      const distance = world.distanceTo(PLAYER_POSITION);
      if (distance <= 3.1 && (!nearest || distance < nearest.distance)) {
        const finale = currentChapter(this.save.stamps) === 'return_home' && ranger.biomeId === 'grassland';
        nearest = {
          kind: finale ? 'finale' : 'ranger',
          target: ranger,
          distance,
          icon: finale ? '🌍' : '💬',
          label: finale ? 'Finish orbit' : 'Talk',
        };
      }
    }
    this.context = nearest;
  }

  updateBiome() {
    this.currentBiome = biomeForLongitude(this.save.longitude);
    if (this.currentBiome === this.previousBiome) return;
    this.previousBiome = this.currentBiome;
    const biome = BIOMES[this.currentBiome];
    this.scene.background = new THREE.Color(biome.sky);
    this.scene.fog.color.set(biome.sky);
    const chapter = currentChapter(this.save.stamps);
    if (chapter === this.currentBiome && !this.save.introducedBiomes.includes(this.currentBiome)) {
      this.introduceBiome(this.currentBiome);
    } else {
      this.ui.toastMessage(`${biome.emoji} Entering ${biome.name}`);
    }
  }

  updateCamera() {
    this.syncPlayerViewVisibility();
    if (this.mode === 'camera') {
      const target = FIRST_PERSON_CAMERA_LOOK.clone();
      target.x += this.photography.aim.x * 4.8;
      target.y += this.photography.aim.y * 3.2;
      this.camera.position.lerp(FIRST_PERSON_CAMERA_EYE, 0.32);
      this.camera.lookAt(target);
      this.photography.update(PLAYER_POSITION);
    } else {
      this.camera.position.lerp(FIRST_PERSON_EYE, 0.22);
      this.camera.lookAt(FIRST_PERSON_LOOK);
    }
  }

  updateWildlife(delta) {
    const reducedMotion = this.save.settings.reducedMotion;
    for (const subject of this.wildlife) {
      subject.phase += delta;
      const bob = reducedMotion ? 0 : Math.sin(subject.phase * 2.1) * 0.035;
      subject.visual.position.y = bob;
      const leftWing = subject.animal.getObjectByName('wing-left');
      const rightWing = subject.animal.getObjectByName('wing-right');
      if (leftWing && rightWing) {
        leftWing.rotation.z = reducedMotion ? 0 : Math.sin(subject.phase * 7) * 0.5;
        rightWing.rotation.z = reducedMotion ? 0 : -Math.sin(subject.phase * 7) * 0.5;
      }
    }
    for (const collectible of this.collectibles) {
      if (collectible.collected) continue;
      collectible.phase += delta;
      collectible.root.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(collectible.phase * 2) * 0.035);
    }
  }

  updateAtmosphere(delta) {
    if (!WEATHER[this.currentBiome]) {
      this.currentBiome = Number.isFinite(this.save.longitude) ? biomeForLongitude(this.save.longitude) : 'grassland';
    }
    if (!WEATHER[this.currentBiome]) this.currentBiome = 'grassland';
    const phase = (0.25 + this.elapsed / 480) % 1;
    const daylight = 0.16 + Math.max(0, Math.sin(phase * Math.PI * 2)) * 0.84;
    const biomeSky = new THREE.Color(BIOMES[this.currentBiome].sky);
    const nightSky = new THREE.Color(0x24314a);
    const targetSky = nightSky.clone().lerp(biomeSky, daylight);
    const forecast = WEATHER[this.currentBiome] || WEATHER.grassland;
    const weather = forecast[this.weatherOverride?.biomeId === this.currentBiome
      ? this.weatherOverride.index % forecast.length
      : Math.floor(this.elapsed / 32) % forecast.length];
    const weatherTint = new THREE.Color(weather.tint);
    targetSky.lerp(weatherTint, weather.kind === 'none' ? 0.03 : 0.14);
    this.scene.background.lerp(targetSky, 0.025);
    this.scene.fog.color.lerp(targetSky, 0.025);
    this.scene.fog.near = THREE.MathUtils.lerp(this.scene.fog.near, weather.fog * 0.42, 0.03);
    this.scene.fog.far = THREE.MathUtils.lerp(this.scene.fog.far, weather.fog, 0.03);
    this.hemiLight.intensity = (1.25 + daylight * 2.5) * weather.sun;
    this.sunLight.intensity = (1.1 + daylight * 3.25) * weather.sun;
    this.fillLight.intensity = (1.25 + daylight * 1.25) * weather.sun;
    this.stars.material.opacity = 0.12 + (1 - daylight) * 0.76;
    this.atmosphere = {
      phase,
      daylight,
      weather: weather.label,
      weatherId: weather.id,
    };
    this.updateWeatherParticles(weather, delta);
  }

  updateWeatherParticles(weather, delta) {
    const reducedMotion = this.save.settings.reducedMotion;
    this.weatherGroup.position.copy(this.camera.position);
    this.weatherGroup.position.y -= 1.8;
    for (const [kind, points] of Object.entries(this.weatherParticles)) {
      points.visible = kind === weather.kind;
      if (!points.visible || reducedMotion) continue;
      const position = points.geometry.getAttribute('position');
      const fall = kind === 'rain' ? 7 : kind === 'snow' ? 1.1 : kind === 'haze' ? 0.08 : 0.35;
      const drift = kind === 'dust' || kind === 'haze' ? 1.4 : kind === 'pollen' ? 0.45 : 0.15;
      for (let index = 0; index < position.count; index += 1) {
        position.setY(index, position.getY(index) - fall * delta);
        position.setX(index, position.getX(index) + drift * delta);
        if (position.getY(index) < -4 || position.getX(index) > 10) {
          position.setXYZ(index, -10 + Math.random() * 20, 7 + Math.random() * 6, -5 + Math.random() * 10);
        }
      }
      position.needsUpdate = true;
    }
  }

  step(delta) {
    this.elapsed += delta;
    if (this.mode === 'roaming') this.updateMovement(delta);
    if (this.mode === 'camera') {
      if (this.keys.has('arrowleft')) this.photography.adjustAim(-delta * 0.65, 0);
      if (this.keys.has('arrowright')) this.photography.adjustAim(delta * 0.65, 0);
      if (this.keys.has('arrowup')) this.photography.adjustAim(0, delta * 0.65);
      if (this.keys.has('arrowdown')) this.photography.adjustAim(0, -delta * 0.65);
    }
    this.updateCamera();
    this.updateWildlife(delta);
    this.updateAtmosphere(delta);
    this.updateContext();
    this.updateBiome();
    if (!this.save.settings.reducedMotion) {
      this.clouds.rotation.y += delta * 0.012;
      this.stars.rotation.y -= delta * 0.002;
    }
    this.ui.updateHUD({ save: this.save, biomeId: this.currentBiome, context: this.mode === 'roaming' ? this.context : null });
    if (this.saveDirty && this.elapsed - (this.lastSaveAt || 0) > 2) this.persist();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate(now) {
    requestAnimationFrame(this.animate);
    const delta = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    if (!this.manualStepping) this.step(delta || 1 / 60);
    this.render();
  }

  persist() {
    this.save = saveProgress(this.save);
    this.saveDirty = false;
    this.lastSaveAt = this.elapsed;
  }

  playSound(kind) {
    if (!this.save.settings.sound) return;
    try {
      this.audioContext ||= new AudioContext();
      const now = this.audioContext.currentTime;
      const gain = this.audioContext.createGain();
      gain.connect(this.audioContext.destination);
      if (kind === 'shutter') {
        this.cameraAudio.currentTime = 0;
        this.cameraAudio.volume = 0.42;
        void this.cameraAudio.play().catch(() => {});
        return;
      }
      const oscillator = this.audioContext.createOscillator();
      oscillator.connect(gain);
      const presets = {
        cameraOpen: [320, 0.08],
        gather: [620, 0.15],
        reward: [740, 0.25],
        stamp: [880, 0.35],
        finale: [1040, 0.55],
      };
      const [frequency, duration] = presets[kind] || [440, 0.1];
      oscillator.type = kind === 'finale' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.13, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.start(now); oscillator.stop(now + duration);
    } catch {
      // Audio is optional and must never block play.
    }
  }

  async toggleFullscreen() {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
    this.resize();
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  }

  renderGameToText() {
    const visible = [];
    const world = new THREE.Vector3();
    for (const subject of this.photoSubjects) {
      if (subject.collected || subject.root.visible === false) continue;
      subject.focus.getWorldPosition(world);
      const distance = world.distanceTo(PLAYER_POSITION);
      const photoSubject = subject.photoSubject || subject.species;
      if (distance <= 12) visible.push({ id: photoSubject.id, name: photoSubject.name, category: photoSubject.category, distance: Number(distance.toFixed(2)) });
    }
    return JSON.stringify({
      coordinateSystem: 'Player remains at the top of the globe. Longitude increases eastward around the orbit; latitude is clamped north/south.',
      mode: this.mode,
      player: {
        longitude: Number(this.save.longitude.toFixed(4)),
        latitude: Number(this.save.latitude.toFixed(4)),
        biome: this.currentBiome,
      },
      view: {
        perspective: 'first-person',
        cameraPosition: {
          x: Number(this.camera.position.x.toFixed(2)),
          y: Number(this.camera.position.y.toFixed(2)),
          z: Number(this.camera.position.z.toFixed(2)),
        },
        playerBodyVisible: Boolean(this.player?.visible),
      },
      expedition: {
        chapter: currentChapter(this.save.stamps),
        stamps: this.save.stamps,
        discoveries: Object.keys(this.save.discoveries),
        gathered: this.save.lifetimeCollected,
        complete: this.save.completed,
      },
      camera: this.mode === 'camera' ? {
        aim: this.photography.aim,
        focus: this.photography.focus?.subject.photoSubject?.id || this.photography.focus?.subject.species?.id || null,
        ready: Boolean(this.photography.focus?.valid),
      } : null,
      context: this.context ? { kind: this.context.kind, label: this.context.label } : null,
      atmosphere: {
        phase: Number((this.atmosphere?.phase || 0.25).toFixed(3)),
        daylight: Number((this.atmosphere?.daylight || 1).toFixed(2)),
        weather: this.atmosphere?.weather || 'breezy',
      },
      visibleWildlife: visible,
      world: {
        wildlife: this.wildlife.length,
        collectibles: this.collectibles.filter((entry) => !entry.collected).length,
        structures: this.structures.length,
        photoSubjects: this.photoSubjects.length,
        models: this.models.status(),
      },
      settings: { ...this.save.settings },
      bells: this.save.bells,
    });
  }

  installTestHooks() {
    window.render_game_to_text = () => this.renderGameToText();
    window.advanceTime = (milliseconds) => {
      this.manualStepping = true;
      const steps = Math.max(1, Math.round(milliseconds / (1000 / 60)));
      for (let index = 0; index < steps; index += 1) this.step(1 / 60);
      this.render();
      this.manualStepping = false;
    };
    window.__globularTest = {
      waitForModels: () => this.models.whenSettled(),
      setWeather: (biomeId, index) => {
        if (!WEATHER[biomeId] || !Number.isInteger(index)) return false;
        this.weatherOverride = { biomeId, index };
        this.currentBiome = biomeId;
        this.previousBiome = biomeId;
        this.save.longitude = BIOMES[biomeId].center;
        this.updateGlobeOrientation();
        this.updateAtmosphere(1 / 60);
        this.render();
        return true;
      },
      teleportToBiome: (biomeId) => {
        this.save.longitude = BIOMES[biomeId].center;
        this.save.latitude = 0;
        this.updateGlobeOrientation();
        this.updateBiome();
        this.render();
      },
      frameSpecies: (speciesId) => {
        const subject = this.wildlife.find((entry) => entry.species.id === speciesId);
        if (!subject) return false;
        return this.framePhotoSubjectForTest(subject, speciesId);
      },
      frameSubject: (subjectId) => {
        const subject = this.photoSubjects.find((entry) => entry.photoSubject?.id === subjectId && !entry.collected);
        if (!subject) return false;
        return this.framePhotoSubjectForTest(subject, subjectId);
      },
      approachCollectible: (itemId) => {
        const collectible = this.collectibles.find((entry) => entry.item.id === itemId && !entry.collected);
        if (!collectible) return false;
        this.save.longitude = normalizeLongitude(collectible.longitude);
        this.save.latitude = collectible.latitude;
        this.updateGlobeOrientation();
        this.updateBiome();
        this.updateContext();
        this.render();
        return true;
      },
      worldCounts: () => ({
        wildlife: this.wildlife.length,
        collectibles: this.collectibles.length,
        structures: this.structures.length,
        photoSubjects: this.photoSubjects.length,
      }),
      discover: (subjectId) => {
        const subject = PHOTO_SUBJECTS[subjectId];
        if (!subject) return;
        this.save.discoveries[subjectId] = { subjectId, speciesId: SPECIES[subjectId]?.id, biomeId: subject.biome, category: subject.category, discoveredAt: new Date().toISOString() };
        this.checkChapterCompletion();
        this.persist();
      },
      gather: (itemId, count = 1) => {
        this.save.lifetimeCollected[itemId] = (this.save.lifetimeCollected[itemId] || 0) + count;
        this.save.inventory[itemId] = (this.save.inventory[itemId] || 0) + count;
        this.checkChapterCompletion();
        this.persist();
      },
      closeDialog: () => this.ui['modal-action'].click(),
      finish: () => this.completeFinale(),
      reset: async () => {
        clearProgress();
        await clearPhotos();
        location.reload();
      },
    };
  }
}
