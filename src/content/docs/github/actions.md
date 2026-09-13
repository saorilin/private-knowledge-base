---
title: GitHub Actions
---

GitHub Actions 会在指定事件发生时执行自动化任务。本项目的 `.github/workflows/build.yml` 会在推送到 `main` 或创建 Pull Request 时安装依赖并构建网站。

## 价值

本地构建通过并不代表其他机器一定成功。Actions 会在干净的 Linux 环境重新执行，帮助发现遗漏的依赖、大小写错误或未提交文件。
