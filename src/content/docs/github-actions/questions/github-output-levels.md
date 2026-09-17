---
title: "GITHUB_OUTPUT 与 Output 层级"
description: "理解 Step Output、Job Output 和 Reusable Workflow Output 之间的传递关系。"
sidebar:
  order: 2
---

`$GITHUB_OUTPUT` 并不是一个 GitHub Context。它是 GitHub Runner 为**当前 Step**提供的特殊临时文件。

```bash
echo "name=value" >> "$GITHUB_OUTPUT"
```

这条命令始终首先创建 **Step Output**，不会自动创建 Job Output 或 Workflow Output。

```text
$GITHUB_OUTPUT
      ↓
Step Output
      ↓ 显式映射
Job Output
      ↓ 显式映射
Reusable Workflow Output
```

:::tip[核心规则]

`$GITHUB_OUTPUT` 只负责创建当前 Step 的 Output。想把它提升到 Job 或 Reusable Workflow 层级，必须继续显式映射。

:::

## 1. Step Output

```yaml
- name: Publish artifact name
  id: publish
  run: echo "artifact-name=test-report" >> "$GITHUB_OUTPUT"
```

GitHub Runner 会在 Step 结束后读取 `$GITHUB_OUTPUT`，得到：

```text
artifact-name=test-report
```

后续 Step 可以通过下面的表达式读取：

```yaml
${{ steps.publish.outputs.artifact-name }}
```

其中：

- `steps`：当前 Job 中已经执行的 Steps。
- `publish`：前面定义的 `id`。
- `outputs`：这个 Step 创建的 Outputs。
- `artifact-name`：Output 的名称。

### 在后续 Step 中使用

```yaml
- name: Show output
  run: echo "${{ steps.publish.outputs.artifact-name }}"
```

:::caution[Step 必须有 id]

如果没有 `id: publish`，后续 Step 就无法使用 `steps.publish.outputs...` 引用它。

:::

## 2. Job Output

Step Output 不会自动提供给其他 Job。需要在 Job 的 `outputs:` 中公开：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    outputs:
      artifact-name: ${{ steps.publish.outputs.artifact-name }}

    steps:
      - name: Publish artifact name
        id: publish
        run: echo "artifact-name=test-report" >> "$GITHUB_OUTPUT"
```

现在传递过程是：

```text
$GITHUB_OUTPUT
      ↓
steps.publish.outputs.artifact-name
      ↓
build.outputs.artifact-name
```

下游 Job 需要先声明依赖：

```yaml
deploy:
  needs: build
  runs-on: ubuntu-latest

  steps:
    - name: Show artifact name
      run: echo "${{ needs.build.outputs.artifact-name }}"
```

下游 Job 的读取路径是：

```yaml
${{ needs.build.outputs.artifact-name }}
```

完整传递过程：

```text
echo >> $GITHUB_OUTPUT
        ↓
steps.publish.outputs.artifact-name
        ↓
build.outputs.artifact-name
        ↓
needs.build.outputs.artifact-name
```

## 3. Reusable Workflow Output

普通 workflow 没有可以随意设置的全局 Output。只有 Reusable Workflow 才能通过 `workflow_call.outputs` 对调用者公开 Output。

```yaml
on:
  workflow_call:
    outputs:
      artifact-name:
        value: ${{ jobs.build.outputs.artifact-name }}

jobs:
  build:
    runs-on: ubuntu-latest

    outputs:
      artifact-name: ${{ steps.publish.outputs.artifact-name }}

    steps:
      - id: publish
        run: echo "artifact-name=test-report" >> "$GITHUB_OUTPUT"
```

传递层级：

```text
Step Output
    ↓
Job Output
    ↓
Reusable Workflow Output
```

:::note

Reusable Workflow 属于后续内容。目前最重要的是掌握 **Step Output → Job Output**。

:::

## 三个层级对比

| 层级 | 定义方式 | 读取方式 |
| --- | --- | --- |
| Step Output | 写入 `$GITHUB_OUTPUT` | `${{ steps.<id>.outputs.<name> }}` |
| Job Output | Job 的 `outputs:` 映射 Step Output | `${{ needs.<job>.outputs.<name> }}` |
| Reusable Workflow Output | `workflow_call.outputs` 映射 Job Output | 调用它的 Job 通过 `needs` 读取 |

## $GITHUB_OUTPUT 实际是什么？

运行 Step 时，GitHub Runner 会提供一个临时文件路径：

```text
GITHUB_OUTPUT=/runner/中的某个临时文件
```

下面的命令只是向该文件追加一行：

```bash
echo "artifact-name=test-report" >> "$GITHUB_OUTPUT"
```

Step 结束后，Runner 将文件中的 `名称=值` 解析为 Step Outputs。

因此：

```text
$GITHUB_OUTPUT 不是 Context
$GITHUB_OUTPUT 不是普通全局变量
$GITHUB_OUTPUT 是 Runner 提供的特殊文件路径
```

## GITHUB_OUTPUT 与 GITHUB_ENV

### GITHUB_OUTPUT

```bash
echo "NAME=value" >> "$GITHUB_OUTPUT"
```

创建可通过 GitHub Actions Expression 读取的 Step Output：

```yaml
${{ steps.<id>.outputs.NAME }}
```

### GITHUB_ENV

```bash
echo "NAME=value" >> "$GITHUB_ENV"
```

创建供当前 Job 后续 Steps 使用的环境变量：

```bash
echo "$NAME"
```

| 特殊文件 | 主要用途 | 后续读取方式 |
| --- | --- | --- |
| `GITHUB_OUTPUT` | 创建当前 Step 的 Output | `steps.<id>.outputs.NAME` |
| `GITHUB_ENV` | 创建当前 Job 后续 Steps 的环境变量 | Shell 中使用 `$NAME` |

:::tip[一句话记忆]

`GITHUB_OUTPUT` 给 GitHub Actions 的 Output 传递机制使用；`GITHUB_ENV` 给当前 Job 后续运行的 Shell 和程序使用。

:::

## 常见错误

- 认为写入 `$GITHUB_OUTPUT` 会自动创建 Job Output。
- Step 没有设置 `id`。
- Job 没有使用 `outputs:` 公开 Step Output。
- 下游 Job 没有声明 `needs`。
- 在另一个 Job 中直接使用 `steps.publish.outputs...`。
- 混淆 `$GITHUB_OUTPUT` 和 `$GITHUB_ENV`。
- 把文件内容放进 Job Output；文件应该使用 Artifact。

## Official Documentation

- [Workflow commands — Setting an output parameter](https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-an-output-parameter)
- [Passing information between jobs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/pass-job-outputs)

