import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.GLOBULAR_ROAM_URL || 'http://127.0.0.1:5173';
const outputDir = path.resolve(process.env.GLOBULAR_ROAM_OUTPUT_DIR || 'output/playwright/first-orbit');
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
  assert.equal(framed.view.stride.active, false, `${speciesId}: camera mode should not use walking stride`);
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

const captureSubject = async (subjectId) => {
  console.log(`capture-subject:${subjectId}:start`);
  await closeRequestIfVisible();
  const framedSubject = await page.evaluate((id) => window.__globularTest.frameSubject(id), subjectId);
  assert.equal(framedSubject, true, `${subjectId}: a photo subject should exist`);
  await advance(300);
  await clickForce('#camera-button');
  await advance(700);
  const framed = await state();
  assert.equal(framed.mode, 'camera', `${subjectId}: camera mode should open`);
  assert.equal(framed.view.stride.active, false, `${subjectId}: camera mode should not use walking stride`);
  assert.equal(framed.camera?.focus, subjectId, `${subjectId}: expected subject should be framed`);
  assert.equal(framed.camera?.ready, true, `${subjectId}: subject should be inside the reticle`);
  await page.waitForFunction(() => document.getElementById('photo-result').classList.contains('hidden'));
  await clickForce('#shutter-button');
  await page.waitForFunction(() => !document.getElementById('photo-result').classList.contains('hidden'));
  await page.waitForFunction((id) => {
    const snapshot = JSON.parse(window.render_game_to_text());
    return snapshot.expedition.discoveries.includes(id) && !window.globularRoam.capturing;
  }, subjectId);
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

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  localStorage.clear();
  indexedDB.deleteDatabase('globular_roam_photos');
});
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof window.render_game_to_text === 'function');
const modelStatus = await page.evaluate(() => window.__globularTest.waitForModels());
assert.equal(modelStatus.failed.length, 0, `GLB loads should succeed: ${modelStatus.failed.join(', ')}`);
assert.ok(modelStatus.loaded >= 40, 'the active entity catalog should load its GLB library');

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
assert.equal(opening.view.stride.active, false, 'idle roaming should not activate first-person stride');
const idleCameraY = opening.view.cameraPosition.y;
await page.keyboard.down('w');
await advance(900);
await page.keyboard.up('w');
const walking = await state();
assert.equal(walking.mode, 'roaming');
assert.equal(walking.view.stride.active, true, 'walking should activate first-person stride');
assert.ok(Math.abs(walking.view.cameraPosition.y - idleCameraY) > 0.005, 'walking stride should subtly move the first-person camera');

await captureSpecies('butterfly');
assert.equal((await state()).view.stride.active, false, 'camera mode and photo flow should settle stride before returning to roaming');
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

const expandedPairs = [
  ['grassland', 'hedgehog', 'dewberry'],
  ['desert', 'meerkat', 'amber_shard'],
  ['snow', 'seal', 'frostberry'],
  ['safari', 'lion', 'baobab_pod'],
];
for (const [biomeId, speciesId, itemId] of expandedPairs) {
  await page.evaluate((id) => window.__globularTest.teleportToBiome(id), biomeId);
  await advance(160);
  await captureSpecies(speciesId);
  await gatherItem(itemId);
}
await page.evaluate((id) => window.__globularTest.teleportToBiome(id), 'grassland');
await advance(160);
await captureSubject('daisy');
await captureSubject('bluebell');
await captureSubject('oak_tree');
await page.evaluate((id) => window.__globularTest.teleportToBiome(id), 'desert');
await advance(160);
await captureSubject('prickly_pear_blossom');
await page.evaluate((id) => window.__globularTest.teleportToBiome(id), 'snow');
await advance(160);
await captureSubject('edelweiss');
await page.evaluate((id) => window.__globularTest.teleportToBiome(id), 'safari');
await advance(160);
await captureSubject('flame_lily');
const expandedWorld = await page.evaluate(() => window.__globularTest.worldCounts());
assert.ok(expandedWorld.wildlife >= 60, 'expanded wildlife should include imported animal GLBs');
assert.ok(expandedWorld.collectibles >= 51, 'expanded collectibles should include flower and plant variants');
assert.ok(expandedWorld.structures >= 40, 'expanded structures should include imported prop GLBs');
assert.equal(expandedWorld.photoSubjects, expandedWorld.wildlife + expandedWorld.collectibles + expandedWorld.structures);
assert.equal((await state()).expedition.discoveries.length, 17);
await page.screenshot({ path: path.join(outputDir, '04-expanded-entities.png'), fullPage: true });

await clickForce('#field-guide-button');
await page.waitForSelector('#guide-layer:not(.hidden)');
await page.waitForTimeout(350);
assert.equal(await page.locator('.guide-entry.found').count(), 17);
assert.equal(await page.locator('.guide-entry.found .guide-image img').count(), 17);
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

await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('#continue-button');
await clickForce('#continue-button');
await advance(250);
const restored = await state();
assert.equal(restored.expedition.complete, true);
assert.equal(restored.expedition.discoveries.length, 17);
await clickForce('#field-guide-button');
await page.waitForTimeout(300);
assert.equal(await page.locator('.guide-entry.found .guide-image img').count(), 17);
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
await mobilePage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await mobilePage.waitForSelector('#start-button');
await mobilePage.locator('#start-button').evaluate((element) => element.click());
await mobilePage.waitForSelector('#modal-layer:not(.hidden)');
await mobilePage.locator('#modal-action').evaluate((element) => element.click());
await mobilePage.waitForTimeout(250);
assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
assert.equal(await mobilePage.locator('#joystick-base').isVisible(), true);
assert.equal(await mobilePage.locator('#camera-button').isVisible(), true);
await mobilePage.evaluate(() => window.globularRoam.ui.toastMessage('Mobile roaming layout check'));
await mobilePage.waitForSelector('#toast:not(.hidden)');
const roamingToastBox = await mobilePage.locator('#toast:not(.hidden)').boundingBox();
const roamingContextBox = await mobilePage.locator('#context-button').boundingBox();
const roamingCameraBox = await mobilePage.locator('#camera-button').boundingBox();
const roamingUtilityBox = await mobilePage.locator('.utility-nav').boundingBox();
const boxOverlaps = (first, second) => Boolean(first
  && second
  && first.x < second.x + second.width
  && first.x + first.width > second.x
  && first.y < second.y + second.height
  && first.y + first.height > second.y);
assert.equal(boxOverlaps(roamingToastBox, roamingContextBox), false, 'mobile roaming toast must not cover context action');
assert.equal(boxOverlaps(roamingToastBox, roamingCameraBox), false, 'mobile roaming toast must not cover camera action');
assert.equal(boxOverlaps(roamingToastBox, roamingUtilityBox), false, 'mobile roaming toast must not cover utility actions');
await mobilePage.screenshot({ path: path.join(outputDir, '07-mobile-roaming.png'), fullPage: true });
const cameraBox = await mobilePage.locator('#camera-button').boundingBox();
await mobilePage.touchscreen.tap(cameraBox.x + cameraBox.width / 2, cameraBox.y + cameraBox.height / 2);
await mobilePage.waitForSelector('#camera-overlay:not(.hidden)');
const mobileViewport = mobilePage.viewportSize();
const shutterBox = await mobilePage.locator('#shutter-button').boundingBox();
const cameraCloseBox = await mobilePage.locator('#camera-close').boundingBox();
await mobilePage.evaluate(() => window.globularRoam.ui.toastMessage('Camera notice layout check'));
await mobilePage.waitForSelector('#toast:not(.hidden)');
const toastBox = await mobilePage.locator('#toast:not(.hidden)').boundingBox();
const insideViewport = (box) => box
  && box.x >= 0
  && box.y >= 0
  && box.x + box.width <= mobileViewport.width
  && box.y + box.height <= mobileViewport.height;
const overlaps = (first, second) => first
  && second
  && first.x < second.x + second.width
  && first.x + first.width > second.x
  && first.y < second.y + second.height
  && first.y + first.height > second.y;
assert.equal(insideViewport(shutterBox), true, 'mobile shutter should remain fully inside the viewport');
assert.equal(insideViewport(cameraCloseBox), true, 'mobile camera close should remain fully inside the viewport');
assert.equal(overlaps(toastBox, shutterBox), false, 'camera notices must not cover the mobile shutter');
await mobilePage.screenshot({ path: path.join(outputDir, '08-mobile-camera.png'), fullPage: true });
await mobilePage.locator('#camera-close').evaluate((element) => element.click());
await mobilePage.locator('#settings-button').evaluate((element) => element.click());
await mobilePage.waitForSelector('#settings-layer:not(.hidden)');
await mobilePage.locator('#sound-setting').evaluate((element) => element.click());
await mobilePage.locator('#motion-setting').evaluate((element) => element.click());
const mobileSettings = JSON.parse(await mobilePage.evaluate(() => window.render_game_to_text()));
assert.deepEqual(mobileSettings.settings, { sound: false, reducedMotion: true });
assert.equal(await mobilePage.locator('#sound-setting').getAttribute('aria-checked'), 'false');
assert.equal(await mobilePage.locator('#motion-setting').getAttribute('aria-checked'), 'true');
assert.equal(await mobilePage.evaluate(() => document.documentElement.classList.contains('reduced-motion')), true);
await mobilePage.screenshot({ path: path.join(outputDir, '09-mobile-settings.png'), fullPage: true });
await mobilePage.locator('#settings-close').evaluate((element) => element.click());
await mobilePage.waitForFunction(() => document.getElementById('settings-layer').classList.contains('hidden'));
await mobilePage.keyboard.down('w');
await mobilePage.evaluate((ms) => window.advanceTime(ms), 700);
await mobilePage.keyboard.up('w');
const reducedMotionWalking = JSON.parse(await mobilePage.evaluate(() => window.render_game_to_text()));
assert.equal(reducedMotionWalking.view.stride.active, false, 'reduced motion should disable walking stride');
assert.equal(reducedMotionWalking.view.stride.intensity, 0, 'reduced motion should report zero stride intensity');
await mobilePage.reload({ waitUntil: 'domcontentloaded' });
await mobilePage.waitForSelector('#continue-button');
await mobilePage.locator('#continue-button').evaluate((element) => element.click());
await mobilePage.waitForTimeout(150);
const restoredMobileSettings = JSON.parse(await mobilePage.evaluate(() => window.render_game_to_text()));
assert.deepEqual(restoredMobileSettings.settings, { sound: false, reducedMotion: true });
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
