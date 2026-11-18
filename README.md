# 留学认证通 - 带可视化后台的 Cloudflare Pages 站点

本项目由原静态 Notion 导出站点改造而来，新增完整内容管理后台，方便你随时新增/编辑文章。

## 技术栈

| 部分 | 技术 |
|------|------|
| 前端框架 | Astro 5（静态生成，极快） |
| 内容格式 | Markdown + Frontmatter |
| 可视化后台 | Decap CMS（原 Netlify CMS） |
| 部署 | Cloudflare Pages |
| 认证 | GitHub OAuth（通过 Pages Functions） |

## 功能一览

- ✅ 完整后台 `/admin`
- ✅ 可视化 Markdown 编辑器（支持图片上传、预览）
- ✅ 新增文章、编辑、设为草稿
- ✅ 保存后自动提交到 GitHub → 触发 Cloudflare 重新构建
- ✅ 原有内容和图片全部保留
- ✅ SEO 友好（sitemap、meta 标签）

---

## 快速开始（本地预览）

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

浏览器打开 http://localhost:4321 即可预览。

本地测试后台（不需要 GitHub）：

1. 在 `public/admin/config.yml` 最上方取消注释 `local_backend: true`
2. 安装并运行本地后端：`npx decap-server`
3. 再访问 http://localhost:4321/admin

---

## 部署到 Cloudflare Pages（正式环境）

### 1. 把代码推到 GitHub

```bash
git init
git add .
git commit -m "init: 带后台的留学认证通站点"
git branch -M main
git remote add origin https://github.com/你的用户名/biye007-cms.git
git push -u origin main
```

### 2. 修改后台配置

打开 `public/admin/config.yml`，把这两处改成你的真实信息：

```yaml
backend:
  name: github
  repo: 你的用户名/biye007-cms     # ← 改这里
  branch: main
  base_url: https://www.biye007.abrdns.com  # ← 你的域名
  auth_endpoint: /api/auth
```

### 3. 创建 GitHub OAuth App（用于后台登录）

1. 打开 https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. 填写：
   - Application name: `留学认证通后台`
   - Homepage URL: `https://www.biye007.abrdns.com`
   - Authorization callback URL: `https://www.biye007.abrdns.com/api/auth/callback`
3. 创建后复制 **Client ID**，并生成 **Client Secret**

### 4. 在 Cloudflare Pages 创建项目

1. 登录 Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选择你的 `biye007-cms` 仓库
3. 构建设置：
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 在 **Settings → Environment variables** 添加两个密钥（Production + Preview 都加）：
   - `GITHUB_CLIENT_ID` = 你刚才复制的 Client ID
   - `GITHUB_CLIENT_SECRET` = Client Secret
5. 保存并部署

### 5. 绑定域名

在 Cloudflare Pages 项目设置里绑定你的自定义域名 `www.biye007.abrdns.com`（或你实际使用的域名）。

### 6. 使用后台

部署成功后访问：

```
https://www.biye007.abrdns.com/admin
```

用 GitHub 账号登录，即可可视化新增/编辑文章。

保存后会自动提交到仓库并触发重新构建，大约 1–2 分钟后前台生效。

---

## 目录结构说明

```
biye007-cms/
├── public/
│   ├── admin/           # Decap CMS 后台
│   │   ├── index.html
│   │   └── config.yml   # 后台配置（必改 repo）
│   ├── assets/          # 图片资源
│   ├── _headers
│   └── robots.txt
├── functions/
│   └── api/
│       ├── auth.js              # OAuth 开始
│       └── auth/callback.js     # OAuth 回调
├── src/
│   ├── content/
│   │   ├── config.ts            # 内容集合定义
│   │   └── posts/               # 文章 Markdown
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
└── package.json
```

---

## 新增文章流程（后台）

1. 打开 `/admin`
2. 点击「新建文章」
3. 填写标题、描述、日期、封面图
4. 用可视化编辑器写正文（支持标题、列表、引用、图片等）
5. 点击「发布」→ 自动提交到 GitHub
6. Cloudflare 自动重新构建并上线

---

## 常见问题

**Q: 后台登录后提示授权失败？**  
检查 `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 是否正确设置，以及 OAuth App 的 Callback URL 是否精确匹配你的域名。

**Q: 想继续用原静态 HTML 风格？**  
当前样式已尽量贴近原 Notion 导出风格。如需进一步调整，修改 `src/styles/global.css` 即可。

**Q: 想换成 TinaCMS 更强的可视化编辑？**  
可以，但需要额外配置 Tina Cloud。当前 Decap 方案零额外费用、最稳妥。

---

## 联系

如需进一步定制（多语言、评论、表单、更复杂的可视化组件等），随时告诉我。
