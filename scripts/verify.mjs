import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
async function walk(dir) { const entries = await readdir(dir, { withFileTypes: true }); return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat(); }
const files = await walk(root), errors = new Set();
let pages = 0;
for (const file of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8'); pages++;
  if (!/<title>[^<]+<\/title>/.test(html)) errors.add(`Missing title: ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const href = match[1].split('?')[0];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    let target;
    try { target = path.join(root, decodeURIComponent(href)); } catch { errors.add(`Invalid URL: ${href}`); continue; }
    if (!existsSync(target) || ((await stat(target)).isDirectory() && !existsSync(path.join(target, 'index.html')))) errors.add(`Missing target ${href} from ${path.relative(root, file)}`);
  }
}
if (!existsSync(path.join(root, '_pagefind')) && !files.some(f => /pagefind.*\.js$/.test(f))) errors.add('Missing search index');
if (errors.size) { console.error([...errors].slice(0, 40).join('\n')); process.exitCode = 1; }
else console.log(`Verified ${pages} HTML pages, internal links, assets and search index.`);
