---
title: Runner 与执行环境
description: GitHub-hosted runner、job 隔离、workspace 与可重复运行环境
sidebar:
  order: 4
---

Runner 是实际执行 job 的机器或环境。YAML 不会自己运行，它只是告诉 GitHub 应该在哪里、按什么方式执行任务。

## GitHub-hosted runner

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
```

GitHub 会为 `test` job 准备对应的托管运行环境。常见标签包括：

- `ubuntu-latest`
- `windows-latest`
- `macos-latest`

## Runner 生命周期

```text
job queued
  → runner prepared
  → steps executed
  → logs/results uploaded
  → runner released
```

不要把 GitHub-hosted runner 当成持久服务器。需要保留的输出必须显式上传为 artifact、写入 registry，或发送到其他持久存储。

## 为什么需要 checkout

Runner 启动时不会自动把 repository 源码放进工作目录。通常需要：

```yaml
- name: Checkout source
  uses: actions/checkout@v7
```

随后 test 和 build 命令才能访问项目文件。

## 为什么还要 setup runtime

即使 runner image 可能预装 Node.js，也不应依赖“碰巧存在”的版本：

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v7
  with:
    node-version: '20'
```

显式声明版本可以减少开发机与 CI 环境之间的差异。

:::tip[可重复性]
生产 pipeline 要能回答：“同一个 commit 下周重新运行，依赖和运行时是否仍然可预测？”
:::

## Job 隔离

每个 job 通常拥有独立 runner：

- 文件不会自动跨 job 共享
- 环境变量不会自动跨 job 共享
- 安装的依赖不会自动跨 job 共享
- 一个 job 中启动的进程不会自动出现在另一个 job

需要跨 job 传递文件时，应显式使用 artifact。

## GitHub-hosted 与 self-hosted

| 类型 | 优点 | 需要承担的责任 |
| --- | --- | --- |
| GitHub-hosted | 配置简单、环境临时、维护工作少 | 接受平台提供的规格和镜像变化 |
| Self-hosted | 可访问私有网络、可定制硬件和软件 | 补丁、隔离、容量、凭据和清理都由团队负责 |

初学阶段优先使用 GitHub-hosted runner。

## 延伸阅读

- [GitHub-hosted runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)

