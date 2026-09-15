---
title: run、uses 与 Action
description: Shell 命令、可复用 Action、输入参数与供应链信任边界
sidebar:
  order: 5
---

一个 step 通常使用 `run` 执行命令，或使用 `uses` 调用 Action。

## `run`

```yaml
- name: Install dependencies
  run: npm ci
```

`run` 在 runner 的 shell 中执行你提供的命令。命令的行为和维护责任主要由项目团队承担。

## `uses`

```yaml
- name: Checkout source
  uses: actions/checkout@v7
```

`uses` 调用一个可复用 Action。格式通常是：

```text
owner/repository@ref
```

Action 可以完成 checkout、设置运行时、上传 artifact 等重复任务。

## `with`

`with` 向 Action 传递输入：

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v7
  with:
    node-version: '20'
```

## 对比

| 写法 | 执行内容 | 主要风险 |
| --- | --- | --- |
| `run` | 自己编写的 shell 命令 | 命令错误、shell 差异、输入注入 |
| `uses` | 外部或本地 Action | 供应链、权限、版本引用和维护者风险 |

:::caution[供应链边界]
使用 `uses` 不只是“少写几行命令”。Action 的代码会在 runner 中执行，并可能接触源码、`GITHUB_TOKEN` 和提供给该 job 的 secrets。
:::

## 选择 Action 时检查什么

- 是否由 GitHub、可信组织或活跃项目维护
- 最近是否仍有更新和安全修复
- Action 需要哪些 permissions
- 是否会读取或发送 secrets
- 使用的是浮动分支、major tag 还是完整 commit SHA

Major tag 易于升级，完整 commit SHA 更不可变。实际选择取决于维护成本与供应链风险要求。

## 最小权限示例

只需要读取 repository 内容的 CI 可以从下面开始：

```yaml
permissions:
  contents: read
```

不要默认每个 job 都需要写权限。

## Self-check

1. `run` 与 `uses` 的责任边界有什么不同？
2. 为什么 Verified creator 也不是绝对安全保证？
3. Tag 和完整 commit SHA 的 trade-off 是什么？

