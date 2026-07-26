#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Create directory
fs.mkdirSync('sprites', { recursive: true });

// Create PNG placeholder marker (text-based for simplicity)
function createPNG(width, height, colorHex = 'aabbcc') {
    const marker = Buffer.from(`PNG_PLACEHOLDER_${width}x${height}_${colorHex}\n`);
    return marker;
}

// Body parts
const bodyParts = [
    { name: 'head_round', type: 'head' },
    { name: 'head_square', type: 'head' },
    { name: 'head_oval', type: 'head' },
    { name: 'torso_default', type: 'torso' },
    { name: 'torso_muscular', type: 'torso' },
    { name: 'torso_slim', type: 'torso' },
    { name: 'lower_default', type: 'lower' },
    { name: 'lower_shorts', type: 'lower' },
    { name: 'lower_dress', type: 'lower' }
];

// Hair styles
const hairStyles = [
    { name: 'hair_short', type: 'hair' },
    { name: 'hair_long', type: 'hair' },
    { name: 'hair_curly', type: 'hair' },
    { name: 'hair_spiky', type: 'hair' }
];

// Accessories (some locked)
const accessories = [
    { name: 'hat_cap', type: 'hat', locked: false, cost: 0 },
    { name: 'hat_tophat', type: 'hat', locked: true, cost: 500 },
    { name: 'hat_crown', type: 'hat', locked: true, cost: 1000 },
    { name: 'hat_beanie', type: 'hat', locked: false, cost: 0 },
    { name: 'hat_cowboy', type: 'hat', locked: true, cost: 800 },
    { name: 'umbrella_red', type: 'carry', locked: true, cost: 400 },
    { name: 'umbrella_blue', type: 'carry', locked: true, cost: 400 },
    { name: 'backpack_red', type: 'carry', locked: true, cost: 600 },
    { name: 'backpack_green', type: 'carry', locked: true, cost: 600 }
];

// Eyes (facial features)
const eyes = [
    { name: 'eyes_normal', type: 'eyes' },
    { name: 'eyes_happy', type: 'eyes' },
    { name: 'eyes_sleepy', type: 'eyes' },
    { name: 'eyes_surprised', type: 'eyes' }
];

// Create all sprite files
[...bodyParts, ...hairStyles, ...accessories, ...eyes].forEach(sprite => {
    const filename = `sprites/${sprite.name}.png`;
    fs.writeFileSync(filename, createPNG(32, 32, 'aabbcc'));
    console.log(`✓ ${filename}`);
});

// Create configuration JSON for sprites
const spriteConfig = {
    bodyParts: bodyParts.reduce((acc, p) => {
        if (!acc[p.type]) acc[p.type] = [];
        acc[p.type].push(p.name);
        return acc;
    }, {}),
    hair: hairStyles.map(h => h.name),
    eyes: eyes.map(e => e.name),
    accessories: accessories.map(a => ({
        name: a.name,
        type: a.type,
        locked: a.locked,
        cost: a.cost
    }))
};

fs.writeFileSync('sprites/config.json', JSON.stringify(spriteConfig, null, 2));
console.log('✓ sprites/config.json');

console.log(`\n✓ Created ${[...bodyParts, ...hairStyles, ...accessories, ...eyes].length} sprite placeholders`);
console.log('✓ Created sprites/config.json with sprite metadata');
