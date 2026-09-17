---
title: "Module 4 — Variables, Contexts, Secrets 与 Environments"
description: "快速理解 GitHub Actions 中配置、敏感信息和运行环境的区别。"
sidebar:
  order: 4
---

本模块解决以下问题：

1. **Environment Variables**：程序怎样从 workflow 读取运行时配置？
2. **GitHub Contexts**：workflow 怎样读取 branch、runner 和 Job 信息？
3. **Variables 与 Secrets**：普通配置和敏感配置应该放在哪里？
4. **GitHub Environments**：怎样区分 `testing`、`staging` 和 `production`？

```text
run 中的环境变量              → $NAME
GitHub Actions 表达式          → ${{ context.name }}
GitHub UI 中的非敏感配置       → vars
密码、Token 等敏感配置         → secrets
testing / staging / production → environment
```

## 快速对比

| 对比项 | `env` | `vars` | `secrets` | Contexts | Environment |
| --- | --- | --- | --- | --- | --- |
| 主要目的 | 把值交给运行中的程序 | 保存非敏感配置 | 保存敏感配置 | 读取 workflow 信息 | 隔离不同运行或部署环境 |
| 定义位置 | Workflow、Job 或 Step | GitHub UI | GitHub UI | GitHub 自动提供 | GitHub UI |
| 读取方式 | `$NAME` 或 `${{ env.NAME }}` | `${{ vars.NAME }}` | `${{ secrets.NAME }}` | `${{ github.ref }}` 等 | Job 中使用 `environment:` |
| 当前例子 | `PORT`、`MONGODB_DB_NAME` | MongoDB cluster 地址 | MongoDB 用户名和密码 | `github.ref`、`runner.os` | `testing` |
| 是否敏感 | 通常否 | 否 | 是 | 取决于 Context | 可以包含 Secrets |

:::tip[选择方法]

- 程序运行时需要读取的值，放进 **`env`**。
- GitHub UI 中可复用的非敏感配置，使用 **`vars`**。
- 密码、Token 和私钥，使用 **`secrets`**。
- branch、commit、runner 或上游 Job 信息，使用对应的 **Context**。
- 需要隔离 testing、staging、production 时，使用 **GitHub Environment**。

:::

## 两套变量语法

```text
${{ ... }} → GitHub Actions 在命令运行前解析
$NAME      → Runner 上的 Shell 在命令运行时解析
```

例如：

```yaml
env:
  PORT: 8080

steps:
  - name: Use environment variable
    run: echo "$PORT"

  - name: Use GitHub context
    run: echo "${{ github.ref }}"
```

在 `run:` 中通常使用 `$NAME`。在 `if:`、`with:` 等 GitHub Actions 配置中使用 `${{ ... }}`。

## 当前 MongoDB Practice

```yaml
jobs:
  test:
    environment: testing
    env:
      PORT: 8080
      MONGODB_DB_NAME: mydatabase
      MONGODB_CLUSTER_ADDRESS: ${{ vars.MONGODB_CLUSTER_ADDRESS }}
      MONGODB_USERNAME: ${{ secrets.MONGODB_USERNAME }}
      MONGODB_PASSWORD: ${{ secrets.MONGODB_PASSWORD }}
```

数据流：

```text
testing Environment
        ↓
vars / secrets
        ↓
Job env
        ↓
npm start
        ↓
process.env.MONGODB_...
```

:::note[Environment 不等于 env]

`environment: testing` 用于选择名为 `testing` 的配置空间。

`env:` 用于把值传给 Runner 上运行的 Shell 和 Node.js 程序。

:::

## 常见错误

- 把密码放进 `vars` 或直接写进 YAML。
- 认为 GitHub UI 中的 `vars` 会自动变成 `process.env`。
- 混淆 `environment: testing` 和 `env:`。
- 混淆 `${{ env.NAME }}` 和 Shell 的 `$NAME`。
- 变量名拼写不一致，例如 `MONGO_DB_NAME` 与 `MONGODB_DB_NAME`。
- 在日志中输出 Secret。

## Official Documentation

- [Variables — GitHub Docs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables)
- [Contexts reference — GitHub Docs](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)
- [Secrets — GitHub Docs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [Deployment environments — GitHub Docs](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)

