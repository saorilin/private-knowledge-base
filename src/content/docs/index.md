---
title: 个人知识库
description: 使用 Astro Starlight、Markdown、MDX 和 Git 管理的个人知识库。
template: splash
hero:
  tagline: 像整理一门大学课程一样，持续积累可检索、可维护的技术笔记。
  actions:
    - text: 从 Git 开始
      link: /private-knowledge-base/git/
      icon: right-arrow
    - text: 学习 Markdown / MDX
      link: /private-knowledge-base/guides/markdown-mdx/
      variant: minimal
      icon: open-book
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## 课程地图

<CardGrid>
  <Card title="Git 与 GitHub" icon="github">理解版本、分支、远程仓库与协作。</Card>
  <Card title="JavaScript 工具链" icon="seti:npm">认识 npm、脚本、测试与构建。</Card>
  <Card title="DevOps" icon="rocket">从 CI/CD 走到自动构建与部署。</Card>
  <Card title="写作指南" icon="document">用 Markdown 和 MDX 写清晰、可复用的知识。</Card>
</CardGrid>

## 这个项目已经具备什么？

- 左侧多级章节导航
- 右侧二级、三级标题目录
- 构建时生成的全文搜索索引
- Light / Dark 模式
- Expressive Code 代码高亮
- GitHub Actions 构建检查

![知识库日常工作流](/private-knowledge-base/images/knowledge-flow.svg)
