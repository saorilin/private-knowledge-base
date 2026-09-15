---
title: 多个 Jobs 与依赖
description: Job 并行、隔离、needs、质量门禁与 artifact 边界
sidebar:
  order: 7
---

一个 workflow 可以包含多个 job。没有依赖关系时，它们可以并行执行。

## 默认并行

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing"

  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying"
```

执行关系：

```text
push
├── test
└── deploy
```

`deploy` 可能在测试完成前开始。这通常不是安全的交付设计。

## 使用 `needs`

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying"
```

```text
test success → deploy starts
test failure → deploy skipped
```

`needs` 不只是控制顺序，它还是最基础的质量门禁。

## 多个前置 job

```yaml
deploy:
  needs: [unit-test, lint, security-scan]
```

默认情况下，前置检查未成功时，依赖它们的 job 不应执行。

## 为什么两个 job 重复 checkout

不同 job 通常运行在不同 runner 上：

```text
test job runner   ≠   deploy job runner
```

因此源码、依赖和生成文件不会自动出现到另一个 job 中。

## Artifact 与 build once

如果 build job 生成了可部署文件，后续 job 应通过 artifact 获取同一份输出：

```text
source
  → build once
  → immutable artifact
  → staging
  → production
```

:::tip[Production mindset]
不要让每个环境重新从源码 build。否则 staging 验证的文件可能与 production 实际部署的文件不同。
:::

Artifact 的上传、下载和保留策略属于下一模块，本页只建立它作为 job 数据边界的概念。

## 小实验

1. 创建两个没有 `needs` 的 jobs，观察是否重叠执行。
2. 给第二个 job 添加 `needs: test`。
3. 故意让 test 失败，确认第二个 job 被跳过。
4. 思考：如果第二个 job 需要第一个 job 生成的文件，该如何传递？

