import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const viewportWidth = Number(process.env.VIEWPORT_WIDTH || 390);
const viewportHeight = Number(process.env.VIEWPORT_HEIGHT || 844);
const page = await browser.newPage({ viewport: { width: viewportWidth, height: viewportHeight } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
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
const player = page.locator('#vsl iframe');
await player.waitFor({ state: 'attached' });
await page.evaluate(() => { window.__preloadedPlayer = document.querySelector('#vsl iframe'); });

async function sample(label) {
  const iframe = await player.elementHandle();
  const frame = await iframe.contentFrame();
  const state = await frame?.evaluate(() => {
    const video = document.querySelector('video');
    return { url: location.href, video: video ? { currentTime: video.currentTime, paused: video.paused, readyState: video.readyState, muted: video.muted } : null };
  }).catch((error) => ({ error: error.message }));
  console.log(JSON.stringify({ label, ...state, errors }));
}

await sample('loading-start');
await page.waitForTimeout(1800);
await sample('loading-mid');
await page.screenshot({ path: `qa/loading-${viewportWidth}.png`, fullPage: true });
await page.locator('.load').waitFor({ state: 'detached', timeout: 10000 });
await sample('result-immediate');
console.log('same iframe:', await page.evaluate(() => window.__preloadedPlayer === document.querySelector('#vsl iframe')));
await page.waitForTimeout(1000);
await sample('result-plus-1s');
await page.screenshot({ path: `qa/video-result-${viewportWidth}.png`, fullPage: true });
console.log('layout:', await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth })));
await browser.close();
