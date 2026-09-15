---
title: Workflow YAML 结构
description: 最小 GitHub Actions workflow、触发器与 YAML 字段
sidebar:
  order: 3
---

Workflow 文件必须放在 repository 的 `.github/workflows/` 目录中，并使用 `.yml` 或 `.yaml` 扩展名。

## 最小 workflow

```yaml
name: First Workflow

on:
  workflow_dispatch:

jobs:
  first-job:
    runs-on: ubuntu-latest
    steps:
      - name: Print greeting
        run: echo "Hello World!"

      - name: Print goodbye
        run: echo "Bye bye!"
```

## 字段解释

| 字段 | 作用 |
| --- | --- |
| `name` | Actions 页面中显示的 workflow 名称 |
| `on` | 触发 workflow 的事件 |
| `jobs` | workflow 中的 job 集合 |
| `first-job` | 自定义 job ID |
| `runs-on` | job 使用的 runner 类型 |
| `steps` | job 内按顺序执行的步骤 |
| `name` | step 的可读名称 |
| `run` | 在 runner shell 中执行命令 |

## 常用触发器

```yaml
on:
  push:
  pull_request:
  workflow_dispatch:
```

这些事件是 OR 关系：其中任意一个发生，都可以创建一次 workflow run。

### 限制 branch

```yaml
on:
  push:
    branches:
      - main
  pull_request:
```

:::caution
不要因为示例短就写出自己无法解释的紧凑 YAML。触发条件关系到成本、权限和 deployment safety，生产配置应以可读性优先。
:::

## 执行过程

```text
manual click
  → workflow_dispatch event
  → first-job scheduled
  → Ubuntu runner created
  → greeting step
  → goodbye step
  → runner released
```

## 小实验

1. 用 `workflow_dispatch` 手动运行。
2. 增加 `push` 后提交一次修改。
3. 在运行详情中找到 workflow、job 和两个 steps。
4. 预测删除 `on` 或写错缩进时会发生什么。

## 延伸阅读

- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)

