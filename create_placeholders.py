#!/usr/bin/env python3
import json
import struct
import os

def make_glb():
    """Create minimal valid GLB file"""
    j = json.dumps({
        'asset':{'version':'2.0'},
        'scene':0,
        'scenes':[{'nodes':[0]}],
        'nodes':[{'mesh':0}],
        'meshes':[{'primitives':[{'attributes':{'POSITION':0},'indices':1}]}],
        'accessors':[
            {'bufferView':0,'componentType':5126,'count':3,'type':'VEC3'},
            {'bufferView':1,'componentType':5123,'count':3,'type':'SCALAR'}
        ],
        'bufferViews':[
            {'buffer':0,'byteOffset':0,'byteStride':12},
            {'buffer':0,'byteOffset':36}
        ],
        'buffers':[{'byteLength':42}]
    }).encode()
    
    b = struct.pack('<fff', 0,0,0) + struct.pack('<fff', 1,0,0) + struct.pack('<fff', 0,1,0) + struct.pack('<HHH', 0,1,2)
    j += b' ' * ((4-len(j)%4)%4)
    b += b'\x00' * ((4-len(b)%4)%4)
    
    glb = b'glTF' + struct.pack('<II', 2, 12+8+len(j)+8+len(b)) + struct.pack('<II', len(j), 0x4e4f534a) + j + struct.pack('<II', len(b), 0x004e4942) + b
    return glb

# Create models
os.makedirs('models', exist_ok=True)
items = ['apple','orange','flower','bush','butterfly','ladybug','firefly','fish','bird','penguin','polarbear','camel','zebra','giraffe','elephant','redpanda','fox','ostrich','crab','coin','tree','cactus','ice_patch','monkey','koala','flamingo','feline']
for i in items:
    with open(f'models/{i}.glb', 'wb') as f:
        f.write(make_glb())
    print(f'✓ {i}.glb')

# Create sounds
os.makedirs('sounds', exist_ok=True)
sounds = ['gather','sell','click','weather','fish','levelup','coin','birdcall','monkey','koala','flamingo','feline','fox']
for s in sounds:
    with open(f'sounds/{s}.wav', 'wb') as f:
        f.write(b'')  # Empty placeholder
    print(f'✓ {s}.wav')

print(f'\n✓ Created {len(items)} model files and {len(sounds)} sound files')
