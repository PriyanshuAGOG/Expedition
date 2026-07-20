import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'vercel-bundle');
const source = await readFile(resolve(root, 'World-Diabetes-Day-Expedition-2026-Full-Site.html'), 'utf8');
const chunkSize = 1_850_000;
const chunks = [];

for (let start = 0; start < source.length; start += chunkSize) {
  chunks.push(source.slice(start, start + chunkSize));
}

const asciiJSONString = (value) => JSON.stringify(value).replace(/[^\x20-\x7e]/g, character => {
  const point = character.charCodeAt(0);
  return `\\u${point.toString(16).padStart(4, '0')}`;
});

await mkdir(output, { recursive: true });
await Promise.all(chunks.map((chunk, index) => writeFile(
  resolve(output, `site-${index}.js`),
  `window.__NIROGBHUMI_SITE__.push(${asciiJSONString(chunk)});`,
)));

const scripts = chunks.map((_, index) => `<script src="site-${index}.js"></script>`).join('\n');
const loader = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>World Diabetes Day Expedition 2026 · NirogBhumi</title></head>
<body style="margin:0;background:#06110c">
<script>window.__NIROGBHUMI_SITE__=[];</script>
${scripts}
<script>const site=window.__NIROGBHUMI_SITE__.join('');delete window.__NIROGBHUMI_SITE__;document.open();document.write(site);document.close();</script>
</body></html>`;

await writeFile(resolve(output, 'index.html'), loader);
console.log(`Built Vercel bundle with ${chunks.length} chunks.`);
