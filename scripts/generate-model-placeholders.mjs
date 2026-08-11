import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_MODEL_ASSETS } from '../src/content.js';

const force = process.argv.includes('--force');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function makePlaceholderGlb(name) {
  const json = Buffer.from(JSON.stringify({
    asset: { version: '2.0', generator: 'Globular Roam placeholder generator' },
    scene: 0,
    scenes: [{ nodes: [0], name: `${name} placeholder` }],
    nodes: [{ mesh: 0, name }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }] }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3' },
      { bufferView: 1, componentType: 5123, count: 3, type: 'SCALAR' },
    ],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 36 }, { buffer: 0, byteOffset: 36, byteLength: 6 }],
    buffers: [{ byteLength: 42 }],
  }));
  const jsonPadding = Buffer.alloc((4 - (json.length % 4)) % 4, 0x20);
  const binary = Buffer.alloc(44);
  binary.writeFloatLE(0, 0); binary.writeFloatLE(0, 4); binary.writeFloatLE(0, 8);
  binary.writeFloatLE(1, 12); binary.writeFloatLE(0, 16); binary.writeFloatLE(0, 20);
  binary.writeFloatLE(0, 24); binary.writeFloatLE(1, 28); binary.writeFloatLE(0, 32);
  binary.writeUInt16LE(0, 36); binary.writeUInt16LE(1, 38); binary.writeUInt16LE(2, 40);
  const totalLength = 12 + 8 + json.length + jsonPadding.length + 8 + binary.length;
  const header = Buffer.alloc(12); header.write('glTF'); header.writeUInt32LE(2, 4); header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(json.length + jsonPadding.length, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binaryHeader = Buffer.alloc(8); binaryHeader.writeUInt32LE(binary.length, 0); binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, json, jsonPadding, binaryHeader, binary]);
}

let created = 0;
let skipped = 0;
for (const [id, asset] of Object.entries(ALL_MODEL_ASSETS)) {
  const destination = path.join(root, asset.path);
  if (!force && fs.existsSync(destination)) { skipped += 1; continue; }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, makePlaceholderGlb(id));
  created += 1;
}
console.log(`Model placeholders: ${created} created, ${skipped} preserved.`);
