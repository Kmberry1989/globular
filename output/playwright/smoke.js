const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const url = 'file:///Users/kyleberry/Documents/GitHub/globularroam%20copy/index.html';
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('#start-game-btn', { timeout: 10000 });
  await page.click('#start-game-btn');

  await page.waitForSelector('#challenge-board-btn', { timeout: 10000 });
  await page.click('#challenge-board-btn');
  await page.waitForSelector('#challenge-board-modal', { state: 'visible', timeout: 10000 });

  await page.click('[data-challenge-tab="weekly"]');
  await page.waitForTimeout(200);
  await page.click('[data-challenge-tab="rewards"]');
  await page.waitForTimeout(200);
  await page.click('[data-challenge-tab="stats"]');
  await page.waitForTimeout(200);
  await page.click('[data-challenge-tab="daily"]');
  await page.waitForTimeout(200);

  const badgeText = await page.textContent('#challenge-badges');
  if (!badgeText || !badgeText.includes('Featured')) {
    throw new Error('Challenge badges not rendered as expected.');
  }

  await page.screenshot({ path: '/Users/kyleberry/Documents/GitHub/globularroam copy/output/playwright/challenge-board.png', fullPage: true });
  await browser.close();
})();
