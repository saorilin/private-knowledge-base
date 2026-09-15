---
title: 核心心智模型
description: Workflow、event、job、runner、step 与 action 的关系
sidebar:
  order: 2
---

GitHub Actions 是自动化平台；workflow、job 和 action 是平台中的不同对象，不能混用这些名称。

## 组件关系

```text
Repository event
└── Workflow
    ├── Job A
    │   ├── Step 1: run command
    │   └── Step 2: use action
    └── Job B
        └── Step 1
```

| 概念 | 定义 | 需要记住的边界 |
| --- | --- | --- |
| Event | repository 中发生的事件 | 决定 workflow 何时启动 |
| Workflow | `.github/workflows/` 中的一条自动化流程 | 一个 workflow 可以包含多个 job |
| Job | 一组在同一 runner 上执行的 steps | 不同 job 默认相互隔离 |
| Runner | 实际执行 job 的机器或执行环境 | GitHub-hosted runner 通常是临时环境 |
| Step | job 中按顺序执行的单元 | 可以执行命令或调用 Action |
| Action | 可复用的自动化组件 | 使用它意味着信任其代码和依赖 |

## 顺序与并行

- 同一个 job 内的 steps 默认按顺序执行。
- 没有依赖关系的 jobs 默认可以并行。
- 使用 `needs` 明确 job 之间的依赖关系。

## 常见误区

### Action 等于 workflow

错误。Workflow 是完整流程；Action 是其中可以复用的步骤组件。

### YAML 从上到下决定所有 job 顺序

错误。Step 顺序由 job 内书写顺序决定；job 顺序由依赖图决定。

### Runner 是长期服务器

错误。GitHub-hosted runner 通常在 job 结束后被释放。

## Production mindset

一个安全 pipeline 不仅要保证命令正确，还要正确表达：

- 哪些检查必须先完成
- 哪些任务可以并行
- 哪些数据允许跨 job 传递
- 哪些 job 可以接触 secrets
- 哪个失败应该阻止 deployment

## Self-check

1. Workflow、job 和 step 的职责分别是什么？
2. 两个无依赖 job 会如何执行？
3. 为什么 job 是安全和数据隔离边界？

