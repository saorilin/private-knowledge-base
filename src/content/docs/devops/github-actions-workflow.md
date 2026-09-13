---
title: GitHub Actions Workflow
---

Workflow 是 `.github/workflows/` 下的 YAML 自动化定义。

## 核心层级

- **workflow**：完整自动化流程。
- **job**：一组在同一 runner 中执行的步骤。
- **step**：job 内的一次 action 或命令。
- **runner**：执行 job 的临时虚拟机。

## uses 与 run

`uses` 调用别人封装好的 Action，例如检出代码；`run` 直接执行 shell 命令，例如 `npm ci`。

每个 job 默认在独立、干净的 runner 中启动，因此不会自动看到另一个 job 的文件。需要跨 job 传递文件时，要使用 artifact 或 cache 等显式机制。
