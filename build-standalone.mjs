import { readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname);
let html = await readFile(resolve(root, 'index.html'), 'utf8');
let css = await readFile(resolve(root, 'styles.css'), 'utf8');
const js = await readFile(resolve(root, 'script.js'), 'utf8');

const assetPattern = /assets\/[\w/-]+\.(?:webp|mp3|ogg)/g;
const imagePaths = [...new Set([...(html.match(assetPattern) ?? []), ...(css.match(assetPattern) ?? [])])];

for (const relativePath of imagePaths) {
  const buffer = await readFile(resolve(root, relativePath));
  const mime = extname(relativePath) === '.webp' ? 'image/webp' : extname(relativePath) === '.mp3' ? 'audio/mpeg' : extname(relativePath) === '.ogg' ? 'audio/ogg' : 'application/octet-stream';
  html = html.replaceAll(relativePath, `data:${mime};base64,${buffer.toString('base64')}`);
  css = css.replaceAll(relativePath, `data:${mime};base64,${buffer.toString('base64')}`);
}

html = html
  .replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`)
  .replace('<script src="script.js"></script>', `<script>\n${js}\n</script>`);

const outputs = [
  'World-Diabetes-Day-Expedition-2026-Full-Site.html',
  'World-Diabetes-Day-Expedition-2026-V6-Cloud-Arrival.html',
];
await Promise.all(outputs.map(name => writeFile(resolve(root, name), html)));
console.log(`Built ${outputs.join(' and ')}`);
