---
title: 失败、排障与恢复
description: Exit code、失败传播、fix forward、git revert 与 deployment rollback
sidebar:
  order: 8
---

GitHub Actions 不理解测试业务含义。它主要通过进程的 exit code 判断 step 是否成功。

## Exit code

```text
exit code 0     → success
non-zero code   → failure
```

普通 step 失败后：

```text
step failed
  → job failed
  → dependent jobs skipped
  → deployment blocked
```

:::tip
错误代码在 deployment 前被 CI 阻止，说明质量门正在正常工作，而不是发生了生产事故。
:::

## 排障顺序

不要第一反应就重复点击 **Re-run jobs**。

1. 找到第一个真正失败的 step。
2. 找到该 step 运行的准确命令。
3. 阅读最接近根因的错误，而不是只看最后一行。
4. 使用相同 runtime 和依赖在本地复现。
5. 判断属于代码、测试、配置、权限、依赖还是 flaky test。
6. 修复根因并创建新 commit。

## 常见失败类型

| 类型 | 典型信号 | 处理方向 |
| --- | --- | --- |
| 代码或测试 | 断言、编译、lint 失败 | 本地复现并修复 |
| Workflow 配置 | YAML、路径、条件错误 | 检查 workflow 结构 |
| 权限或 secrets | permission denied、secret 缺失 | 检查最小权限和作用域 |
| 依赖或环境 | 下载失败、版本不兼容 | 检查 lockfile 和 runtime |
| Flaky test | 相同 commit 有时成功 | 保存证据并消除不确定性 |

## 三种恢复方式

| 方法 | 适用场景 | 发生了什么 |
| --- | --- | --- |
| Fix forward | 错误仍在个人或 feature branch | 新 commit 修复根因 |
| `git revert` | 错误已进入共享分支 | 创建反向 commit，保留历史 |
| Deployment rollback | 坏版本已经部署 | 环境恢复到上一份已验证 artifact/image |

```bash
git log --oneline
git revert <commit-hash>
git push
```

:::caution[Revert 不等于 Rollback]
`git revert` 修改源码历史；deployment rollback 修改环境当前运行的版本。两者可能有关联，但不是同一个动作。
:::

## 排障问题

- 如果 re-run 后变绿，根因真的消失了吗？
- 本地成功、CI 失败时，环境差异在哪里？
- 哪个失败必须阻止 deployment？
- 如果坏版本已经上线，只有 Git revert 是否足够快？

