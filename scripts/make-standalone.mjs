import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const assetDirectory = 'dist/assets';
const assets = readdirSync(assetDirectory);
const jsFile = assets.find((name) => name.endsWith('.js'));
const cssFile = assets.find((name) => name.endsWith('.css'));
if (!jsFile || !cssFile) throw new Error('Vite did not produce the expected JS and CSS assets.');

const bundledScript = readFileSync(join(assetDirectory, jsFile), 'utf8');
const styles = readFileSync(join(assetDirectory, cssFile), 'utf8').replaceAll(/<\/style/gi, '<\\/style');

function htmlFor(imagePrefix) {
  let script = bundledScript;
  for (const image of ['arte-1.webp', 'livro-frigo-pronto.webp']) {
    const originalPath = JSON.stringify(`/img/${image}`);
    if (!script.includes(originalPath)) throw new Error(`Image ${image} was not found in the build.`);
    script = script.replaceAll(originalPath, JSON.stringify(`${imagePrefix}/img/${image}`));
  }
  script = script.replaceAll(/<\/script/gi, '<\\/script');
  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f7f8f5" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Quiz Frigo Pronto</title>
    <link rel="preconnect" href="https://umbrellacodes.com" />
    <link rel="preconnect" href="https://player-vz-de976c3f-628.tv.pandavideo.com.br" crossorigin />
    <link rel="preload" as="image" href="${imagePrefix}/img/arte-1.webp" fetchpriority="high" />
    <link rel="preload" as="image" href="${imagePrefix}/img/livro-frigo-pronto.webp" fetchpriority="low" />
    <style>${styles}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${script}</script>
  </body>
</html>
`;
}

writeFileSync('index.html', htmlFor('public'));
writeFileSync('dist/index.html', htmlFor('.'));
console.log('Generated standalone index.html for direct file opening.');
