import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

function guideItems(id) {
  const dir = path.resolve('src/content/docs', id);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true }).filter(file => file.endsWith('.md')).sort().map(file => {
    const text = readFileSync(path.join(dir, file), 'utf8');
    const title = JSON.parse(text.match(/^title: (.+)$/m)[1]);
    return { label: title, slug: `${id}/${file.replaceAll('\\', '/').replace(/\.md$/, '').replaceAll('.', '')}` };
  });
}

export default defineConfig({
  site: 'https://petri-net-sim.github.io',
  trailingSlash: 'always',
  integrations: [starlight({
    title: 'Petri Net Simulation Portal',
    description: 'System modeling and simulation with Petri nets. Learning resources and documentation for PetriObjModelPaint and Petri Net Sim.',
    defaultLocale: 'root',
    locales: { root: { label: 'English', lang: 'en' }, uk: { label: 'Українська', lang: 'uk' } },
    logo: { src: './src/assets/mark.svg', replacesTitle: false },
    favicon: '/favicon.svg',
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/petri-net-sim' }],
    customCss: ['./src/styles/docs.css'],
    sidebar: [
      { label: 'Start here', translations: { uk: 'Початок роботи' }, items: [
        { label: 'Choose your tools', slug: 'start', translations: { uk: 'Оберіть інструменти' } },
        { label: 'Your first model', slug: 'learn/first-model', translations: { uk: 'Перша модель' } },
        { label: 'API and libraries', slug: 'integrations', translations: { uk: 'API та бібліотеки' } }
      ] },
      { label: 'PetriObjModelPaint', collapsed: true, items: guideItems('desktop') },
      { label: 'Petri Net Sim', collapsed: true, items: guideItems('web') },
      { label: 'Modeling and PNML', collapsed: true, translations: { uk: 'Моделювання та PNML' }, items: guideItems('modeling') },
      { label: 'About and sources', slug: 'about', translations: { uk: 'Про портал та джерела' } }
    ]
  })]
});
