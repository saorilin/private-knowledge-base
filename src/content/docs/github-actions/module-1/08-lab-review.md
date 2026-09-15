---
title: 实验与复习
description: Module 1 的动手练习、完成标准和面试式问题
sidebar:
  order: 9
---

只有亲自运行、制造失败并解释日志后，Module 1 才算完成。

## 最小实验仓库

选择一个拥有明确 test 命令的小型项目，例如：

```bash
npm ci
npm test
```

先在本地确认命令成功，再放入 GitHub Actions。

## 实验一：手动 workflow

- [ ] 创建 `.github/workflows/first-workflow.yml`
- [ ] 使用 `workflow_dispatch`
- [ ] 创建一个 job 和两个 `run` steps
- [ ] 手动运行并找到每个 step 的日志

## 实验二：真实测试

- [ ] Checkout repository
- [ ] 显式设置 Node.js 版本
- [ ] 使用 `npm ci` 安装 lockfile 中的依赖
- [ ] 运行 test
- [ ] 解释每个 step 为什么存在

## 实验三：失败传播

- [ ] 故意制造一次测试失败
- [ ] 找到第一个失败 step
- [ ] 确认非零 exit code
- [ ] 修复根因并 push 新 commit
- [ ] 不依赖反复 re-run 掩盖问题

## 实验四：多个 jobs

- [ ] 创建两个无依赖 jobs，观察并行执行
- [ ] 使用 `needs` 建立依赖
- [ ] 让前置 job 失败，确认后续 job 被跳过
- [ ] 输出少量 `github` context 字段

## 完成标准

- [ ] 我能解释 workflow、job、runner、step 和 action
- [ ] 我能说出 `run` 与 `uses` 的区别
- [ ] 我知道为什么每个 job 默认环境独立
- [ ] 我能预测无依赖 jobs 的运行方式
- [ ] 我能用 `needs` 阻止测试失败后的后续工作
- [ ] 我知道跨 job 文件需要 artifact 等显式机制
- [ ] 我能安全地选择 context 字段
- [ ] 我能从日志定位第一个真实失败点

## 面试式问题

1. CI 与 GitHub Actions 是什么关系？
2. Workflow、job 和 step 有什么区别？
3. Runner 启动后为什么通常还需要 checkout？
4. `run` 与 `uses` 有什么区别？
5. 使用第三方 Action 会引入什么风险？
6. GitHub Actions 如何判断命令失败？
7. 为什么两个 job 默认不能共享文件？
8. `needs` 如何影响顺序和失败传播？
9. 为什么不应该打印完整 `github` context？
10. 为什么 pipeline 变绿不代表交付设计一定安全？
11. `git revert` 与 deployment rollback 有什么区别？
12. 如果 deploy 需要 build 输出，你会怎样传递它？

## 下一模块

当以上问题能够用自己的话回答后，再进入：

```text
build
  → artifact
  → Docker image
  → registry
  → staging
  → production
  → health check
  → rollback
```

