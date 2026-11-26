import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const base = 'http://localhost:5173';
for (const [label, width, height] of [['mobile', 390, 844], ['desktop', 1280, 800]]) {
  const shots = [];
  for (const path of ['/reference.html', '/']) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.route('**/e?*', (route) => route.fulfill({ status: 204 }));
    await page.route('**/reference.html', (route) => route.fulfill({ contentType: 'text/html', body: readFileSync(new URL('./reference.html', import.meta.url)) }));
    await page.goto(path === '/' ? pathToFileURL(resolve('index.html')).href : base + path, { waitUntil: 'domcontentloaded' });
    await page.locator('#nome').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.logo img').evaluate((image) => image.decode().catch(() => {}));
    await page.locator('.art img').evaluate((image) => image.decode().catch(() => {}));
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    const shot = await page.screenshot({ fullPage: true });
    writeFileSync(`qa/static-${path === '/' ? 'react' : 'source'}-${label}.png`, shot);
    shots.push(shot.toString('base64'));
    await context.close();
  }
  const page = await browser.newPage();
  const result = await page.evaluate(async ([left, right]) => {
    async function pixels(base64) {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      return { width: image.width, height: image.height, data: ctx.getImageData(0, 0, image.width, image.height).data };
    }
    const a = await pixels(left), b = await pixels(right);
    let changed = 0, sum = 0, max = 0, minX = a.width, minY = a.height, maxX = -1, maxY = -1;
    for (let i = 0; i < Math.min(a.data.length, b.data.length); i += 4) {
      const delta = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
      if (delta) {
        changed++;
        const pixel = i / 4, x = pixel % a.width, y = Math.floor(pixel / a.width);
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
      sum += delta;
      max = Math.max(max, delta);
    }
    return { source: `${a.width}x${a.height}`, react: `${b.width}x${b.height}`, changedPixels: changed, totalPixels: a.width * a.height, meanRgbDelta: sum / (a.width * a.height * 3), maxRgbDelta: max, bounds: [minX, minY, maxX, maxY] };
  }, shots);
  console.log(label, JSON.stringify(result));
  await page.close();
}
await browser.close();
