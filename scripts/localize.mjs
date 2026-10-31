import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const docs = path.join(root, 'src/content/docs');
const fallbackNotice = '> Український переклад цієї сторінки ще не доступний. Нижче наведено англійський оригінал.';
export const sourceHash = text => createHash('sha256').update(text.replaceAll('\r\n', '\n')).digest('hex');

export function prepareUkrainian(original, existing) {
  // A translated page belongs to its author. Source synchronization must not overwrite it.
  if (existing && !existing.includes(fallbackNotice)) return existing;
  const match = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Missing source frontmatter');
  const title = JSON.parse(match[1].match(/^title: (.+)$/m)[1]);
  const body = match[2].replace(/\]\(\/(desktop|web|modeling|learn|start|integrations|about)(?=[/\)#])/g, '](/uk/$1');
  return `---\ntitle: ${JSON.stringify(title)}\n---\n\n${fallbackNotice}\n\n${body}`;
}

async function walk(dir) {
  const output = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(file));
    else if (file.endsWith('.md')) output.push(file);
  }
  return output;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const record = process.argv.includes('--record') ? process.argv[process.argv.indexOf('--record') + 1] : null;
  const report = { authored: [], fallback: [], needsReview: [] };
  for (const id of ['desktop', 'web', 'modeling']) for (const file of await walk(path.join(docs, id))) {
    const relative = path.relative(docs, file).replaceAll('\\', '/');
    const original = await readFile(file, 'utf8');
    const target = path.join(docs, 'uk', relative);
    let existing = existsSync(target) ? await readFile(target, 'utf8') : null;
    const authored = existing && !existing.includes(fallbackNotice);
    if (authored && record === relative.replace(/\.md$/, '')) {
      existing = existing.replace(/^translationSourceHash:.*\r?\n/m, '').replace(/^---\r?\n/, `---\ntranslationSourceHash: ${sourceHash(original)}\n`);
      await writeFile(target, existing);
    }
    if (authored) {
      report.authored.push(relative);
      const recordedHash = existing.match(/^translationSourceHash:\s*(\S+)/m)?.[1];
      if (recordedHash !== sourceHash(original)) report.needsReview.push(relative);
    } else {
      report.fallback.push(relative);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, prepareUkrainian(original, existing));
    }
  }
  await mkdir(path.join(root, '.cache'), { recursive: true });
  await writeFile(path.join(root, '.cache/localization-report.json'), JSON.stringify(report, null, 2));
  console.log(`Ukrainian guides: ${report.authored.length} authored; ${report.fallback.length} English fallbacks; ${report.needsReview.length} require source review.`);
  for (const file of report.needsReview) console.warn(`Review Ukrainian translation after source changes: ${file}`);
}
