import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const assetDirectory = 'dist/assets';
const assets = readdirSync(assetDirectory);
const jsFile = assets.find((name) => name.endsWith('.js'));
const cssFile = assets.find((name) => name.endsWith('.css'));
if (!jsFile || !cssFile) throw new Error('Vite did not produce the expected JS and CSS assets.');

const art = readFileSync('public/img/arte-1.webp').toString('base64');
const imageUrl = `data:image/webp;base64,${art}`;
const originalPath = '"/img/arte-1.webp"';
let script = readFileSync(join(assetDirectory, jsFile), 'utf8');
if (!script.includes(originalPath)) throw new Error('The first quiz image was not found in the build.');
script = script.replaceAll(originalPath, JSON.stringify(imageUrl)).replaceAll(/<\/script/gi, '<\\/script');
const styles = readFileSync(join(assetDirectory, cssFile), 'utf8').replaceAll(/<\/style/gi, '<\\/style');

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#f7f8f5" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Quiz Geladeira Pronta</title>
    <link rel="preconnect" href="https://umbrellacodes.com" />
    <link rel="preconnect" href="https://player-vz-de976c3f-628.tv.pandavideo.com.br" crossorigin />
    <style>${styles}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${script}</script>
  </body>
</html>
`;

writeFileSync('index.html', html);
writeFileSync('dist/index.html', html);
console.log('Generated standalone index.html for direct file opening.');
