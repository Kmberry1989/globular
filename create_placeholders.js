#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Create minimal GLB
function makeGLB() {
    const json = JSON.stringify({
        asset:{version:'2.0'},
        scene:0,
        scenes:[{nodes:[0]}],
        nodes:[{mesh:0}],
        meshes:[{primitives:[{attributes:{POSITION:0},indices:1}]}],
        accessors:[
            {bufferView:0,componentType:5126,count:3,type:'VEC3'},
            {bufferView:1,componentType:5123,count:3,type:'SCALAR'}
        ],
        bufferViews:[
            {buffer:0,byteOffset:0,byteStride:12},
            {buffer:0,byteOffset:36}
        ],
        buffers:[{byteLength:42}]
    });
    
    const jsonBuf = Buffer.from(json);
    const jsonPad = Buffer.alloc((4 - (jsonBuf.length % 4)) % 4);
    
    const vertBuf = Buffer.alloc(36);
    vertBuf.writeFloatLE(0, 0); vertBuf.writeFloatLE(0, 4); vertBuf.writeFloatLE(0, 8);
    vertBuf.writeFloatLE(1, 12); vertBuf.writeFloatLE(0, 16); vertBuf.writeFloatLE(0, 20);
    vertBuf.writeFloatLE(0, 24); vertBuf.writeFloatLE(1, 28); vertBuf.writeFloatLE(0, 32);
    
    const idxBuf = Buffer.from([0, 1, 2], 'Uint16');
    const binBuf = Buffer.concat([vertBuf, idxBuf]);
    const binPad = Buffer.alloc((4 - (binBuf.length % 4)) % 4);
    
    const hdr = Buffer.alloc(12);
    hdr.write('glTF', 0);
    hdr.writeUInt32LE(2, 4);
    hdr.writeUInt32LE(12 + 8 + jsonBuf.length + jsonPad.length + 8 + binBuf.length + binPad.length, 8);
    
    const jHdr = Buffer.alloc(8);
    jHdr.writeUInt32LE(jsonBuf.length + jsonPad.length, 0);
    jHdr.writeUInt32LE(0x4e4f534a, 4);
    
    const bHdr = Buffer.alloc(8);
    bHdr.writeUInt32LE(binBuf.length + binPad.length, 0);
    bHdr.writeUInt32LE(0x004e4942, 4);
    
    return Buffer.concat([hdr, jHdr, jsonBuf, jsonPad, bHdr, binBuf, binPad]);
}

// Create directories
fs.mkdirSync('models', {recursive: true});
fs.mkdirSync('sounds', {recursive: true});

// Create model files
const items = ['apple','orange','flower','bush','butterfly','ladybug','firefly','fish','bird','penguin','polarbear','camel','zebra','giraffe','elephant','redpanda','fox','ostrich','crab','coin','tree','cactus','ice_patch','monkey','koala','flamingo','feline'];
items.forEach(item => {
    fs.writeFileSync(path.join('models', `${item}.glb`), makeGLB());
    console.log(`✓ ${item}.glb`);
});

// Create sound files
const sounds = ['gather','sell','click','weather','fish','levelup','coin','birdcall','monkey','koala','flamingo','feline','fox'];
sounds.forEach(s => {
    fs.writeFileSync(path.join('sounds', `${s}.wav`), Buffer.alloc(0));
    console.log(`✓ ${s}.wav`);
});

console.log(`\n✓ Created ${items.length} model files and ${sounds.length} sound files`);
