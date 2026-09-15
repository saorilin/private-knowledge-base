import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const repositoryUrl = (
  env.PUBLIC_GITHUB_REPOSITORY_URL ||
  'https://github.com/saorilin/private-knowledge-base'
).replace(/\/$/, '');
const base = '/private-knowledge-base';

export default defineConfig({
  site: 'https://saorilin.github.io',
  base,
  integrations: [
    starlight({
      title: '个人知识库',
      description: '用 Markdown 和 MDX 持续整理技术知识。',
      favicon: '/favicon.svg',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' }
      },
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      pagefind: true,
      social: [{ icon: 'github', label: 'GitHub 仓库', href: repositoryUrl }],
      editLink: { baseUrl: `${repositoryUrl}/edit/main/` },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: '首页', slug: 'index' },
        {
          label: 'Git',
          items: [{ autogenerate: { directory: 'git' } }],
        },
        {
          label: 'GitHub-Actions',
          items: [{ autogenerate: { directory: 'github-actions' } }],
        }
      ]
    })
  ]
});
