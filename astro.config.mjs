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
          items: [
            { label: 'Git 基础', slug: 'git' },
            { label: '基本概念', slug: 'git/basics' },
            { label: 'git init', slug: 'git/init' },
            {
              label: '分支与协作',
              items: [
                { label: 'remote', slug: 'git/remote' },
                { label: 'branch', slug: 'git/branch' },
                { label: 'push / pull', slug: 'git/sync' }
              ]
            }
          ]
        },
        {
          label: 'GitHub',
          items: [
            { label: 'GitHub 基础', slug: 'github' },
            { label: 'GitHub Actions', slug: 'github/actions' },
            { label: 'GitHub Pages', slug: 'github/pages' }
          ]
        },
        {
          label: 'JavaScript',
          items: [
            { label: 'JavaScript 工具链', slug: 'javascript' },
            { label: 'npm', slug: 'javascript/npm' },
            { label: 'package.json', slug: 'javascript/package-json' },
            { label: 'npm scripts', slug: 'javascript/npm-scripts' },
            { label: 'lint', slug: 'javascript/lint' },
            { label: 'test', slug: 'javascript/test' },
            { label: 'build', slug: 'javascript/build' }
          ]
        },
        {
          label: 'DevOps',
          items: [
            { label: 'DevOps 概览', slug: 'devops' },
            { label: 'CI/CD', slug: 'devops/cicd' },
            { label: 'GitHub Actions Workflow', slug: 'devops/github-actions-workflow' }
          ]
        },
        {
          label: '学习指南（自动生成）',
          items: [{ autogenerate: { directory: 'guides' } }]
        }
      ]
    })
  ]
});
