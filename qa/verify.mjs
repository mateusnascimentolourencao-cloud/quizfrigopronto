import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const base = 'http://localhost:5173';
const sizes = [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1280, height: 800 }];
const results = [];

for (const size of sizes) {
  for (const [kind, path] of [['source', '/reference.html'], ['react', '/']]) {
    const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/e?*', (route) => route.fulfill({ status: 204 }));
    await page.route('**/reference.html', (route) => route.fulfill({ contentType: 'text/html', body: readFileSync(new URL('./reference.html', import.meta.url)) }));
    await page.goto(kind === 'react' ? pathToFileURL(resolve('index.html')).href : `${base}${path}`, { waitUntil: 'domcontentloaded' });
    try { await page.locator('#nome').waitFor({ timeout: 5000 }); }
    catch (error) {
      console.error(JSON.stringify({ kind, size: size.name, errors, body: (await page.locator('body').innerText()).slice(0, 700) }));
      throw error;
    }
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.logo img').evaluate((image) => image.decode().catch(() => {}));
    await page.locator('.art img').evaluate((image) => image.decode().catch(() => {}));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `qa/${kind}-${size.name}.png`, fullPage: true });
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      height: document.documentElement.scrollHeight,
      title: document.querySelector('h1')?.textContent,
      artWidth: Math.round(document.querySelector('.art')?.getBoundingClientRect().width || 0),
      logoWidth: Math.round(document.querySelector('.logo img')?.getBoundingClientRect().width || 0),
    }));
    results.push({ kind, size: size.name, ...layout, errors });
    if (kind === 'react' && size.name === 'mobile') {
      await page.locator('#nome').fill('Teste Silva');
      await page.locator('#go').click();
      if (!await page.locator('h1').textContent().then((x) => x.includes('Teste, qual é a sua idade?'))) throw Error('Name step failed');
      await page.locator('#back').click();
      if (await page.locator('#nome').inputValue() !== 'Teste Silva') throw Error('Back step failed');
      await page.locator('#go').click();
      for (let i = 0; i < 6; i++) {
        await page.locator('.opt').first().click();
        await page.waitForTimeout(260);
      }
      await page.locator('.load').waitFor();
      await page.locator('.video iframe').waitFor({ state: 'attached', timeout: 7000 });
      await page.locator('.load').waitFor({ state: 'detached', timeout: 7000 });
      if (await page.locator('#buy').isVisible()) throw Error('Purchase button appeared before delay');
      await page.waitForTimeout(30500);
      if (!await page.locator('#buy').isVisible() || !await page.locator('#nao').isVisible()) throw Error('Delayed buttons did not appear');
      results.push({ flow: 'all seven steps, back, loading, video and delayed links', buy: await page.locator('#buy').getAttribute('href'), no: await page.locator('#nao').getAttribute('href') });
    }
    await context.close();
  }
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
