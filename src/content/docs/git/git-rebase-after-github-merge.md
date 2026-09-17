---
title: Git 案例：GitHub 合并后继续在旧分支开发，导致 push 被拒绝
---

# Git 案例：GitHub 合并后继续在旧分支开发，导致 push 被拒绝

## 场景背景

本次情况的分支结构：

- 本地分支：
  - `master`
  - `clean-up`
- 远程仓库：
  - `origin/master`
  - `origin/clean-up`

事件过程大致如下：

1. 前天在本地 `clean-up` 分支完成了一批修改。
2. 将 `clean-up` push 到 GitHub。
3. 在 GitHub 网页上将 `clean-up` merge 到 `master`。
4. 今天继续在本地 `clean-up` 分支增加内容。
5. 忘记先更新本地 `master` / 获取远程最新状态。
6. 尝试 push 时出现分支历史不一致的问题。

---

## 第一个错误：push master 被拒绝

执行：

```bash
git push origin master
```

出现：

```text
! [rejected] master -> master (fetch first)

Updates were rejected because the remote contains work that you do not
have locally.
```

### 原因

GitHub 上的 `master` 已经因为网页 merge 发生了更新，但本地 `master` 还停留在旧状态。

也就是说：

```text
local master
     |
     A

origin/master
     |
     A --- M
```

其中 `M` 是 GitHub 上 merge 后产生的新提交。

因此，本地 `master` 不能直接 push 覆盖远程 `master`。

---

## 第一步：获取远程最新状态

执行：

```bash
git fetch origin
```

输出类似：

```text
7adae21..df58952  master -> origin/master
```

这说明：

```text
origin/master
```

已经更新到了新的提交。

注意：

```bash
git fetch
```

只更新远程跟踪分支，例如：

```text
origin/master
origin/clean-up
```

它不会直接修改你当前本地分支。

---

## 第二步：确认当前所在分支

执行：

```bash
git branch
```

结果：

```text
* clean-up
  master
```

并且：

```bash
git status
```

显示：

```text
On branch clean-up
nothing to commit, working tree clean
```

说明当前工作区干净，可以安全进行 rebase。

---

## 第三步：让 clean-up 基于最新 master

执行：

```bash
git rebase origin/master
```

Git 输出：

```text
warning: skipped previously applied commit 07277f0
warning: skipped previously applied commit 92d7863

Successfully rebased and updated refs/heads/clean-up.
```

### 为什么 Git 会跳过这些 commit？

因为这些 commit 的内容之前已经通过 GitHub 上的 merge 进入了 `master`。

Git 在 rebase 时发现：

```text
这些修改已经存在于 origin/master
```

因此自动跳过，避免重复应用相同修改。

这是正常现象。

可以把历史理解为：

### merge 之前

```text
master
A

clean-up
A --- B --- C
```

### GitHub merge 之后

```text
master
A ------- M
 \       /
  B --- C
```

但本地 `clean-up` 仍然可能继续从旧历史上发展：

```text
A --- B --- C --- D --- E
```

当执行：

```bash
git rebase origin/master
```

Git 会发现：

- `B`
- `C`

已经包含在新的 `master` 中。

所以只需要把新的：

- `D`
- `E`

重新放到最新 `master` 上。

最终类似：

```text
origin/master
      |
      M --- D' --- E'
```

---

## 第四步：普通 push clean-up 被拒绝

执行：

```bash
git push origin clean-up
```

出现：

```text
! [rejected] clean-up -> clean-up (non-fast-forward)

Updates were rejected because the tip of your current branch is behind
its remote counterpart.
```

### 原因

`rebase` 会重新生成 commit。

例如 rebase 前：

```text
D
E
```

rebase 后会变成：

```text
D'
E'
```

虽然文件内容可能相同，但 commit hash 已经发生变化。

所以本地：

```text
clean-up
M --- D' --- E'
```

而远程：

```text
origin/clean-up
A --- B --- C
```

两边历史已经不是简单的 fast-forward 关系。

Git 因此拒绝普通 push。

---

## 正确处理方式

执行：

```bash
git push --force-with-lease origin clean-up
```

而不是：

```bash
git push --force origin clean-up
```

### 为什么推荐 `--force-with-lease`

`--force-with-lease` 会先检查：

> 远程分支是否仍然是我上次 fetch 时看到的状态？

如果远程分支没有被别人修改，就允许覆盖。

如果其他人已经 push 了新的内容，Git 会拒绝此次强制 push。

因此它比：

```bash
git push --force
```

更安全。

---

## 此时不建议做的事情

不要立即执行：

```bash
git pull origin clean-up
```

因为本地 `clean-up` 刚完成 rebase，历史已经整理好了。

这时候再 pull 远程旧的 `clean-up`，可能会把旧历史重新合并进来，让提交历史变复杂。

在已经确认 rebase 正确的情况下，应直接：

```bash
git push --force-with-lease origin clean-up
```

---

## 最后同步本地 master

远程 `master` 已经是最新状态，但本地 `master` 仍然可能落后。

执行：

```bash
git switch master
git pull --ff-only origin master
```

`--ff-only` 的好处是：

只允许 fast-forward。

如果本地 `master` 出现意外的独立提交，Git 会停止，而不是自动产生一个 merge commit。

同步完成后：

```bash
git switch clean-up
```

继续工作即可。

---

# 本次问题的完整恢复流程

在 `clean-up` 分支工作区干净的前提下：

```bash
git fetch origin
git rebase origin/master
git push --force-with-lease origin clean-up
```

然后同步本地 `master`：

```bash
git switch master
git pull --ff-only origin master
```

如果还要继续在 feature branch 上开发：

```bash
git switch clean-up
```

---

# 核心知识点

## `git fetch`

获取远程仓库最新信息：

```bash
git fetch origin
```

更新：

```text
origin/master
origin/clean-up
```

但不会直接修改当前本地分支。

---

## `git rebase origin/master`

表示：

> 把当前分支尚未进入 `origin/master` 的 commit，重新放到最新 `origin/master` 上。

优点：

- 保持提交历史线性
- 避免不必要的 merge commit
- feature branch 更容易阅读

---

## 为什么 rebase 后经常需要 force push

因为 rebase 会改变 commit hash。

例如：

```text
Before:

A --- B --- C

After rebase:

A --- B' --- C'
```

`B` 和 `B'` 即使修改内容相同，也是两个不同的 Git commit。

因此远程分支不能通过普通 fast-forward 更新。

---

## `--force` vs `--force-with-lease`

不推荐：

```bash
git push --force
```

推荐：

```bash
git push --force-with-lease
```

区别：

```text
--force
    无条件覆盖远程分支

--force-with-lease
    只有远程分支仍然符合预期时才覆盖
```

日常开发优先使用：

```bash
--force-with-lease
```

---

# 以后如何避免

如果一个 feature branch 已经 merge 到 GitHub `master`，之后还想继续使用这个 branch，可以在继续开发前先同步：

```bash
git fetch origin
git switch clean-up
git rebase origin/master
```

然后再开始写新的内容。

更推荐的工作方式是：

```bash
git switch master
git pull --ff-only origin master

git switch -c new-feature
```

即：

> 一个 PR / 一个 feature branch。

feature branch merge 后，不继续长期复用旧 branch，而是从最新 `master` 创建新分支。

例如：

```bash
git switch master
git pull --ff-only origin master
git switch -c cleanup-round-2
```

这样通常可以减少历史分叉、rebase 和 force push 的复杂度。

---

# 快速判断表

| 情况 | 推荐操作 |
|---|---|
| 远程 master 比本地新 | `git fetch origin` |
| 当前 feature branch 基于旧 master | `git rebase origin/master` |
| rebase 后 push 被拒绝 | `git push --force-with-lease` |
| 本地 master 落后远程 | `git pull --ff-only origin master` |
| rebase 时提示 skipped previously applied commit | 通常说明改动已经存在于目标分支 |
| rebase 后远程 feature branch 还是旧历史 | 不要直接 `git pull`，优先 `--force-with-lease` |

---

# 本案例最关键的一句话

> GitHub 上 merge 之后，本地旧 feature branch 不会自动知道远程 master 已经变化；继续开发前应先 fetch，并让当前分支 rebase 到最新 `origin/master`。如果 rebase 改写了历史，再用 `git push --force-with-lease` 更新远程 feature branch。
