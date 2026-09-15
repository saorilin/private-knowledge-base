---
title: 从本地修改到 GitHub 协作
description: Commit、branch、remote、Pull Request 与 Fork 的最小工作流
sidebar:
  order: 2
---

这套流程是 GitHub Actions 的输入端：没有 commit、push 或 pull request，就没有相应的 CI 事件。

## 本地提交流程

```bash
git status
git add <file>
git commit -m "Describe the change"
git log --oneline
```

| 命令 | 作用 |
| --- | --- |
| `git status` | 查看工作区和暂存区状态 |
| `git add` | 选择进入下一次 commit 的修改 |
| `git commit` | 创建一个可追踪的历史节点 |
| `git log --oneline` | 查看精简提交历史 |

## 使用 feature branch

```bash
git switch -c docs/github-actions-notes
```

旧教程中常见的等价写法是：

```bash
git checkout -b docs/github-actions-notes
```

合并时，先切换到接收修改的目标分支：

```bash
git switch main
git merge docs/github-actions-notes
```

:::caution
`git merge feature` 会把 `feature` 合并进**当前分支**。运行前先用 `git branch --show-current` 确认位置。
:::

## 连接远程仓库

```bash
git remote add origin https://github.com/<owner>/<repository>.git
git push -u origin <branch-name>
```

- `origin`：远程仓库的本地别名。
- `-u`：建立本地分支与远程分支的 tracking relationship。
- 建立后，通常可以直接使用 `git push` 和 `git pull`。

在 URL 中加入用户名不会自动授予权限。能否 push 取决于身份认证、仓库授权和 branch protection。

## Collaborator 工作流

```text
clone repository
  → create feature branch
  → edit and commit
  → push feature branch
  → open pull request
  → CI and review
  → merge
```

即使拥有写入权限，也通常不应该直接向 `main` 推送。

## Fork 工作流

没有原仓库写入权限时：

1. 在 GitHub 上 Fork 原仓库。
2. Clone 自己的 Fork。
3. 把原仓库添加为 `upstream`。
4. 在 feature branch 上修改。
5. Push 到自己的 `origin`。
6. 向原仓库创建 Pull Request。

```bash
git clone https://github.com/<your-user>/<repository>.git
cd <repository>
git remote add upstream https://github.com/<original-owner>/<repository>.git
git switch -c new-feature
git push -u origin new-feature
```

Fork 工作流中常见约定：

```text
origin   → 自己的 Fork
upstream → 原始仓库
```

## Branch protection

重要仓库通常要求：

- 必须通过 Pull Request
- 必须通过 CI checks
- 必须获得 review
- 禁止 force push
- 禁止删除受保护分支

## Revert 与 Reset

共享分支需要撤销提交时，优先使用：

```bash
git revert <commit-hash>
```

它会创建一个反向 commit，保留可审计历史。

:::danger
不要为了修复共享 `main` 而随意执行 `git reset --hard` 后 force push。这会重写其他人依赖的历史。
:::

## 下一步

理解 Git 事件后，进入 [GitHub Actions Module 1](../../github-actions/module-1/)。

