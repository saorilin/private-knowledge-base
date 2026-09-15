---
title: Git
description: 学习 GitHub Actions 前需要掌握的 Git 与 GitHub 协作基础
sidebar:
  order: 1
---

GitHub Actions 围绕 repository、commit、branch、push 和 pull request 工作。不了解这些对象时，很容易只会复制 workflow，却无法解释它为什么运行。

## 本板块目标

完成本板块后，你应该能够：

- 理解 working tree、staging area 和 commit
- 创建并切换 feature branch
- 连接远程 GitHub repository
- 理解 `origin`、upstream tracking 和 `git push -u`
- 区分 collaborator 与 fork 工作流
- 解释为什么 production repository 通常保护 `main`

## 页面

- [从本地修改到 GitHub 协作](./01-local-to-github/)

## 与 CI/CD 的关系

```text
本地修改
  → commit
  → push / pull request
  → GitHub event
  → GitHub Actions workflow
```

:::tip[学习边界]
开始 Module 1 前不需要精通 Git 内部原理，但必须知道当前在哪个 branch、推送了哪个 commit，以及 workflow 是被哪个事件触发的。
:::

