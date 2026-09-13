---
title: GitHub Pages
---

GitHub Pages 可以托管 Astro 构建出的静态文件。项目仓库通常需要在 `astro.config.mjs` 设置 `site` 和 `base`，再使用官方 Pages Action 部署 `dist/`。

:::caution
`base` 取决于真实仓库名。创建 GitHub 仓库后再填写，不要提前猜测。
:::
