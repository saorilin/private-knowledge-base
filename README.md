# knowledge-base

一个适合初学者维护的 Astro Starlight 个人知识库，使用 Markdown / MDX 写作、Git 管理，并已准备 GitHub Actions 构建检查。

## 环境要求

- Node.js 22 或更高版本
- npm
- Git

检查版本：

```bash
node --version
npm --version
git --version
```

## 启动知识库

第一次下载项目后安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

终端会显示本地地址。编辑 Markdown 后，浏览器通常会自动刷新。

## 四个常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 根据 `package.json` 和锁文件安装依赖到 `node_modules/` |
| `npm run dev` | 启动开发服务器，面向写作和调试，支持快速刷新 |
| `npm run build` | 生成可部署的生产版本到 `dist/` |
| `npm run preview` | 在本地预览已经构建好的 `dist/`，需要先 build |

`dev` 直接服务源文件并提供开发体验；`preview` 检查最终构建产物，更接近部署结果。`dist/` 是自动生成目录，不应手工编辑，也不提交到 Git。

## 重要目录和文件

| 路径 | 用途 |
| --- | --- |
| `package.json` | 项目清单：脚本、依赖、版本要求 |
| `package-lock.json` | 锁定依赖的精确版本，让本地和 CI 安装一致 |
| `astro.config.mjs` | Astro 与 Starlight 配置：标题、导航、目录、搜索等 |
| `src/content.config.ts` | 定义 Starlight 文档内容集合和校验规则 |
| `src/content/docs/` | 所有知识文章；目录与文件名共同决定页面 URL |
| `src/styles/custom.css` | 少量全局主题样式 |
| `public/` | 原样复制到网站的图片、favicon 等静态文件 |
| `.github/workflows/build.yml` | GitHub Actions 自动构建流程 |
| `dist/` | build 生成的静态网站 |

Markdown 变成网页的过程：Starlight 的内容加载器读取 `src/content/docs/`，Astro 解析 frontmatter 和 Markdown/MDX，Starlight 套用文档布局，Vite/Astro 最终输出 HTML、CSS、JavaScript、图片与 Pagefind 搜索索引到 `dist/`。

## 新增文章

1. 在 `src/content/docs/` 的合适目录创建文件，例如 `git/rebase.md`。
2. 至少写入 frontmatter 和正文：

   ```md
   ---
   title: Git rebase
   description: 理解变基的用途与风险。
   ---

   ## 什么是 rebase？

   正文写在这里。
   ```

3. 如果属于手动导航分组，在 `astro.config.mjs` 的 `sidebar` 中添加 `{ label: 'rebase', slug: 'git/rebase' }`。
4. 如果放在自动生成的 `guides/`，无需改配置；需要排序时设置 `sidebar.order`。

## 新增目录

在 `src/content/docs/` 新建目录，并添加 `index.md`。然后在 `astro.config.mjs` 选择一种方式：

```js
// 手动排序：控制最精确
{ label: '新课程', items: [{ label: '概览', slug: 'new-course' }] }

// 自动生成：目录内新文件自动进入导航
{ label: '新课程', autogenerate: { directory: 'new-course' } }
```

## 插入图片

把图片放入 `public/images/`，然后在文章中写：

```md
![有意义的替代文字](/private-knowledge-base/images/example.png)
```

`/private-knowledge-base` 是当前 GitHub Pages 的 `base`。不要省略替代文字；它有助于无障碍阅读，也能在图片加载失败时说明内容。

## 修改导航和网站配置

编辑 `astro.config.mjs`：

- `title`：顶部网站标题。
- `sidebar`：左侧章节导航。
- `tableOfContents`：右侧页面目录收录的标题级别。
- `pagefind`：全文搜索。
- `social` / `editLink`：设置仓库 URL 后显示 GitHub 链接。

项目默认仓库地址已经配置为：

```text
https://github.com/saorilin/private-knowledge-base
```

只有需要临时覆盖地址时，才复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

`.env` 不会提交到 Git。也可以在运行命令前设置 `PUBLIC_GITHUB_REPOSITORY_URL`。

## Markdown 与 MDX

`.md` 是普通 Markdown，简单、通用，适合绝大多数笔记。`.mdx` 允许在 Markdown 中导入组件并写 JSX，能力更强，但也更接近代码。完整示例见 `src/content/docs/guides/markdown-mdx.mdx`。

## 本地构建

```bash
npm run build
npm run preview
```

每次准备提交较大修改或部署前都建议先 build。

## Git 日常流程

初始化只需一次，本项目已执行：

```bash
git init
```

之后每次修改：

```bash
git status
git add .
git commit -m "docs: add notes about rebase"
git push
```

- `git status`：查看哪些文件被修改、暂存或尚未追踪，不会修改文件。
- `git add .`：把当前目录下的修改放入暂存区，准备进入下一次提交。
- `git commit -m "..."`：把暂存内容保存为一个本地版本，并附上说明。
- `git push`：把本地新提交上传到已配置的远程仓库。

提交前可用 `git diff` 看未暂存差异，用 `git diff --staged` 看即将提交的差异。

## 第一次上传到 GitHub

当前远程仓库已经确定。首次上传执行：

```bash
git remote add origin https://github.com/saorilin/private-knowledge-base.git
git branch -M main
git push -u origin main
```

- `origin`：远程仓库的本地别名，只是惯例名称。
- `main`：本地主分支的名称。
- upstream：当前本地分支默认追踪的远程分支，例如 `origin/main`。
- `-u`：本次推送同时设置 upstream；以后通常只需 `git push` 或 `git pull`。

当前工作区已经配置了 `origin`，因此不需要重复执行 `git remote add origin`；可以先用 `git remote -v` 检查。如果从下载的 ZIP 重新解压项目，因为 ZIP 不包含 `.git/`，仍需先执行 `git init` 和 `git remote add origin ...`。

## GitHub Actions 构建流程

`.github/workflows/build.yml` 在 Pull Request 时检查构建；`.github/workflows/deploy.yml` 在推送到 `main` 时构建并部署 GitHub Pages。

构建 workflow 的结构：

- `name`：workflow 在 Actions 页面显示的名称。
- `on`：触发条件；当前是推送或 Pull Request 指向 `main`。
- `jobs`：要执行的 job 集合。
- `build`：自定义 job ID。
- `runs-on: ubuntu-latest`：为该 job 创建一个临时 Ubuntu runner。
- `steps`：按顺序执行的步骤。
- `uses`：调用封装好的 Action；checkout 取出代码，setup-node 安装 Node.js。
- `with`：传给 Action 的参数。
- `run`：直接运行命令；`npm ci` 严格按锁文件安装，随后执行 build。

每个 job 默认获得独立且干净的 runner。一个 job 创建的文件不会自然出现在另一个 job 中；跨 job 需要显式上传/下载 artifact。这样隔离能提高可重复性，避免隐藏依赖。

## 部署方案一：GitHub Pages

1. 项目已经设置 `site: 'https://saorilin.github.io'` 和 `base: '/private-knowledge-base'`。
2. 项目已经创建 Astro 官方 Pages workflow：`.github/workflows/deploy.yml`。
3. 推送代码前，在仓库 Settings → Pages 中选择 GitHub Actions 作为 Source。
4. 推送到 `main` 后，workflow 会构建并部署。

预期网站地址为 `https://saorilin.github.io/private-knowledge-base/`。如果这个仓库确实是私有仓库，还需要确认当前 GitHub 账户套餐支持从私有仓库使用 Pages，以及你希望的 Pages 可见范围。

## 部署方案二：自己的服务器 / Nginx

1. 本地或 CI 执行 `npm ci && npm run build`。
2. 把 `dist/` 内容上传到服务器，例如 `/var/www/knowledge-base/`。
3. Nginx 将 `root` 指向该目录，并为静态文件提供服务。

示例：

```nginx
server {
    listen 80;
    server_name docs.example.com;
    root /var/www/knowledge-base;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

正式启用前需要真实域名、服务器权限和 HTTPS 配置；这些外部操作没有在本项目中执行。

## 最短日常流程

1. `npm run dev`
2. 新建或修改 Markdown / MDX
3. 在浏览器查看效果
4. `npm run build`
5. `git status`
6. `git add .`
7. `git commit -m "docs: describe the change"`
8. `git push`
