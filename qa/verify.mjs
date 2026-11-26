import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const sizes = [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1280, height: 800 }];
const results = [];

for (const size of sizes) {
  const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(pathToFileURL(resolve('index.html')).href, { waitUntil: 'domcontentloaded' });
  await page.locator('#nome').waitFor({ timeout: 5000 });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.logo img').evaluate((image) => image.decode());
  await page.locator('.art img').evaluate((image) => image.decode());
  const assets = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    logo: document.querySelector('.logo img')?.naturalWidth,
    art: document.querySelector('.art img')?.naturalWidth,
    font: document.fonts.check('800 26px Poppins'),
    links: [...document.querySelectorAll('a')].map((link) => link.href),
  }));
  if (assets.lang !== 'it' || !assets.logo || !assets.art || !assets.font) throw Error(`Italian page, supplied images or local font did not load: ${JSON.stringify(assets)}`);
  if (assets.links.length) throw Error(`Unexpected initial link: ${JSON.stringify(assets.links)}`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `qa/react-${size.name}.png`, fullPage: true });
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    height: document.documentElement.scrollHeight,
    title: document.querySelector('h1')?.textContent,
    artWidth: Math.round(document.querySelector('.art')?.getBoundingClientRect().width || 0),
    logoWidth: Math.round(document.querySelector('.logo img')?.getBoundingClientRect().width || 0),
  }));
  if (layout.width > layout.viewport || errors.length) throw Error(`Layout or page errors: ${JSON.stringify({ layout, errors })}`);
  results.push({ size: size.name, ...layout, errors });
  if (size.name === 'mobile') {
    await page.locator('#nome').fill('Teste Silva');
    await page.locator('#go').click();
    if (!await page.locator('h1').textContent().then((x) => x.includes('Teste, quanti anni hai?'))) throw Error('Name step failed');
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
    if (!await page.locator('#buy').isVisible()) throw Error('Delayed purchase button did not appear');
    results.push({ flow: 'all seven steps, back, loading, video and delayed purchase link', buy: await page.locator('#buy').getAttribute('href') });
  }
  await context.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
