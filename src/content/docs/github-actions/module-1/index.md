---
title: Module 1 — GitHub Actions 基础
description: 从事件到 workflow、job、runner、step 与失败传播的完整入门心智模型
sidebar:
  order: 1
---

本模块的目标不是记住 YAML，而是能够预测 workflow 在什么条件下运行、每一步在哪里运行，以及失败后哪些工作必须停止。

## 模块地图

| 页面 | 核心问题 |
| --- | --- |
| [核心心智模型](./01-mental-model/) | GitHub Actions 由哪些对象组成？ |
| [Workflow YAML 结构](./02-workflow-syntax/) | 最小 workflow 每个字段做什么？ |
| [Runner 与执行环境](./03-runner/) | 命令究竟在哪里执行？ |
| [`run`、`uses` 与 Action](./04-run-vs-uses/) | 自己运行命令和复用 Action 有什么区别？ |
| [Expressions 与 Contexts](./05-contexts/) | 如何读取运行时信息？ |
| [多个 Jobs 与依赖](./06-multiple-jobs/) | 并行、隔离和 `needs` 如何工作？ |
| [失败、排障与恢复](./07-failures-recovery/) | CI 为什么失败，应该如何处理？ |
| [实验与复习](./08-lab-review/) | 如何证明自己真正理解了？ |

## 整体执行链

```text
GitHub event
  → workflow
  → job
  → runner
  → checkout
  → setup runtime
  → install dependencies
  → test
  → build/deploy gate
```

如果测试命令返回非零 exit code：

```text
test failed
  → job failed
  → dependent jobs skipped
  → inspect logs and fix root cause
```

## 完成本模块后应具备的能力

- 读懂一个最小 workflow
- 区分 workflow、job、runner、step 和 action
- 使用 checkout 和显式 runtime 版本
- 判断 jobs 是并行还是存在依赖
- 从第一个失败 step 开始排障
- 只输出需要的 context 字段
- 解释为什么“pipeline 变绿”不等于设计安全

:::tip[学习方法]
阅读一页后先做对应小实验，再继续下一页。如果只能复述配置，却无法回答“这里失败会发生什么”，说明还没有真正掌握。
:::

