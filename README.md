# 个人博客/作品集（多页面 · 美观 · 可统计 · 点赞）

> 纯 HTML/CSS/JS 前端 + 可选的无服务器后端（Vercel/Cloudflare）。
> **适合：** GitHub Pages / Vercel / Netlify 等静态托管。

## 功能
- 多页面：`index.html` / `about.html` / `projects.html` / `downloads.html` / `project-*.html`
- 精美深色风格（自定义 `assets/css/style.css`）
- 项目点赞（本地防重复 + 可选服务端全局计数）
- 极简访问统计（`/api/hit` 上报），或接入 Cloudflare Web Analytics/Umami/GoatCounter
- 下载页与项目页模板（含截图位）

## 快速开始
1. 打开 `index.html` 预览。修改文案与项目列表。
2. 将本项目推送到 GitHub，启用 **GitHub Pages**，或一键部署到 **Vercel**。
3. 如果需要**全站访问统计与全局点赞**：
   - 方案 A（零代码接入）：使用 **Cloudflare Web Analytics**（免费）或 **GoatCounter**（免费）
   - 方案 B（轻量自建统计/点赞）：部署 `vercel/api/*.js`（Vercel）或 `cloudflare-worker/worker.js`（Cloudflare Workers）
     - 推荐使用 **Upstash Redis 免费层** 存储计数（将 `UPSTASH_REDIS_REST_URL` 与 `UPSTASH_REDIS_REST_TOKEN` 配置到 Vercel）
     - 部署后，在 HTML 中设置：
       ```html
       <script>
         window.__ENDPOINT__ = {{
           like: '/api/like',
           totals: '/api/totals',
           hit: '/api/hit'
         }};
       </script>
       ```

## 点赞与统计原理
- 无后端时：使用 `localStorage` 防重复，仅在本机显示计数（用于本地展示/开发）
- 有后端时：前端会自动请求 `/api/totals` 获取真实全局计数，并通过 `/api/like` 与 `/api/hit` 上报

## 自定义
- 修改配色与排版：`assets/css/style.css`
- 添加项目：复制 `project-xxx.html` 并在 `projects.html` 与 `index.html` 填入卡片
- 下载链接可以直链存储（GitHub Release、网盘直链、Vercel 静态文件）
- 如果要统计**下载量**，可将下载链接指向你的 `/api/download?url=真实地址`，在中转后对 `downloads:total` 自增。

## 部署小抄（Vercel）
1. 新建 Vercel 项目，导入本仓库
2. 在 **Environment Variables** 配置 Upstash Redis 的两个变量
3. 部署后访问 `/api/totals` 验证
4. 若要自定义域名，绑定 DNS（可用 Cloudflare 代理加速）

## 许可证
MIT
