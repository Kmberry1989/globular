import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const SPECIES_FILES = {
  red_panda: 'redpanda', polar_bear: 'polarbear', arctic_fox: 'fox', fennec: 'fox',
};

const COLLECTIBLE_FILES = {
  starflower: 'flower', sunpetal: 'flower', snowdrop: 'flower', smooth_stone: 'painted_stone',
  ice_glass: 'ice_patch', seed_pod: 'baobab_pod',
};

const baseUrl = import.meta.env.BASE_URL;

export function modelIdForSpecies(species) {
  return SPECIES_FILES[species.id] || species.id;
}

export function modelIdForCollectible(item) {
  if (item.id === 'fallen_feather') return null;
  return COLLECTIBLE_FILES[item.id] || item.id;
}

export function modelIdForStructure(structure) {
  return structure.id;
}

export class ModelLibrary {
  constructor() {
    this.draco = new DRACOLoader();
    this.draco.setDecoderPath(`${baseUrl}draco/`);
    this.loader = new GLTFLoader().setDRACOLoader(this.draco);
    this.templates = new Map();
    this.loading = new Map();
    this.failed = new Set();
  }

  load(modelId) {
    if (!modelId) return Promise.resolve(null);
    if (this.templates.has(modelId)) return Promise.resolve(this.templates.get(modelId));
    if (this.loading.has(modelId)) return this.loading.get(modelId);
    const pending = this.loader.loadAsync(`${baseUrl}${modelId}.glb`)
      .then((gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if (!node.isMesh) return;
          node.castShadow = true;
          node.receiveShadow = true;
        });
        this.templates.set(modelId, model);
        return model;
      })
      .catch(() => {
        this.failed.add(modelId);
        return null;
      })
      .finally(() => this.loading.delete(modelId));
    this.loading.set(modelId, pending);
    return pending;
  }

  attach(modelId, root, height) {
    return this.load(modelId).then((template) => {
      if (!template) return false;
      const model = template.clone(true);
      model.updateMatrixWorld(true);
      const before = new THREE.Box3().setFromObject(model);
      const size = before.getSize(new THREE.Vector3());
      const longest = Math.max(size.x, size.y, size.z, 0.01);
      model.scale.setScalar(height / longest);
      model.rotation.y = Math.PI;
      model.updateMatrixWorld(true);
      const grounded = new THREE.Box3().setFromObject(model);
      model.position.y -= grounded.min.y;
      root.clear();
      root.add(model);
      root.userData.modelId = modelId;
      return true;
    });
  }

  async whenSettled() {
    while (this.loading.size) await Promise.all([...this.loading.values()]);
    return this.status();
  }

  status() {
    return { loaded: this.templates.size, loading: this.loading.size, failed: [...this.failed] };
  }
}
