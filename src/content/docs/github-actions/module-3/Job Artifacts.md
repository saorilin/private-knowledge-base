---
title: Job Artifacts
---

## About Artifacts

Artifact 是 workflow 运行过程中生成并保存的文件或目录，例如：

- 前端构建目录 `dist/`
- Java 的 `.jar` 或 `.war`
- .NET publish 目录
- Playwright HTML 报告
- 测试结果、覆盖率报告和失败截图
- server log、性能测试结果和调试文件

GitHub-hosted runner 通常是临时环境。Job 结束后，它的工作目录不会自动交给其他 Job，也不会永久保留。

```text
build Job                         deploy Job
---------                         ----------
生成 dist/                        新的 runner
      │                                ▲
      └─ upload artifact ──────────────┘
```

因此，不同 Job 之间传递文件时，需要显式上传和下载Artifacts。

:::tip[Official Documentation]
[Workflow artifacts - GitHub Docs](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts)
:::

## 上传 Artifact

```yaml
- name: Upload build artifact
  uses: actions/upload-artifact@v7
  with:
    name: dist-files
    path: dist/
    if-no-files-found: error
```

- `name`：Artifact 的逻辑名称，下游 Job 使用它下载。
- `path`：需要保存的文件或目录。
- `if-no-files-found: error`：没有找到预期产物时让 Step 失败，避免出现“绿色但无产物”的 pipeline。
:::tip[Official Documentation]
[actions/upload-artifact](https://github.com/actions/upload-artifact)
:::
## 下载 Artifact

```yaml
- name: Download build artifact
  uses: actions/download-artifact@v8
  with:
    name: dist-files
```

:::tip[Official Documentation]
[actions/download-artifact](https://github.com/actions/download-artifact)
:::

## [Artifacts versus dependency caching](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts#artifacts-versus-dependency-caching)

Artifacts and caching are similar because they provide the ability to store files on GitHub, but each feature offers different use cases and cannot be used interchangeably.

- Use caching when you want to reuse files that don't change often between workflow runs, such as dependencies downloaded by a package management system, intermediate build outputs, or other files that are expensive to regenerate. Caching these files can speed up your workflow runs, though a job should always be able to re-download or regenerate these files if a cache isn't available.
- Use artifacts when you want to save files produced by a job to use or view after a workflow run has ended, such as built binaries or build logs, or when you want to pass files between jobs in a workflow.

For more information on dependency caching, see [Dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching).


---