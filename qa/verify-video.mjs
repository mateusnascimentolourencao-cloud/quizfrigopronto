import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const viewportWidth = Number(process.env.VIEWPORT_WIDTH || 390);
const viewportHeight = Number(process.env.VIEWPORT_HEIGHT || 844);
const page = await browser.newPage({ viewport: { width: viewportWidth, height: viewportHeight } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('requestfailed', (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
await page.goto(pathToFileURL(resolve('index.html')).href);
await page.locator('#nome').fill('Teste Silva');
await page.locator('#go').click();
for (let i = 0; i < 6; i++) {
  const width = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  if (width.page > width.viewport) throw Error(`Quiz step ${i + 2} has horizontal overflow: ${JSON.stringify(width)}`);
  await page.locator('.opt').first().click();
  await page.waitForTimeout(260);
}
await page.locator('.load').waitFor();
const player = page.locator('vturb-smartplayer#vid-6b08e54fdbd1503394023689');
await player.waitFor({ state: 'attached' });
await player.evaluate((element) => {
  window.__preloadedPlayer = element;
  window.__playerEvents = [];
  for (const type of ['player:ready', 'video:play', 'video:timeupdate', 'smartautoplay:active']) {
    element.addEventListener(type, (event) => window.__playerEvents.push({ type, time: event.detail?.time ?? null }));
  }
});
await page.locator('.load').waitFor({ state: 'detached', timeout: 15000 });
await page.waitForFunction(() => window.__playerEvents.some((event) => event.type === 'video:play') && window.__playerEvents.some((event) => event.type === 'video:timeupdate' && event.time >= 1), null, { timeout: 15000 });
const result = await page.evaluate(() => ({
  samePlayer: window.__preloadedPlayer === document.querySelector('#vsl vturb-smartplayer'),
  script: !!document.querySelector('script[src="https://scripts.converteai.net/fc14b8b2-f479-4866-940f-001c16b5f106/players/6b08e54fdbd1503394023689/v4/player.js"]'),
  ready: window.__playerEvents.some((event) => event.type === 'player:ready'),
  playing: window.__playerEvents.some((event) => event.type === 'video:play'),
  width: document.documentElement.scrollWidth,
  viewport: window.innerWidth,
  events: window.__playerEvents,
}));
if (!result.samePlayer || !result.script || !result.ready || !result.playing || result.width > result.viewport || errors.length) {
  throw Error(`VTurb integration failed: ${JSON.stringify({ result, errors })}`);
}
await page.screenshot({ path: `qa/video-result-${viewportWidth}.png`, fullPage: true });
console.log(JSON.stringify({ result, errors }, null, 2));
await browser.close();
