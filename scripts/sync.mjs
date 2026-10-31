import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const sources = JSON.parse(await readFile(path.join(root, 'sources.json'), 'utf8'));
const local = process.argv.includes('--local');
const out = path.join(root, 'src/content/docs');
const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();
export const route = (id, file) => `${id}/${file.replace(/\.md$/i, '').replace(/readme$/i, 'overview').toLowerCase()}`;
export function rewriteLinks(text, id, file, files, repository, revision) {
  const resolveLink = (href) => {
    if (/^(https?:|mailto:|data:|#|\/)/i.test(href)) return href;
    const [pathname, anchor] = href.split('#');
    let target;
    try { target = path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURI(pathname))); } catch { return href; }
    if (files.has(target)) return `/${route(id, target)}/${anchor ? '#' + anchor : ''}`;
    if (/\.(png|webp|gif|svg|jpg|jpeg|pnml|json)$/i.test(target) && target.startsWith('docs/')) return `/upstream/${id}/${target}${anchor ? '#' + anchor : ''}`;
    const kind = /\.[a-z0-9]+$/i.test(target) ? 'blob' : 'tree';
    return `https://github.com/${repository}/${kind}/${revision}/${target.split('/').map(encodeURIComponent).join('/')}${anchor ? '#' + anchor : ''}`;
  };
  // Restrict rewriting to Markdown destinations and HTML src/href attributes.
  return text.replace(/(!?\[[^\]\n]*\]\()([^\s)]+)([^)]*\))/g, (_, a, href, b) => a + resolveLink(href) + b)
    .replace(/((?:src|href)=")[^"]+(")/g, (match, a, b) => a + resolveLink(match.slice(a.length, -b.length)) + b);
}
async function api(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'petri-portal', Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) }, signal: AbortSignal.timeout(30000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${url}`);
  return response.json();
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const metadata = {};
  for (const [id, config] of Object.entries(sources)) {
    const dir = path.resolve(root, local ? config.local : `.sources/${id}`);
    let release = null;
    if (!local) {
      release = config.release ? await api(`https://api.github.com/repos/${config.repository}/releases/latest`) : null;
      if (!existsSync(dir)) {
        await mkdir(path.dirname(dir), { recursive: true });
        execFileSync('git', ['clone', '--depth', '1', ...(release ? ['--branch', release.tag_name] : []), `https://github.com/${config.repository}.git`, dir], { stdio: 'inherit' });
      } else {
        git(dir, 'fetch', '--depth', '1', 'origin', release?.tag_name || 'HEAD');
        git(dir, 'checkout', '--detach', 'FETCH_HEAD');
      }
    }
    const revision = git(dir, 'rev-parse', 'HEAD');
    const tracked = git(dir, 'ls-files').split('\n');
    const selected = new Set(tracked.filter(file => /\.md$/i.test(file) && !/README\.[a-z]+\.md$/i.test(file) && (file === 'README.md' || file === 'CONTRIBUTING.md' || file.startsWith('docs/') || ['backend/README.md', 'frontend/README.md'].includes(file) || (id === 'modeling' && file.startsWith('petri_modeling_skills/skills/')))));
    await rm(path.join(out, id), { recursive: true, force: true });
    let count = 0;
    for (const file of selected) {
      let body = (await readFile(path.join(dir, file), 'utf8')).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
      const heading = (body.match(/^#\s+(.+)$/m)?.[1]?.replace(/[`*_]/g, '') || path.basename(file, '.md')).replace(/[\u2013\u2014]/g, '-');
      body = body.replace(/^#\s+.+\r?\n/m, '').replace(/[\u2013\u2014]/g, '-');
      body = rewriteLinks(body, id, file, selected, config.repository, revision);
      const sourceUrl = `https://github.com/${config.repository}/blob/${revision}/${file}`;
      const notice = `> Source: [${config.repository}](${sourceUrl}). ${release ? `Release ${release.tag_name}` : 'Source revision'}: \`${revision.slice(0, 7)}\`. [License](https://github.com/${config.repository}/blob/${revision}/LICENSE).\n\n`;
      const target = path.join(out, route(id, file) + '.md');
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `---\ntitle: ${JSON.stringify(heading)}\neditUrl: ${JSON.stringify(`https://github.com/${config.repository}/edit/HEAD/${file}`)}\n---\n\n${notice}${body}`);
      count++;
    }
    for (const folder of ['docs/assets', 'docs/media']) if (existsSync(path.join(dir, folder))) {
      await mkdir(path.join(root, 'public/upstream', id, path.dirname(folder)), { recursive: true });
      await cp(path.join(dir, folder), path.join(root, 'public/upstream', id, folder), { recursive: true });
    }
    await mkdir(path.join(root, 'public/licenses', id), { recursive: true });
    for (const file of tracked.filter(f => /(^|\/)(LICENSE|NOTICE)(\.[^/]+)?$/.test(f))) {
      const dest = path.join(root, 'public/licenses', id, file);
      await mkdir(path.dirname(dest), { recursive: true });
      await cp(path.join(dir, file), dest);
    }
    const downloads = (release?.assets || []).filter(a => /^petri-swing-ui-.*-(windows|linux|macos)\.zip$/.test(a.name)).map(a => ({ name: a.name, url: a.browser_download_url, platform: a.name.match(/-(windows|linux|macos)\.zip$/)[1], size: a.size }));
    if (!local && id === 'desktop' && release && ['windows', 'linux', 'macos'].some(platform => !downloads.some(a => a.platform === platform))) throw new Error('Desktop release assets are incomplete; preserve the previous site until packaging finishes.');
    let versions = {};
    if (id === 'desktop') {
      const pom = await readFile(path.join(dir, 'pom.xml'), 'utf8');
      for (const name of ['petri-math', 'petri-api', 'petri-model', 'petri-server']) versions[name] = pom.match(new RegExp(`<${name}\\.version>([^<]+)`))?.[1] || '';
    }
    metadata[id] = { repository: config.repository, label: config.label, revision, release: release?.tag_name || null, releaseUrl: release?.html_url || `https://github.com/${config.repository}/releases/latest`, downloads, versions, documents: count };
    console.log(`${id}: ${count} guides, ${revision.slice(0, 7)}${release ? ', ' + release.tag_name : ''}`);
  }
  await mkdir(path.join(root, 'src/data'), { recursive: true });
  await writeFile(path.join(root, 'src/data/sources.json'), JSON.stringify(metadata, null, 2) + '\n');
}
