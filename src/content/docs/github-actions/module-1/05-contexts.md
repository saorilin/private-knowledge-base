---
title: Expressions 与 Contexts
description: GitHub Actions 表达式语法、github context 与日志安全
sidebar:
  order: 6
---

GitHub Actions 在运行时提供 event、commit、branch、job 和 runner 等结构化信息，这些对象称为 contexts。

## Expression 语法

表达式写在 `${{ ... }}` 中：

```yaml
- name: Show commit
  run: echo "sha=${{ github.sha }}"
```

## 常见 contexts

| Context | 包含的信息 |
| --- | --- |
| `github` | repository、event、ref、SHA 和 workflow run 信息 |
| `env` | workflow、job 或 step 环境变量 |
| `vars` | repository、organization 或 environment 配置变量 |
| `job` | 当前 job 的状态和服务容器信息 |
| `steps` | 已执行 step 的 outcome 和 outputs |
| `runner` | 当前 runner 的操作系统和工作路径 |
| `needs` | 前置 job 的结果和 outputs |
| `secrets` | 当前作用域允许访问的 secrets |

## 常用 `github` 字段

```yaml
- name: Output selected metadata
  run: |
    echo "event=${{ github.event_name }}"
    echo "sha=${{ github.sha }}"
    echo "ref=${{ github.ref }}"
    echo "repository=${{ github.repository }}"
    echo "run_id=${{ github.run_id }}"
```

## Context 的用途

- 判断 workflow 是由 push 还是 pull request 触发
- 给 artifact 或 image 添加 commit SHA
- 根据 branch 决定是否执行某个 step
- 读取前置 job 输出
- 在日志中提供有限的排障信息

:::danger[不要无差别打印 Context]
完整 `github` context 包含大量运行信息，也包含 `github.token` 等敏感字段。GitHub 会遮蔽已知 secrets，但生产 workflow 仍应只输出真正需要的字段。
:::

## 不可信输入

Pull Request 标题、Issue 内容和某些 event payload 字段可能由外部用户控制。不要把未经处理的 context 值直接拼入 shell 脚本。

比直接插入脚本更清晰的方式是先放入环境变量，再由 shell 引用：

```yaml
- name: Show pull request title
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: printf '%s\n' "$PR_TITLE"
```

## 小实验

1. 手动运行 workflow，输出 `event_name`、`sha` 和 `ref`。
2. 通过 push 再运行一次。
3. 比较两次运行中的 `event_name`。
4. 不要把 `toJSON(github)` 留在长期 workflow 中。

## 延伸阅读

- [Contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)
- [Expressions reference](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions)

