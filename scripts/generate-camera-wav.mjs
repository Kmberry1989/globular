import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 44100;
const durationSeconds = 0.13;
const sampleCount = Math.floor(sampleRate * durationSeconds);
const dataSize = sampleCount * 2;
const wav = Buffer.alloc(44 + dataSize);

wav.write('RIFF', 0);
wav.writeUInt32LE(36 + dataSize, 4);
wav.write('WAVE', 8);
wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(dataSize, 40);

let seed = 7341;
const noise = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed / 2147483647) * 2 - 1;
};

for (let index = 0; index < sampleCount; index += 1) {
  const time = index / sampleRate;
  const firstClick = Math.exp(-time * 95) * noise();
  const secondTime = Math.max(0, time - 0.055);
  const secondClick = time >= 0.055 ? Math.exp(-secondTime * 125) * noise() * 0.72 : 0;
  const mechanism = Math.sin(Math.PI * 2 * 880 * time) * Math.exp(-time * 45) * 0.18;
  const sample = Math.max(-1, Math.min(1, (firstClick + secondClick + mechanism) * 0.48));
  wav.writeInt16LE(Math.round(sample * 32767), 44 + index * 2);
}

const outputPath = path.resolve('sounds/camera.wav');
fs.writeFileSync(outputPath, wav);
console.log(`Generated ${outputPath}`);
