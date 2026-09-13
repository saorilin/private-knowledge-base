---
title: 新增章节
description: 从新文件到导航入口的最短路径。
sidebar:
  order: 2
---

## 新增一篇文章

在 `src/content/docs/` 的合适目录新建 `.md` 或 `.mdx` 文件，并填写 `title` frontmatter。

## 让它出现在导航中

- `guides/` 使用自动导航：新文件会自动出现，可用 `sidebar.order` 排序。
- Git、GitHub、JavaScript、DevOps 使用手动导航：还要编辑 `astro.config.mjs` 的 `sidebar`。

## 新增整个目录

1. 在 `src/content/docs/` 新建目录。
2. 添加该目录的 `index.md` 和文章。
3. 在 `astro.config.mjs` 添加手动分组，或配置 `autogenerate`。
