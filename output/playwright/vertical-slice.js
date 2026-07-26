import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.GLOBULAR_ROAM_URL || 'http://127.0.0.1:5173';
const outputDir = path.resolve('output/playwright/first-orbit');
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

const state = async () => JSON.parse(await page.evaluate(() => window.render_game_to_text()));
const advance = async (milliseconds = 350) => page.evaluate((ms) => window.advanceTime(ms), milliseconds);
const clickForce = async (selector) => page.locator(selector).evaluate((element) => element.click());
const closeRequestIfVisible = async () => {
  if (await page.locator('#modal-layer:not(.hidden)').count()) {
    await clickForce('#modal-action');
    await advance(120);
  }
};

const captureSpecies = async (speciesId) => {
  console.log(`capture:${speciesId}:start`);
  await closeRequestIfVisible();
  await page.evaluate((id) => window.__globularTest.frameSpecies(id), speciesId);
  await advance(300);
  await clickForce('#camera-button');
  await advance(700);
  const framed = await state();
  console.log(`capture:${speciesId}:framed`, framed.camera);
  assert.equal(framed.mode, 'camera', `${speciesId}: camera mode should open`);
  assert.equal(framed.camera?.focus, speciesId, `${speciesId}: expected subject should be framed`);
  assert.equal(framed.camera?.ready, true, `${speciesId}: subject should be inside the reticle`);
  await page.waitForFunction(() => document.getElementById('photo-result').classList.contains('hidden'));
  await clickForce('#shutter-button');
  await page.waitForFunction(() => !document.getElementById('photo-result').classList.contains('hidden'));
  await page.waitForFunction((id) => {
    const snapshot = JSON.parse(window.render_game_to_text());
    return snapshot.expedition.discoveries.includes(id) && !window.globularRoam.capturing;
  }, speciesId);
  console.log(`capture:${speciesId}:saved`);
  await page.waitForFunction(() => document.getElementById('photo-result').classList.contains('hidden'));
  await clickForce('#camera-close');
  await advance(120);
};

const gatherItem = async (itemId) => {
  console.log(`gather:${itemId}:start`);
  await closeRequestIfVisible();
  const approached = await page.evaluate((id) => window.__globularTest.approachCollectible(id), itemId);
  assert.equal(approached, true, `${itemId}: an uncollected item should exist`);
  await advance(160);
  const nearby = await state();
  assert.equal(nearby.context?.kind, 'collectible', `${itemId}: gather context should appear`);
  await clickForce('#context-button');
  await advance(140);
};

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.clear();
  indexedDB.deleteDatabase('globular_roam_photos');
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForLoadState('networkidle');
await page.waitForFunction(() => typeof window.render_game_to_text === 'function');

await clickForce('#start-button');
await page.waitForSelector('#modal-layer:not(.hidden)');
await closeRequestIfVisible();
await advance(300);
await page.screenshot({ path: path.join(outputDir, '01-grassland-start.png'), fullPage: true });
console.log('route:opening');

const opening = await state();
assert.equal(opening.mode, 'roaming');
assert.equal(opening.expedition.chapter, 'grassland');
assert.equal(opening.visibleWildlife.some((entry) => entry.id === 'butterfly'), true);

await captureSpecies('butterfly');
const bellsAfterFirstPhoto = (await state()).bells;
await captureSpecies('butterfly');
assert.equal((await state()).bells, bellsAfterFirstPhoto, 'duplicate photographs must not award bells');
await gatherItem('starflower');
await gatherItem('starflower');
assert.deepEqual((await state()).expedition.stamps, ['grassland']);
await closeRequestIfVisible();

await page.evaluate(() => window.__globularTest.teleportToBiome('desert'));
await advance(200);
await closeRequestIfVisible();
await captureSpecies('camel');
await gatherItem('sunpetal');
assert.deepEqual((await state()).expedition.stamps, ['grassland', 'desert']);
await closeRequestIfVisible();
await page.screenshot({ path: path.join(outputDir, '02-desert-complete.png'), fullPage: true });

await page.evaluate(() => window.__globularTest.teleportToBiome('snow'));
await advance(200);
await closeRequestIfVisible();
await captureSpecies('penguin');
await captureSpecies('polar_bear');
assert.deepEqual((await state()).expedition.stamps, ['grassland', 'desert', 'snow']);
await closeRequestIfVisible();
await page.screenshot({ path: path.join(outputDir, '03-snow-complete.png'), fullPage: true });

await page.evaluate(() => window.__globularTest.teleportToBiome('safari'));
await advance(200);
await closeRequestIfVisible();
await captureSpecies('zebra');
await captureSpecies('giraffe');
await captureSpecies('elephant');
assert.deepEqual((await state()).expedition.stamps, ['grassland', 'desert', 'snow', 'safari']);
assert.equal((await state()).expedition.chapter, 'return_home');
await closeRequestIfVisible();

await clickForce('#field-guide-button');
await page.waitForSelector('#guide-layer:not(.hidden)');
await page.waitForTimeout(350);
assert.equal(await page.locator('.guide-entry.found').count(), 7);
assert.equal(await page.locator('.guide-entry.found .guide-image img').count(), 7);
await page.screenshot({ path: path.join(outputDir, '04-field-guide.png'), fullPage: true });
await clickForce('#guide-close');

await page.evaluate(() => window.__globularTest.teleportToBiome('grassland'));
await advance(250);
await page.evaluate(() => {
  window.globularRoam.save.longitude = 0.025;
  window.globularRoam.save.latitude = 0.045;
  window.globularRoam.updateGlobeOrientation();
  window.globularRoam.updateContext();
});
await advance(100);
assert.equal((await state()).context?.kind, 'finale');
await clickForce('#context-button');
await page.waitForSelector('#finale-layer:not(.hidden)');
assert.equal((await state()).expedition.complete, true);
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outputDir, '05-finale.png'), fullPage: true });

await page.reload({ waitUntil: 'networkidle' });
await clickForce('#continue-button');
await advance(250);
const restored = await state();
assert.equal(restored.expedition.complete, true);
assert.equal(restored.expedition.discoveries.length, 7);
await clickForce('#field-guide-button');
await page.waitForTimeout(300);
assert.equal(await page.locator('.guide-entry.found .guide-image img').count(), 7);
await page.screenshot({ path: path.join(outputDir, '06-restored-guide.png'), fullPage: true });

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobileContext.newPage();
mobilePage.on('console', (message) => {
  if (message.type() === 'error') errors.push(`mobile console: ${message.text()}`);
});
mobilePage.on('pageerror', (error) => errors.push(`mobile page: ${error.message}`));
await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' });
await mobilePage.locator('#start-button').evaluate((element) => element.click());
await mobilePage.waitForSelector('#modal-layer:not(.hidden)');
await mobilePage.locator('#modal-action').evaluate((element) => element.click());
await mobilePage.waitForTimeout(250);
assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
assert.equal(await mobilePage.locator('#joystick-base').isVisible(), true);
assert.equal(await mobilePage.locator('#camera-button').isVisible(), true);
await mobilePage.screenshot({ path: path.join(outputDir, '07-mobile-roaming.png'), fullPage: true });
const cameraBox = await mobilePage.locator('#camera-button').boundingBox();
await mobilePage.touchscreen.tap(cameraBox.x + cameraBox.width / 2, cameraBox.y + cameraBox.height / 2);
await mobilePage.waitForSelector('#camera-overlay:not(.hidden)');
await mobilePage.screenshot({ path: path.join(outputDir, '08-mobile-camera.png'), fullPage: true });
await mobileContext.close();

if (errors.length) {
  fs.writeFileSync(path.join(outputDir, 'errors.json'), JSON.stringify(errors, null, 2));
}
assert.deepEqual(errors, [], `Browser errors detected:\n${errors.join('\n')}`);
fs.writeFileSync(path.join(outputDir, 'result.json'), JSON.stringify({
  passed: true,
  stamps: restored.expedition.stamps,
  discoveries: restored.expedition.discoveries,
  complete: restored.expedition.complete,
}, null, 2));

await browser.close();
console.log('FIRST_ORBIT_E2E: PASS');
