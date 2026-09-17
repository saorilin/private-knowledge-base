---
title: 概述
description: 理解 GitHub Actions Job 之间的文件传递、元数据传递与依赖缓存。
sidebar:
  order: 3
---

本模块解决以下问题：

1. Job Artifact:：Job生成的文件，如何后续上传&下载&使用？
2. Job Output： Job如何构建Output，如何给后续Job使用？
3. Dependency Caching：怎样减少每次 workflow 都重新下载依赖的时间？

```text
实际文件或目录       → Artifact
少量字符串或元数据   → Job Output
可重新生成的依赖数据 → Cache
```


## 快速对比三者

| 对比项 | Artifact | Job Output | Dependency Cache |
| --- | --- | --- | --- |
| 主要目的 | 保存和传递文件 | 在 Job 之间传递少量信息 | 减少重复下载或生成 |
| 保存内容 | 文件、目录 | 字符串形式的元数据 | 可重新下载或生成的文件 |
| 常见例子 | `dist/`、测试报告、日志 | 文件名、版本号、Artifact 名称 | `~/.npm`、Maven、Gradle 缓存 |
| 使用范围 | Job 之间，也可在运行结束后下载 | 同一 workflow 的依赖 Job | 后续 Job 或 workflow run |
| 丢失后的影响 | 可能失去测试证据或交付文件 | 下游 Job 无法取得所需信息 | pipeline 应仍能运行，只是更慢 |
| 是否适合保存 Secret | 否 | 否 | 否 |

:::tip[选择方法]

- 问题的答案是“一个文件”时，通常使用 **Artifact**。
- 问题的答案是“一个名称或值”时，通常使用 **Job Output**。
- 问题的答案是“怎样让下一次更快”时，通常使用 **Dependency Cache**。

:::



