import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const page = await context.newPage();
await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__lcp.push({ time: entry.startTime, tag: entry.element?.tagName, className: entry.element?.className, url: entry.url });
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
});
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: 200_000,
  uploadThroughput: 75_000,
});
await page.goto(process.argv[2] || 'https://quizfrigopronto.vercel.app/', { waitUntil: 'domcontentloaded' });
await page.locator('.art img').waitFor();
await page.waitForFunction(() => {
  const art = document.querySelector('.art img');
  const logo = document.querySelector('.logo img');
  return art?.complete && art.naturalWidth > 0 && logo?.complete && logo.naturalWidth > 0;
}, null, { timeout: 45000 });
const data = await page.evaluate(() => ({
  lcp: window.__lcp.at(-1),
  images: [...document.images].map((img) => ({
    src: new URL(img.currentSrc).pathname,
    width: img.naturalWidth,
    loadedAt: performance.getEntriesByName(img.currentSrc).at(-1)?.responseEnd || 0,
    transferBytes: performance.getEntriesByName(img.currentSrc).at(-1)?.transferSize || 0,
  })),
  documentMs: performance.getEntriesByType('navigation')[0]?.responseEnd,
  width: document.documentElement.scrollWidth,
}));
console.log(JSON.stringify(data, null, 2));
await browser.close();
