import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

function guideItems(id) {
  const dir = path.resolve('src/content/docs', id);
  if (!existsSync(dir)) return [];
  const labels = {
    desktop: {
      'overview.md': ['Overview', 'Огляд'],
      'contributing.md': ['Contributing', 'Участь у розробці'],
      'docs/desktop-ui.md': ['Desktop editor', 'Настільний редактор'],
      'docs/desktop-mcp.md': ['MCP integration', 'Інтеграція MCP'],
      'docs/desktop-updates.md': ['Application updates', 'Оновлення застосунку'],
      'docs/java-libraries.md': ['Java libraries', 'Java-бібліотеки'],
      'docs/petri-object-models.md': ['Petri-object models', 'Петрі-об’єктні моделі'],
      'docs/petri-server-integration.md': ['Simulation server', 'Сервер симуляції'],
      'docs/training-data-export.md': ['Training data and review', 'Навчальні дані та перевірка']
    },
    web: {
      'overview.md': ['Overview', 'Огляд'],
      'contributing.md': ['Contributing', 'Участь у розробці'],
      'docs/running.md': ['Installation and running', 'Встановлення та запуск'],
      'docs/simulation.md': ['Simulation and statistics', 'Симуляція та статистика'],
      'docs/configuration.md': ['Configuration', 'Налаштування'],
      'docs/deployment.md': ['Deployment', 'Розгортання'],
      'docs/integrations.md': ['HTTP API and MCP', 'HTTP API та MCP'],
      'docs/modeling-skills.md': ['Modeling resources', 'Ресурси моделювання'],
      'docs/petri-objects.md': ['Petri-object models', 'Петрі-об’єктні моделі'],
      'docs/petriobjmodelpaint.md': ['Desktop interoperability', 'Обмін із настільним редактором'],
      'docs/training-review.md': ['Training data and review', 'Навчальні дані та перевірка'],
      'backend/overview.md': ['Backend development', 'Розробка серверної частини'],
      'frontend/overview.md': ['Frontend development', 'Розробка інтерфейсу']
    }
  };
  return readdirSync(dir, { recursive: true }).filter(file => file.endsWith('.md'))
    .map(file => file.replaceAll('\\', '/'))
    .filter(file => !file.startsWith('docs/releases/') && file !== 'docs/overview.md')
    .sort((a, b) => a === 'overview.md' ? -1 : b === 'overview.md' ? 1 : a.localeCompare(b))
    .map(file => {
    const text = readFileSync(path.join(dir, file), 'utf8');
    const title = JSON.parse(text.match(/^title: (.+)$/m)[1]);
    const label = labels[id]?.[file];
    return { label: label?.[0] || title, ...(label ? { translations: { uk: label[1] } } : {}), slug: `${id}/${file.replace(/\.md$/, '').replaceAll('.', '')}` };
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
