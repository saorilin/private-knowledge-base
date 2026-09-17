---
title: Dependency Caching
---
## [About workflow dependency caching](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching#about-workflow-dependency-caching)

Workflow runs often reuse the same outputs or downloaded dependencies from one run to another. For example, package and dependency management tools such as Maven, Gradle, npm, and Yarn keep a local cache of downloaded dependencies.

Jobs on GitHub-hosted runners start in a clean runner image and must download dependencies each time, causing increased network utilization, longer runtime, and increased cost. To help speed up the time it takes to recreate files like dependencies, GitHub can cache files you frequently use in workflows.

## Caching npm ci

Cache 用于保存可以重新下载或重新生成的内容，例如 npm 的下载缓存。

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: npm-deps-${{ hashFiles('**/package-lock.json') }}

- name: Install dependencies
  run: npm ci
```

在每一个使用同样Dependency的Job里放上这一段。Job 会自动读取储存的cache。如果这些dependencies已储存到cache，直接下载，免去npm ci这个步骤。